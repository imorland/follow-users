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

use Carbon\Carbon;
use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use PHPUnit\Framework\Attributes\Test;

/**
 * flarum/suspend downgrades a suspended user's permission groups to GUEST via
 * its permissionGroups processor. That only bites if we actually check the
 * actor's permissions — note that a suspended user is NOT a Guest object, so
 * isGuest() and assertRegistered() do not catch them.
 */
#[RunTestsInSeparateProcesses]
class SuspendedUserCannotFollowTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-suspend', 'ianm-follow-users');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'target', 'email' => 'target@machine.local', 'is_email_confirmed' => true],
                // Actively suspended: suspended_until is in the future.
                ['id' => 5, 'username' => 'suspended', 'email' => 'suspended@machine.local', 'is_email_confirmed' => true, 'suspended_until' => Carbon::now()->addYear()],
                // Suspension has lapsed: should behave like any normal member.
                ['id' => 6, 'username' => 'lapsed', 'email' => 'lapsed@machine.local', 'is_email_confirmed' => true, 'suspended_until' => Carbon::now()->subYear()],
            ],
        ]);
    }

    private function follow(int $actor, int $target = 3): int
    {
        return $this->send(
            $this->request('PATCH', '/api/users/'.$target, [
                'authenticatedAs' => $actor,
                'json'            => ['data' => ['attributes' => ['followUsers' => 'follow']]],
            ])
        )->getStatusCode();
    }

    #[Test]
    public function suspended_user_cannot_follow_over_the_api()
    {
        $this->assertEquals(403, $this->follow(5));

        $this->assertFalse(
            User::find(5)->followedUsers()->where('followed_user_id', 3)->exists(),
            'Suspended user must not have created a follow record.'
        );
    }

    #[Test]
    public function suspended_user_is_denied_by_the_policy()
    {
        $this->app();

        $this->assertFalse(User::find(5)->can('follow', User::find(3)));
    }

    #[Test]
    public function suspended_user_cannot_follow_even_if_they_are_an_admin()
    {
        // isAdmin() reads the raw groups relation, not the processed permission
        // groups, so the admin short-circuit must not outrank suspension.
        $this->app();
        User::find(5)->groups()->sync([Group::ADMINISTRATOR_ID]);

        $this->assertEquals(403, $this->follow(5));
    }

    #[Test]
    public function user_whose_suspension_has_lapsed_can_still_follow()
    {
        $this->assertEquals(200, $this->follow(6));

        $this->assertTrue(
            User::find(6)->followedUsers()->where('followed_user_id', 3)->exists()
        );
    }

    #[Test]
    public function normal_user_can_still_follow()
    {
        $this->assertEquals(200, $this->follow(2));

        $this->assertTrue(
            User::find(2)->followedUsers()->where('followed_user_id', 3)->exists()
        );
    }
}
