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

use Flarum\Notification\NotificationSyncer;
use Flarum\Post\Post;
use IanM\FollowUsers\Notifications\NewPostByUserBlueprint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class SendNotificationWhenFollowerPosted implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    /**
     * @var Post
     */
    protected $post;

    protected $lastPostNumber;

    public function __construct(Post $post, int $lastPostNumber)
    {
        $this->post = $post;
        $this->lastPostNumber = $lastPostNumber;
    }

    public function handle(NotificationSyncer $notifications)
    {
        if (!$this->post || !$this->post->exists || null === $this->post->user->followedBy) {
            return;
        }

        /**
         * @var Collection
         */
        $discussion = $this->post->discussion;

        /**
         * @var Collection
         */
        $notify = $this->post->user->followedBy
            ->reject(function ($user) use ($discussion) {
                return !$discussion->newQuery()->whereVisibleTo($user)->find($discussion->id)
                    || !$this->post->isVisibleTo($user);
            });

        $notifications->sync(
            new NewPostByUserBlueprint($this->post),
            $notify->all()
        );
    }
}
