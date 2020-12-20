<?php

namespace IanM\FollowUsers\Events;

use Flarum\User\User;

class Unfollowing
{
    /**
     * The user who is performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The user who is being unfollowed.
     *
     * @var array
     */
    public $user;

    /**
     * @param User $actor The user who is performing the action.
     * @param User $user  The user who is being unfollowed.
     */
    public function __construct(User $actor, User $user)
    {
        $this->actor = $actor;
        $this->user = $user;
    }
}
