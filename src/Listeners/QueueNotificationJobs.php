<?php

namespace IanM\FollowUsers\Listeners;

use Flarum\Approval\Event\PostWasApproved;
use Flarum\Discussion\Event\Started;
use Flarum\Post\Event\Posted;
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
        $events->listen(Posted::class, [$this, 'whenPostCreated']);
        //$events->listen(PostWasApproved::class, [$this, 'whenPostApproved']);
    }

    public function whenFollowed(Following $event)
    {
        app('flarum.queue.connection')->push(
            new Jobs\SendNotificationWhenUserIsFollowed($event->actor, $event->user)
        );
    }

    public function whenUnfollowed(Unfollowing $event)
    {
        app('flarum.queue.connection')->push(
            new Jobs\SendNotificationWhenUserIsUnfollowed($event->actor, $event->user)
        );
    }

    public function whenDiscussionStarted(Started $event)
    {
        app('flarum.queue.connection')->push(
            new Jobs\SendNotificationWhenDiscussionIsStarted($event->discussion)
        );
    }

    public function whenPostCreated(Posted $event)
    {
        if (!$event->post->discussion->exists || $event->post->number == 1) {
            return;
        }

        app('flarum.queue.connection')->push(
            new Jobs\SendNotificationWhenFollowerPosted($event->post, $event->post->discussion->last_post_number)
        );
    }

    // public function whenPostApproved(PostWasApproved $event)
    // {
    //     if (!$event->post->discussion->exists) {
    //         return;
    //     }

    //     app('flarum.queue.connection')->push(
    //         $event->post->number == 1
    //             ? new Jobs\SendNotificationWhenDiscussionIsStarted($event->post->discussion)
    //             : new Jobs\SendNotificationWhenReplyIsPosted($event->post, $event->post->number - 1)
    //     );
    // }
}
