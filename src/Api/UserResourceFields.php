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
            //
            // These getters return a closure rather than a value. The serializer
            // treats a returned Closure as deferred work: it is queued and only
            // invoked once every model in the document has been walked (see
            // Serializer::whenResolved / resolveDeferred). That gives us a point
            // where the full set of users being serialized is known, so the
            // first closure to resolve can load follow data for all of them in
            // one query instead of one query per user.
            //
            // This is what makes the batching work on endpoints other than
            // /api/users — /api/discussions, /api/posts, /api/notifications and
            // any third-party resource that includes users — none of which can
            // be reached by the beforeSerialization hook in extend.php, since
            // that is bound to a single (resource, endpoint) pair.
            Schema\Str::make('followed')
                ->get(function (User $user, Context $context) {
                    FollowState::willSerialize($context->getActor(), $user);

                    return fn () => FollowState::for($context->getActor(), $user);
                }),

            Schema\Integer::make('followerCount')
                ->visible(fn (User $user, Context $context) => (bool) $this->settings->get('ianm-follow-users.stats-on-profile'))
                ->get(function (User $user, Context $context) {
                    FollowState::willSerialize($context->getActor(), $user);

                    return fn () => FollowState::getFollowerCount($user);
                }),

            Schema\Integer::make('followingCount')
                ->visible(fn (User $user, Context $context) => (bool) $this->settings->get('ianm-follow-users.stats-on-profile'))
                ->get(function (User $user, Context $context) {
                    FollowState::willSerialize($context->getActor(), $user);

                    return fn () => FollowState::getFollowingCount($user);
                }),

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
            //
            // The "who I follow" list is private: the profile UI only ever
            // renders it on your own profile (addProfilePage gates the nav item
            // behind isActor). Scoping it here rather than on the default
            // includes means the API enforces it regardless of what a client
            // explicitly requests. See issue #58.
            //
            // Visibility goes through the policy so it stays permission-based
            // and extensible — moderators are granted user.viewFollowedUsers by
            // migration rather than being hardcoded here.
            Schema\Relationship\ToMany::make('followedUsers')
                ->includable()
                ->visible(fn (User $user, Context $context) => $context->getActor()->can('viewFollowedUsers', $user))
                ->type('users'),

            Schema\Relationship\ToMany::make('followedBy')
                ->includable()
                ->type('users'),
        ];
    }
}
