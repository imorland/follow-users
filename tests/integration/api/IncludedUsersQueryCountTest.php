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

use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use PHPUnit\Framework\Attributes\Test;

/**
 * Guards against N+1 queries when User resources are serialized as *included*
 * resources from endpoints other than UserResource::Index.
 *
 * The batch-loading in extend.php is attached to UserResource's Index endpoint,
 * so it only primes the FollowState caches for /api/users. Every other endpoint
 * that includes users — /api/discussions (firstUser, lastPostedUser), /api/posts
 * (post authors) — serializes them with an empty cache, and each of the three
 * FollowState field getters then falls through to its own per-user query.
 *
 * See https://github.com/imorland/follow-users/issues/56
 */
#[RunTestsInSeparateProcesses]
class IncludedUsersQueryCountTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->extension('ianm-follow-users');
    }

    /**
     * Seed $count discussions, each with a distinct author who the actor
     * follows, so that any per-user query shape repeats once per discussion
     * rather than being masked by a shared author.
     */
    protected function seedDiscussions(int $count): void
    {
        $users = [$this->normalUser()];
        $discussions = [];
        $posts = [];
        $followers = [];

        for ($i = 3; $i < 3 + $count; $i++) {
            $users[] = [
                'id'                 => $i,
                'username'           => "user{$i}",
                'email'              => "user{$i}@machine.local",
                'is_email_confirmed' => true,
            ];

            $discussions[] = [
                'id'                  => $i,
                'title'               => "Discussion {$i}",
                'user_id'             => $i,
                'last_posted_user_id' => $i,
                'first_post_id'       => $i,
                'last_post_id'        => $i,
                'comment_count'       => 1,
                'is_private'          => 0,
                'created_at'          => '2024-01-01 00:00:00',
                'last_posted_at'      => '2024-01-01 00:00:00',
            ];

            $posts[] = [
                'id'            => $i,
                'discussion_id' => $i,
                'user_id'       => $i,
                'type'          => 'comment',
                'content'       => "<t><p>Post {$i}</p></t>",
                'number'        => 1,
                'created_at'    => '2024-01-01 00:00:00',
                'is_private'    => 0,
            ];

            $followers[] = [
                'id'               => $i - 2,
                'user_id'          => 2,
                'followed_user_id' => $i,
                'subscription'     => 'follow',
                'created_at'       => '2024-01-01 00:00:00',
                'updated_at'       => '2024-01-01 00:00:00',
            ];
        }

        $this->prepareDatabase([
            User::class       => $users,
            Discussion::class => $discussions,
            Post::class       => $posts,
            'user_followers'  => $followers,
        ]);
    }

    protected function countFollowStateQueries(int $authenticatedAs = 2): int
    {
        $database = $this->database();
        $database->flushQueryLog();
        $database->enableQueryLog();

        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => $authenticatedAs])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $log = $database->getQueryLog();
        $database->flushQueryLog();

        return count(array_filter(
            $log,
            fn ($query) => str_contains($query['query'], 'user_followers')
        ));
    }

    /**
     * The N+1 itself: RepeatedQueryDetector fails this test if any query shape
     * repeats once per record.
     */
    #[Test]
    public function listing_discussions_does_not_run_per_user_follow_queries(): void
    {
        $this->seedDiscussions(10);

        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());
    }

    /**
     * Proves the cost is O(1) rather than merely "under the detector's
     * threshold": doubling the number of serialized users must not change the
     * number of user_followers queries.
     */
    #[Test]
    public function follow_state_query_count_does_not_grow_with_user_count(): void
    {
        $this->seedDiscussions(20);

        $this->assertLessThanOrEqual(3, $this->countFollowStateQueries());
    }

    /**
     * The included users must still serialize with correct follow data — a
     * batch loader that returns nothing would satisfy the query-count
     * assertions above while breaking the feature.
     */
    #[Test]
    public function included_users_still_carry_correct_follow_attributes(): void
    {
        $this->seedDiscussions(3);

        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $users = array_filter(
            $json['included'] ?? [],
            fn ($resource) => $resource['type'] === 'users'
        );

        $this->assertNotEmpty($users, 'Expected users to be included in the discussion listing.');

        $byId = [];
        foreach ($users as $user) {
            $byId[(int) $user['id']] = $user['attributes'];
        }

        // The actor (user 2) follows users 3, 4 and 5.
        foreach ([3, 4, 5] as $id) {
            $this->assertArrayHasKey($id, $byId, "Expected user {$id} to be included.");
            $this->assertEquals('follow', $byId[$id]['followed'] ?? null, "User {$id} should be followed by the actor.");
            $this->assertEquals(1, $byId[$id]['followerCount'] ?? null, "User {$id} should have one follower.");
            $this->assertEquals(0, $byId[$id]['followingCount'] ?? null, "User {$id} should follow nobody.");
        }
    }
}
