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
use PHPUnit\Framework\Attributes\Test;

class FollowedByTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('ianm-follow-users');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'normal2', 'email' => 'normal2@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'normal3', 'email' => 'normal3@machine.local', 'is_email_confirmed' => true],
            ],
            'user_followers' => [
                // user 2 follows user 3
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'created_at' => '2020-01-01 00:00:00', 'updated_at' => '2020-01-01 00:00:00', 'subscription' => 'follow'],
                // user 4 also follows user 3
                ['id' => 2, 'user_id' => 4, 'followed_user_id' => 3, 'created_at' => '2020-01-01 00:00:00', 'updated_at' => '2020-01-01 00:00:00', 'subscription' => 'follow'],
            ],
        ]);
    }

    #[Test]
    public function followed_by_relation_is_included_when_viewing_a_user_profile()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/3',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('followedBy', $json['data']['relationships']);

        $followedByIds = array_column($json['data']['relationships']['followedBy']['data'], 'id');

        $this->assertContains('2', $followedByIds);
        $this->assertContains('4', $followedByIds);
    }

    #[Test]
    public function followed_by_relation_is_included_when_viewing_own_profile()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/3',
                [
                    'authenticatedAs' => 3,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('followedBy', $json['data']['relationships']);

        $followedByIds = array_column($json['data']['relationships']['followedBy']['data'], 'id');

        $this->assertContains('2', $followedByIds);
        $this->assertContains('4', $followedByIds);
    }

    #[Test]
    public function followed_by_is_not_included_in_forum_boot_response()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api',
                [
                    'authenticatedAs' => 3,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $included = $json['included'] ?? [];
        $actorIndex = array_search('users', array_column($included, 'type'));
        $actor = $included[$actorIndex];

        $this->assertEquals(3, $actor['id']);
        $this->assertArrayNotHasKey('followedBy', $actor['relationships'] ?? []);
    }
}
