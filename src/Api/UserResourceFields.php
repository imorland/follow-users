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

namespace IanM\FollowUsers\Api;

use Carbon\Carbon;
use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use IanM\FollowUsers\Events\Following;
use IanM\FollowUsers\Events\Unfollowing;
use IanM\FollowUsers\FollowState;
use Illuminate\Contracts\Events\Dispatcher;

class UserResourceFields
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected Dispatcher $events
    ) {
    }

    public function __invoke(): array
    {
        return [
            // Basic user attributes (available on BasicUserSerializer)
            Schema\Str::make('followed')
                ->get(fn (User $user, Context $context) => FollowState::for($context->getActor(), $user)),

            Schema\Integer::make('followerCount')
                ->visible(fn (User $user, Context $context) => (bool) $this->settings->get('ianm-follow-users.stats-on-profile'))
                ->get(fn (User $user, Context $context) => FollowState::getFollowerCount($user)),

            Schema\Integer::make('followingCount')
                ->visible(fn (User $user, Context $context) => (bool) $this->settings->get('ianm-follow-users.stats-on-profile'))
                ->get(fn (User $user, Context $context) => FollowState::getFollowingCount($user)),

            // User-level attributes (available on UserSerializer)
            Schema\Boolean::make('canBeFollowed')
                ->get(fn (User $user, Context $context) => $context->getActor()->can('follow', $user)),

            // Writable follow state attribute
            Schema\Str::make('followUsers')
                ->writable(fn (User $user, Context $context) => $context->updating() && !$context->getActor()->isGuest())
                ->nullable()
                ->set(function (User $user, ?string $subscription, Context $context) {
                    $actor = $context->getActor();
                    $actor->assertRegistered();

                    $exists = $actor->followedUsers()->where('followed_user_id', $user->id)->exists();
                    $changed = false;

                    if (!empty($subscription)) {
                        // Adding or updating follow
                        $actor->assertCan('follow', $user);

                        $state = FollowState::updateOrCreate([
                            'user_id'          => $actor->id,
                            'followed_user_id' => $user->id,
                        ], [
                            'subscription' => $subscription,
                            'updated_at'   => Carbon::now(),
                        ]);

                        $this->events->dispatch(new Following($actor, $user, $subscription));
                        $changed = $state->wasChanged();
                    } elseif ($exists) {
                        // Removing follow
                        $this->events->dispatch(new Unfollowing($actor, $user));
                        $actor->followedUsers()->detach($user);
                        $changed = true;
                    }

                    if ($changed) {
                        $actor->load('followedUsers');
                        $user->load('followedBy');
                    }
                }),

            // Relationships
            Schema\Relationship\ToMany::make('followedUsers')
                ->includable()
                ->type('users'),

            Schema\Relationship\ToMany::make('followedBy')
                ->includable()
                ->type('users'),
        ];
    }
}
