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
use Flarum\User\User;
use IanM\FollowUsers\FollowState;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use PHPUnit\Framework\Attributes\Test;

/**
 * Re-sending the subscription a user already has (double-click, stale tab,
 * client retry) must be a no-op. See issue #62.
 */
#[RunTestsInSeparateProcesses]
class ResubmitFollowTest extends TestCase
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
            ],
            'user_followers' => [
                ['id' => 1, 'user_id' => 2, 'followed_user_id' => 3, 'subscription' => 'follow', 'created_at' => '2024-01-01 00:00:00', 'updated_at' => '2024-01-01 00:00:00'],
            ],
        ]);
    }

    protected function setSubscription(?string $subscription): void
    {
        $response = $this->send(
            $this->request('PATCH', '/api/users/3', [
                'authenticatedAs' => 2,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'followUsers' => $subscription,
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());
    }

    protected function followState(): FollowState
    {
        return FollowState::where('user_id', 2)->where('followed_user_id', 3)->firstOrFail();
    }

    #[Test]
    public function resubmitting_unchanged_subscription_keeps_updated_at()
    {
        $this->setSubscription('follow');

        $this->assertEquals('2024-01-01 00:00:00', $this->followState()->updated_at->format('Y-m-d H:i:s'));
    }

    #[Test]
    public function resubmitting_unchanged_subscription_does_not_notify_again()
    {
        $this->setSubscription('follow');

        $this->assertEquals(0, Notification::where('user_id', 3)->where('type', 'newFollower')->count());
    }

    #[Test]
    public function changing_subscription_moves_updated_at()
    {
        $this->setSubscription('lurk');

        $state = $this->followState();

        $this->assertEquals('lurk', $state->subscription);
        $this->assertNotEquals('2024-01-01 00:00:00', $state->updated_at->format('Y-m-d H:i:s'));
    }
}
