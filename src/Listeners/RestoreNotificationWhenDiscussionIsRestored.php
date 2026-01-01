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

use Flarum\Discussion\Event\Restored;
use Flarum\Notification\NotificationSyncer;
use IanM\FollowUsers\Notifications\NewDiscussionBlueprint;

class RestoreNotificationWhenDiscussionIsRestored
{
    public function __construct(protected NotificationSyncer $notifications)
    {
    }

    public function handle(Restored $event): void
    {
        $this->notifications->restore(new NewDiscussionBlueprint($event->discussion));
    }
}
