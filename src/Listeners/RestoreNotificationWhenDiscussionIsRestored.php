<?php

namespace IanM\FollowUsers\Listeners;

use Flarum\Discussion\Event\Restored;
use Flarum\Notification\NotificationSyncer;
use IanM\FollowUsers\Notifications\NewDiscussionBlueprint;

class RestoreNotificationWhenDiscussionIsRestored
{
    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @param NotificationSyncer $notifications
     */
    public function __construct(NotificationSyncer $notifications)
    {
        $this->notifications = $notifications;
    }

    public function handle(Restored $event)
    {
        $this->notifications->restore(new NewDiscussionBlueprint($event->discussion));
    }
}
