<?php

namespace IanM\FollowUsers\Tests\integration\api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;

class FollowUserTest extends TestCase
{
    use RetrievesAuthorizedUsers;
    
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('ianm-follow-users');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'normal2', 'email' => 'normal2@machine.local', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'normal3', 'email' => 'normal3@machine.local', 'is_email_confirmed' => true, 'preferences' => json_encode(['blocksFollow' => true])],
            ],
        ]);
    }

    /**
     * @test
     */
    public function user_can_follow_normal_user_by_default()
    {
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/users/3',
                [
                    'authenticatedAs' => 2,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'followUsers' => 'follow'
                            ]
                        ]
                    ]
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $attributes = $json['data']['attributes'];

        $this->assertEquals(1, $attributes['followerCount']);
        $this->assertEquals('follow', $attributes['followed']);

        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/2',
                [
                    'authenticatedAs' => 2
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $relations = $json['data']['relationships'];

        $this->assertArrayHasKey('followedUsers', $relations);

        $included = $json['included'];

        $followedUserIndex = array_search('users', array_column($included, 'type'));
        $followedUser = $included[$followedUserIndex];

        $this->assertEquals(3, $followedUser['id']);
    }

    /**
     * @test
     */
    public function user_cannot_follow_user_who_blocks_following()
    {
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/users/4',
                [
                    'authenticatedAs' => 2,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'followUsers' => 'follow'
                            ]
                        ]
                    ]
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function admin_can_follow_user_who_blocks_following()
    {
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/users/4',
                [
                    'authenticatedAs' => 1,
                    'json' => [
                        'data' => [
                            'attributes' => [
                                'followUsers' => 'follow'
                            ]
                        ]
                    ]
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $attributes = $json['data']['attributes'];

        $this->assertEquals(1, $attributes['followerCount']);
        $this->assertEquals('follow', $attributes['followed']);

        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/1',
                [
                    'authenticatedAs' => 1
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $relations = $json['data']['relationships'];

        $this->assertArrayHasKey('followedUsers', $relations);

        $included = $json['included'];

        $followedUserIndex = array_search('users', array_column($included, 'type'));
        $followedUser = $included[$followedUserIndex];

        $this->assertEquals(4, $followedUser['id']);
    }
}
