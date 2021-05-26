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

use Flarum\Database\ScopeVisibilityTrait;
use Flarum\Discussion\Discussion;
use Flarum\Notification\NotificationSyncer;
use IanM\FollowUsers\Notifications\NewDiscussionBlueprint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Queue\SerializesModels;

class SendNotificationWhenDiscussionIsStarted implements ShouldQueue
{
    use Queueable;
    use SerializesModels;
    use ScopeVisibilityTrait;

    /**
     * @var Discussion
     */
    protected $discussion;

    public function __construct(Discussion $discussion)
    {
        $this->discussion = $discussion;
    }

    public function handle(NotificationSyncer $notifications)
    {
        $firstPost = $this->discussion->firstPost ?? $this->discussion->posts()->orderBy('number')->first();

        if (!$firstPost || null === $this->discussion->user->followedBy) {
            return;
        }

        /**
         * @var Collection
         */
        $notify = $this->discussion->user->followedBy
            ->reject(function ($user) use ($firstPost) {
                return !$this->discussion->newQuery()->whereVisibleTo($user)->find($this->discussion->id)
                    || !$firstPost->isVisibleTo($user);
            });

        $notifications->sync(
            new NewDiscussionBlueprint($this->discussion, $firstPost),
            $notify->all()
        );
    }
}
