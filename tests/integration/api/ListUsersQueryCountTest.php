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
use Illuminate\Database\Connection;

/**
 * Demonstrates the N+1 query problem in AddBasicUserAttributes.
 *
 * For each serialized user, up to three queries are issued:
 *   - FollowState::for()               → SELECT from user_followers (followed state)
 *   - FollowState::getFollowerCount()  → COUNT from user_followers
 *   - FollowState::getFollowingCount() → COUNT from user_followers
 *
 * The two tests seed different numbers of users and assert the same query ceiling.
 * With N+1 the second test fails; after the fix both pass with the same count.
 */
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
            'users'          => $users,
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

        return $log;
    }

    /**
     * @test
     */
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

    /**
     * @test
     */
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
