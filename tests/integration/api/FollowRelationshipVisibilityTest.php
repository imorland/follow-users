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
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use PHPUnit\Framework\Attributes\Test;

/**
 * The "who I follow" list (followedUsers) is owner-only: the profile UI only
 * ever renders it on your own profile. The "followers" list (followedBy) is
 * intentionally public — it shows on any profile.
 *
 * @see https://github.com/imorland/follow-users/issues/58
 */
#[RunTestsInSeparateProcesses]
class FollowRelationshipVisibilityTest extends TestCase
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
                // user 3 follows user 4
                ['id' => 1, 'user_id' => 3, 'followed_user_id' => 4, 'created_at' => '2020-01-01 00:00:00', 'updated_at' => '2020-01-01 00:00:00', 'subscription' => 'follow'],
                // user 2 follows user 3
                ['id' => 2, 'user_id' => 2, 'followed_user_id' => 3, 'created_at' => '2020-01-01 00:00:00', 'updated_at' => '2020-01-01 00:00:00', 'subscription' => 'follow'],
            ],
        ]);
    }

    private function showUser(int $id, ?int $actor, ?string $include = null): array
    {
        $options = [];

        if ($actor !== null) {
            $options['authenticatedAs'] = $actor;
        }

        $response = $this->send(
            $this->request('GET', '/api/users/'.$id.($include ? '?include='.$include : ''), $options)
        );

        $this->assertEquals(200, $response->getStatusCode());

        return json_decode($response->getBody()->getContents(), true);
    }

    // --- followedUsers: owner-only -----------------------------------------

    #[Test]
    public function followed_users_is_not_exposed_to_guests()
    {
        $json = $this->showUser(3, null);

        $this->assertArrayNotHasKey('followedUsers', $json['data']['relationships'] ?? []);
    }

    #[Test]
    public function followed_users_is_not_exposed_to_guests_when_explicitly_included()
    {
        $json = $this->showUser(3, null, 'followedUsers');

        $this->assertArrayNotHasKey('followedUsers', $json['data']['relationships'] ?? []);

        // The followed user must not leak into the compound document either.
        $this->assertNotContains('4', array_column($json['included'] ?? [], 'id'));
    }

    #[Test]
    public function followed_users_is_not_exposed_to_another_user()
    {
        $json = $this->showUser(3, 2, 'followedUsers');

        $this->assertArrayNotHasKey('followedUsers', $json['data']['relationships'] ?? []);
        $this->assertNotContains('4', array_column($json['included'] ?? [], 'id'));
    }

    #[Test]
    public function followed_users_is_visible_to_the_profile_owner()
    {
        $json = $this->showUser(3, 3, 'followedUsers');

        $this->assertArrayHasKey('followedUsers', $json['data']['relationships']);

        $ids = array_column($json['data']['relationships']['followedUsers']['data'], 'id');
        $this->assertContains('4', $ids);
    }

    #[Test]
    public function followed_users_is_visible_to_admins()
    {
        $json = $this->showUser(3, 1, 'followedUsers');

        $this->assertArrayHasKey('followedUsers', $json['data']['relationships']);

        $ids = array_column($json['data']['relationships']['followedUsers']['data'], 'id');
        $this->assertContains('4', $ids);
    }

    // --- followedBy: intentionally public ----------------------------------

    #[Test]
    public function followed_by_remains_visible_to_guests()
    {
        $json = $this->showUser(3, null, 'followedBy');

        $this->assertArrayHasKey('followedBy', $json['data']['relationships']);

        $ids = array_column($json['data']['relationships']['followedBy']['data'], 'id');
        $this->assertContains('2', $ids);
    }

    // --- regression: the actor's own state must still boot ------------------

    #[Test]
    public function actor_followed_users_is_still_included_in_forum_boot_response()
    {
        $response = $this->send(
            $this->request('GET', '/api', ['authenticatedAs' => 3])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $json = json_decode($response->getBody()->getContents(), true);
        $included = $json['included'] ?? [];

        $actorIndex = array_search('users', array_column($included, 'type'));
        $actor = $included[$actorIndex];

        $this->assertEquals(3, $actor['id']);
        $this->assertArrayHasKey('followedUsers', $actor['relationships']);

        $ids = array_column($actor['relationships']['followedUsers']['data'], 'id');
        $this->assertContains('4', $ids);
    }
}
