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

use Flarum\Notification\Notification;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;

class FollowingUserTest extends TestCase
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
                ['id' => 4, 'username' => 'blocker', 'email' => 'blocker@machine.local', 'is_email_confirmed' => true, 'preferences' => json_encode(['blocksFollow' => true])],
            ],
            'user_followers' => [
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'created_at' => '2020-01-01 00:00:00', 'updated_at' => '2020-01-01 00:00:00', 'subscription' => 'follow'],
                ['id' => 2, 'user_id' => 2, 'followed_user_id' => 4, 'created_at' => '2020-01-01 00:00:00', 'updated_at' => '2020-01-01 00:00:00', 'subscription' => 'lurk'],

            ],
        ]);
    }

    /**
     * @test
     */
    public function following_users_are_included_in_relations_with_correct_following_count_current_user()
    {
        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/2',
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $attributes = $json['data']['attributes'];

        $this->assertEquals(2, $attributes['followingCount']);
        $this->assertEquals(0, $attributes['followerCount']);

        $relationships = $json['data']['relationships'];
        $included = $json['included'];

        $this->assertEquals(3, $relationships['followedUsers']['data'][0]['id']);
        $this->assertEquals(3, $included[0]['id']);
        $this->assertEquals('follow', $included[0]['attributes']['followed']);
        $this->assertEquals(1, $included[0]['attributes']['followerCount']);
        $this->assertEquals(0, $included[0]['attributes']['followingCount']);

        $this->assertEquals(4, $relationships['followedUsers']['data'][1]['id']);
        $this->assertEquals(4, $included[1]['id']);
        $this->assertEquals('lurk', $included[1]['attributes']['followed']);
        $this->assertEquals(1, $included[1]['attributes']['followerCount']);
        $this->assertEquals(0, $included[1]['attributes']['followingCount']);
    }

    /**
     * @test
     */
    public function correct_following_count_other_user()
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
        $attributes = $json['data']['attributes'];

        $this->assertEquals(0, $attributes['followingCount']);
        $this->assertEquals(1, $attributes['followerCount']);
    }

    public function unfollowUsersDataProvider(): array
    {
        return [
            [2, 3],
            [2, 4],
        ];
    }

    /**
     * @dataProvider unfollowUsersDataProvider
     *
     * @test
     */
    public function can_unfollow_users(int $actorId, int $unfollowId)
    {
        $response = $this->send(
            $this->request(
                'PATCH',
                '/api/users/'.$unfollowId,
                [
                    'authenticatedAs' => $actorId,
                    'json'            => [
                        'data' => [
                            'attributes' => [
                                'followUsers' => null,
                            ],
                        ],
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $attributes = $json['data']['attributes'];

        $this->assertEquals(0, $attributes['followerCount']);
        $this->assertNull($attributes['followed']);

        $response = $this->send(
            $this->request(
                'GET',
                '/api/users/'.$actorId,
                [
                    'authenticatedAs' => $actorId,
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);

        $relationships = $json['data']['relationships'];

        $this->assertArrayHasKey('followedUsers', $relationships);

        $this->assertFalse(array_search($unfollowId, array_column($relationships['followedUsers']['data'], 'id')));

        // Ensure the unfollow notification was sent
        $notification = Notification::where('user_id', $unfollowId)->where('type', 'newUnfollower')->first();

        $this->assertNotNull($notification);
        $this->assertEquals($unfollowId, $notification->user_id);
        $this->assertEquals($actorId, $notification->from_user_id);
    }
}
