<?php

namespace IanM\FollowUsers\Jobs;

use Flarum\Notification\NotificationSyncer;
use Flarum\Post\Post;
use Flarum\User\User;
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
        if (!$this->post->exists()) {
            return;
        }

        /**
         * @var Collection
         */
        $discussion = $this->post->discussion;

        $ian = $this->post->user->followedBy();

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
