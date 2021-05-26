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

use Flarum\Discussion\Event\Deleted;
use Flarum\Discussion\Event\Hidden;
use Flarum\Notification\NotificationSyncer;
use IanM\FollowUsers\Notifications\NewDiscussionBlueprint;

class DeleteNotificationWhenDiscussionIsHiddenOrDeleted
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

    /**
     * @param Hidden|Deleted $event
     */
    public function handle($event)
    {
        $this->notifications->delete(new NewDiscussionBlueprint($event->discussion));
    }
}
