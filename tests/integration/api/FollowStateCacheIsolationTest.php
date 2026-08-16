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
use IanM\FollowUsers\FollowState;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use PHPUnit\Framework\Attributes\Test;

/**
 * FollowState memoises follow state and counts in static properties. Under
 * php-fpm or the CLI each request is a fresh process, so those caches are
 * effectively request-scoped and never outlive the request that filled them.
 *
 * Under a persistent runtime — Swoole, FrankenPHP worker mode, Octane — the
 * process is reused, and a cache that is never cleared would serve one user's
 * follow state to the next request. That is a correctness bug, not merely a
 * stale-data one: the `followed` attribute is actor-specific.
 *
 * These tests issue two requests in a single process (PHPUnit isolates by test
 * method, not by request) to assert the cache does not bleed between them.
 */
#[RunTestsInSeparateProcesses]
class FollowStateCacheIsolationTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->extension('ianm-follow-users');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'user3', 'email' => 'user3@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'user4', 'email' => 'user4@machine.local', 'is_email_confirmed' => true],
            ],
            'user_followers' => [
                // User 2 follows user 4. User 3 follows nobody.
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 4, 'subscription' => 'follow', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
            ],
        ]);
    }

    protected function followedAttributeFor(int $actorId, int $userId): ?string
    {
        $response = $this->send(
            $this->request('GET', "/api/users/{$userId}", ['authenticatedAs' => $actorId])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        return $json['data']['attributes']['followed'] ?? null;
    }

    /**
     * The follow-state cache is keyed actor:user, so two different actors never
     * collide. The exposure is staleness within one key: once actor 3's "not
     * following" answer is cached, a later request in the same process keeps
     * returning it even after actor 3 has started following.
     */
    #[Test]
    public function follow_state_is_not_stale_across_requests(): void
    {
        $this->assertNull($this->followedAttributeFor(3, 4));

        $response = $this->send(
            $this->request('PATCH', '/api/users/4', [
                'authenticatedAs' => 3,
                'json'            => ['data' => ['attributes' => ['followUsers' => 'follow']]],
            ])
        );
        $this->assertEquals(200, $response->getStatusCode());

        $this->assertEquals(
            'follow',
            $this->followedAttributeFor(3, 4),
            'Follow state was served from a cache filled before the follow was created.'
        );
    }

    /**
     * Counts are not actor-specific, but a cache that outlives the request
     * still serves figures that predate any change made since.
     */
    #[Test]
    public function follower_counts_are_not_stale_across_requests(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/users/4', ['authenticatedAs' => 2])
        );
        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $this->assertEquals(1, $json['data']['attributes']['followerCount']);

        // User 3 follows user 4, so the count must now be 2.
        $response = $this->send(
            $this->request('PATCH', '/api/users/4', [
                'authenticatedAs' => 3,
                'json'            => ['data' => ['attributes' => ['followUsers' => 'follow']]],
            ])
        );
        $this->assertEquals(200, $response->getStatusCode());

        $response = $this->send(
            $this->request('GET', '/api/users/4', ['authenticatedAs' => 2])
        );
        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $this->assertEquals(
            2,
            $json['data']['attributes']['followerCount'],
            'Follower count was served from a cache filled by an earlier request.'
        );
    }

    /**
     * The cache must be explicitly clearable, so a persistent runtime can reset
     * it between requests regardless of how the state was seeded.
     */
    #[Test]
    public function cache_can_be_flushed(): void
    {
        $this->app();

        FollowState::seedCountCache(99, 7, 8);
        FollowState::flushCache();

        $user = User::query()->find(4);

        $this->assertEquals(1, FollowState::getFollowerCount($user));
    }
}
