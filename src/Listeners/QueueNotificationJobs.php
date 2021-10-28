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

use Flarum\Approval\Event\PostWasApproved;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Started;
use Flarum\Post\Event\Saving as PostSaving;
use Flarum\Post\Post;
use IanM\FollowUsers\Events\Following;
use IanM\FollowUsers\Events\Unfollowing;
use IanM\FollowUsers\Jobs;
use Illuminate\Events\Dispatcher;

class QueueNotificationJobs
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Following::class, [$this, 'whenFollowed']);
        $events->listen(Unfollowing::class, [$this, 'whenUnfollowed']);
        $events->listen(Started::class, [$this, 'whenDiscussionStarted']);
        $events->listen(PostSaving::class, [$this, 'whenPostCreated']);
        $events->listen(PostWasApproved::class, [$this, 'whenPostApproved']);
    }

    public function whenFollowed(Following $event)
    {
        resolve('flarum.queue.connection')->push(
            new Jobs\SendNotificationWhenUserIsFollowed($event->actor, $event->user)
        );
    }

    public function whenUnfollowed(Unfollowing $event)
    {
        resolve('flarum.queue.connection')->push(
            new Jobs\SendNotificationWhenUserIsUnfollowed($event->actor, $event->user)
        );
    }

    public function whenDiscussionStarted(Started $event)
    {
        $event->discussion->afterSave(function (Discussion $discussion) {
            resolve('flarum.queue.connection')->push(
                new Jobs\SendNotificationWhenDiscussionIsStarted($discussion)
            );
        });
    }

    public function whenPostCreated(PostSaving $event)
    {
        $event->post->afterSave(function (Post $post) {
            if (!$post->exists || !$post->discussion->exists || $post->number == 1 || !$post->wasRecentlyCreated) {
                return;
            }

            resolve('flarum.queue.connection')->push(
                new Jobs\SendNotificationWhenFollowerPosted($post, $post->discussion->last_post_number)
            );
        });
    }

    public function whenPostApproved(PostWasApproved $event)
    {
        if (!$event->post->discussion->exists) {
            return;
        }

        resolve('flarum.queue.connection')->push(
            $event->post->number == 1
                ? new Jobs\SendNotificationWhenDiscussionIsStarted($event->post->discussion)
                : new Jobs\SendNotificationWhenFollowerPosted($event->post, $event->post->number - 1)
        );
    }
}
