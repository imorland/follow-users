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
use IanM\FollowUsers\FollowState;
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

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function handle(NotificationSyncer $notifications)
    {
        if (!$this->post->exists || null === $this->post->user->followedBy) {
            return;
        }

        $discussion = $this->post->discussion;

        $actor = $this->post->user;
        /**
         * @var Collection
         */
        $notify = $this->post->user->followedBy
            ->reject(function ($user) use ($discussion, $actor) {
                return !$discussion->newQuery()->whereVisibleTo($user)->find($discussion->id)
                    || !$this->post->isVisibleTo($user) || FollowState::for($user, $actor) !== 'lurk';
            });

        $notifications->sync(
            new NewPostByUserBlueprint($this->post),
            $notify->all()
        );
    }
}
