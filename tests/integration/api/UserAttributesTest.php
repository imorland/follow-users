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

class UserAttributesTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->extension('ianm-follow-users');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'user3', 'email' => 'user3@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'blocker', 'email' => 'blocker@machine.local', 'is_email_confirmed' => true, 'preferences' => json_encode(['blocksFollow' => true])],
            ],
            'user_followers' => [
                // user 2 follows user 3
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'subscription' => 'follow', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
            ],
        ]);
    }

    /**
     * @test
     */
    public function can_be_followed_is_true_for_regular_user(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/users/3', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertTrue($json['data']['attributes']['canBeFollowed']);
    }

    /**
     * @test
     */
    public function can_be_followed_is_false_for_self(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/users/2', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertFalse($json['data']['attributes']['canBeFollowed']);
    }

    /**
     * @test
     */
    public function can_be_followed_is_false_when_user_blocks_following(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/users/4', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertFalse($json['data']['attributes']['canBeFollowed']);
    }

    /**
     * @test
     */
    public function followed_attribute_reflects_subscription_type(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/users/3', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals('follow', $json['data']['attributes']['followed']);
    }

    /**
     * @test
     */
    public function followed_attribute_is_null_for_non_followed_user(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/users/4', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertNull($json['data']['attributes']['followed']);
    }

    /**
     * @test
     */
    public function follower_and_following_counts_are_present_when_stats_enabled(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/users/3', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $attributes = $json['data']['attributes'];

        $this->assertArrayHasKey('followerCount', $attributes);
        $this->assertArrayHasKey('followingCount', $attributes);
        $this->assertEquals(1, $attributes['followerCount']);
        $this->assertEquals(0, $attributes['followingCount']);
    }

    /**
     * @test
     */
    public function follower_and_following_counts_are_absent_when_stats_disabled(): void
    {
        $this->setting('ianm-follow-users.stats-on-profile', false);

        $response = $this->send(
            $this->request('GET', '/api/users/3', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $attributes = $json['data']['attributes'];

        $this->assertArrayNotHasKey('followerCount', $attributes);
        $this->assertArrayNotHasKey('followingCount', $attributes);
    }
}
