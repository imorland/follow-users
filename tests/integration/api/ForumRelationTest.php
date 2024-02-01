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

class ForumRelationTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('ianm-follow-users');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ],
        ]);
    }

    /**
     * @test
     */
    public function forum_actor_contains_followed_user_relations()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $this->assertArrayHasKey('actor', $json['data']['relationships']);

        $included = $json['included'];

        $actorIndex = array_search('users', array_column($included, 'type'));
        $actor = $included[$actorIndex];

        $this->assertEquals(2, $actor['id']);
        $this->assertArrayHasKey('followedUsers', $actor['relationships']);
        $this->assertArrayHasKey('data', $actor['relationships']['followedUsers']);
    }
}
