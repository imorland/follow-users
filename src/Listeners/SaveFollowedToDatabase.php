<?php

/*
 * This file is part of ianm/follow-users
 *
 *  Copyright (c) 2020 Ian Morland.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 *
 */

namespace IanM\FollowUsers\Listeners;

use Flarum\User\Event\Saving;
use IanM\FollowUsers\Events\Following;
use IanM\FollowUsers\Events\Unfollowing;
use Illuminate\Contracts\Events\Dispatcher;
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

        if (array_key_exists('followed', $attributes)) {
            $user = $event->user;
            $actor = $event->actor;

            $actor->assertRegistered();

            $followed = (bool) $attributes['followed'];

            $changed = false;
            $exists = $actor->followedUsers()->where('followed_user_id', $user->id)->exists;

            if ($followed) {
                if (!$exists) {
                    $actor->assertCan('follow', $user);
                    $this->events->dispatch(new Following($actor, $user));
                    $actor->followedUsers()->attach($user, []);
                    $changed = true;
                }
            } elseif ($exists) {
                $this->events->dispatch(new Unfollowing($actor, $user));
                $actor->followedUsers()->detach($user);
                $changed = true;
            }

            if ($changed) {
                $actor->load('followedUsers');
                $user->load('followedBy');
            }
        }
    }
}
