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

class FollowedUsersFilterGambitTest extends TestCase
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
                ['id' => 4, 'username' => 'user4', 'email' => 'user4@machine.local', 'is_email_confirmed' => true],
            ],
            'user_followers' => [
                // user 2 follows user 3 only
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'subscription' => 'follow', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
            ],
        ]);
    }

    /**
     * @test
     */
    public function filter_returns_only_followed_users(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/users', ['authenticatedAs' => 2])
                ->withQueryParams(['filter' => ['followeduser' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $ids = array_column($json['data'], 'id');

        $this->assertContains('3', $ids);
        $this->assertNotContains('1', $ids);
        $this->assertNotContains('2', $ids);
        $this->assertNotContains('4', $ids);
    }

    /**
     * @test
     */
    public function filter_returns_empty_when_actor_follows_nobody(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/users', ['authenticatedAs' => 3])
                ->withQueryParams(['filter' => ['followeduser' => '1']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertEmpty($json['data']);
    }
}
