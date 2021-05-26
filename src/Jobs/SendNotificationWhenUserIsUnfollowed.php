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

namespace IanM\FollowUsers\Jobs;

use Flarum\Notification\Notification;
use Flarum\Notification\NotificationSyncer;
use Flarum\User\User;
use IanM\FollowUsers\Notifications\NewUnfollowerBlueprint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;

class SendNotificationWhenUserIsUnfollowed implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    /**
     * @var User
     */
    protected $actor;

    protected $user;

    public function __construct(User $actor, $user)
    {
        $this->actor = $actor;
        $this->user = $user;
    }

    public function handle(NotificationSyncer $notifications)
    {
        // Remove discussion notifications generated whilst the user was followed
        Notification::where('type', 'newDiscussionByUser')
            ->where('user_id', $this->actor->id)
            ->where('from_user_id', $this->user->id)
            ->delete();

        // Remove new follower notification from followee, so that a new one can be generated in the future
        Notification::where('type', 'newFollower')
            ->where('user_id', $this->user->id)
            ->where('from_user_id', $this->actor->id)
            ->delete();

        $notifications->sync(
            new NewUnfollowerBlueprint($this->actor),
            [$this->user]
        );
    }
}
