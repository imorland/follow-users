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

class FollowUsersDiscussionFilterTest extends TestCase
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
            ],
            'discussions' => [
                // Started by followed user (user 3)
                ['id' => 1, 'title' => 'Discussion by followed user', 'user_id' => 3, 'participant_count' => 1, 'created_at' => '2024-01-01 00:00:00'],
                // Started by the actor themselves (user 2)
                ['id' => 2, 'title' => 'Discussion by actor', 'user_id' => 2, 'participant_count' => 1, 'created_at' => '2024-01-01 00:00:00'],
                // Started by admin (user 1), not followed
                ['id' => 3, 'title' => 'Discussion by admin', 'user_id' => 1, 'participant_count' => 1, 'created_at' => '2024-01-01 00:00:00'],
            ],
            'posts' => [
                ['id' => 1, 'discussion_id' => 1, 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>Post 1</p></t>', 'is_private' => 0, 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 2, 'discussion_id' => 2, 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>Post 2</p></t>', 'is_private' => 0, 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
                ['id' => 3, 'discussion_id' => 3, 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>Post 3</p></t>', 'is_private' => 0, 'number' => 1, 'created_at' => '2024-01-01 00:00:00'],
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
    public function filter_returns_only_discussions_by_followed_users(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => 2])
                ->withQueryParams(['filter' => ['following-users' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $ids = array_column($json['data'], 'id');

        $this->assertContains('1', $ids);
        $this->assertNotContains('2', $ids);
        $this->assertNotContains('3', $ids);
    }

    /**
     * @test
     */
    public function filter_returns_empty_when_actor_follows_nobody(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => 3])
                ->withQueryParams(['filter' => ['following-users' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertEmpty($json['data']);
    }

    /**
     * Guest actors have no follow relationships so the filter is a no-op —
     * all visible discussions are returned unchanged.
     *
     * @test
     */
    public function filter_is_a_noop_for_guests(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions')
                ->withQueryParams(['filter' => ['following-users' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertCount(3, $json['data']);
    }
}
