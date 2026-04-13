<?php

/*
 * This file is part of ianm/follow-users
 *
 *  Copyright (c) Ian Morland.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 *
 */

namespace IanM\FollowUsers\Tests\integration\api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use Illuminate\Database\Connection;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use PHPUnit\Framework\Attributes\Test;

/**
 * Guards against N+1 queries in UserResourceFields when listing users.
 *
 * Without the fix, three queries are issued PER serialized user:
 *   - FollowState::for()               → SELECT from user_followers (followed state)
 *   - FollowState::getFollowerCount()  → COUNT from user_followers
 *   - FollowState::getFollowingCount() → COUNT from user_followers
 *
 * The two tests seed different numbers of users but assert the SAME query ceiling,
 * proving the count is constant (O(1)) regardless of list size.
 *
 * --- Query budget breakdown (ceiling = 15) ---
 *
 *  5  fixed request overhead: actor lookup, last_seen update, actor groups,
 *     list SELECT, pagination COUNT
 *  1  groups batch     loadMissing('groups') for all listed users
 *  1  counts batch     loadCount(['followedUsers','followedBy']) — single correlated-subquery SELECT
 *  1  follow-state batch  seedActorFollowStates — one SELECT … WHERE … IN (…)
 *  2  notification counts  unreadNotificationCount + newNotificationCount for the actor
 *     (visible-to-self fields in core UserResource; not present in 1.x BasicUserSerializer)
 *  1  followedUsers include batch
 * ---
 * 11  total (access_tokens queries from the 2.x test framework are excluded as infrastructure noise)
 */
#[RunTestsInSeparateProcesses]
class ListUsersQueryCountTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->extension('ianm-follow-users');
    }

    protected function seedUsers(array $users, array $followers = []): void
    {
        $this->prepareDatabase([
            User::class      => $users,
            'user_followers' => $followers,
        ]);
    }

    protected function queryCountForUserList(): array
    {
        /** @var Connection $db */
        $db = $this->database();
        $db->enableQueryLog();

        $response = $this->send(
            $this->request('GET', '/api/users', ['authenticatedAs' => 1])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $log = $db->getQueryLog();
        $db->flushQueryLog();

        // Exclude access_tokens queries — they are test-framework infrastructure
        // (Flarum 2.x creates real DB tokens; 1.x used session variables with 0 DB
        // overhead). Filtering them keeps the ceiling comparable to the 1.x baseline.
        return array_values(array_filter($log, fn ($q) => !str_contains($q['query'], 'access_tokens')));
    }

    #[Test]
    public function list_users_with_few_users(): void
    {
        $this->seedUsers(
            [
                $this->normalUser(),
                ['id' => 3, 'username' => 'user3', 'email' => 'user3@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'user4', 'email' => 'user4@machine.local', 'is_email_confirmed' => true],
            ],
            [
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'subscription' => 'follow', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
                ['id' => 2, 'user_id' => 3, 'followed_user_id' => 4, 'subscription' => 'follow', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
            ]
        );

        $log = $this->queryCountForUserList();

        $this->assertLessThanOrEqual(11, count($log), $this->formatQueryLog($log));
    }

    #[Test]
    public function list_users_with_many_users(): void
    {
        $users = [$this->normalUser()];
        $followers = [];

        for ($i = 3; $i <= 12; $i++) {
            $users[] = [
                'id'                 => $i,
                'username'           => "user{$i}",
                'email'              => "user{$i}@machine.local",
                'is_email_confirmed' => true,
            ];
            $followers[] = [
                'id'               => $i - 2,
                'user_id'          => $i - 1,
                'followed_user_id' => $i,
                'subscription'     => 'follow',
                'created_at'       => '2024-01-01 00:00:00',
                'updated_at'       => '2024-01-01 00:00:00',
            ];
        }

        $this->seedUsers($users, $followers);

        $log = $this->queryCountForUserList();

        $this->assertLessThanOrEqual(11, count($log), $this->formatQueryLog($log));
    }

    private function formatQueryLog(array $log): string
    {
        return sprintf(
            "%d queries executed:\n%s",
            count($log),
            implode("\n", array_map(fn ($q) => '  '.$q['query'], $log))
        );
    }
}
