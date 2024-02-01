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

namespace IanM\FollowUsers\Listeners;

use Carbon\Carbon;
use Flarum\User\Event\Saving;
use Flarum\User\User;
use IanM\FollowUsers\Events\Following;
use IanM\FollowUsers\Events\Unfollowing;
use IanM\FollowUsers\FollowState;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Arr;

class SaveFollowedToDatabase
{
    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @param Dispatcher $events
     */
    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }

    public function handle(Saving $event)
    {
        $attributes = Arr::get($event->data, 'attributes', []);

        if (array_key_exists('followUsers', $attributes)) {
            $user = $event->user;
            $actor = $event->actor;

            $actor->assertRegistered();

            $subscription = $attributes['followUsers'];

            $changed = false;
            $exists = $this->followedUsers($actor)->where('followed_user_id', $user->id)->exists();

            if (!empty($subscription)) {
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
                $this->events->dispatch(new Unfollowing($actor, $user));
                $this->followedUsers($actor)->detach($user);
                $changed = true;
            }

            if ($changed) {
                $actor->load('followedUsers');
                $user->load('followedBy');
            }
        }
    }

    /**
     * @param User $user
     *
     * @return BelongsToMany<User>
     */
    protected function followedUsers(User $user): BelongsToMany
    {
        return $user->followedUsers();
    }
}
