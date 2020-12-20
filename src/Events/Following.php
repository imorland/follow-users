<?php

namespace IanM\FollowUsers\Events;

use Flarum\User\User;

class Following
{
    /**
     * The user who is performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The user who is being followed.
     *
     * @var array
     */
    public $user;

    /**
     * @param User $actor The user who is performing the action.
     * @param User $user  The user who is being followed.
     */
    public function __construct(User $actor, User $user)
    {
        $this->actor = $actor;
        $this->user = $user;
    }
}
