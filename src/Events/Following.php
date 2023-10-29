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
     * @var User
     */
    public $user;

    /**
     * The subscription type ('follow' or 'lurk').
     *
     * @var string
     */
    public $subscription;

    /**
     * @param User $actor The user who is performing the action.
     * @param User $user  The user who is being followed.
     */
    public function __construct(User $actor, User $user, string $subscription)
    {
        $this->actor = $actor;
        $this->user = $user;
        $this->subscription = $subscription;
    }
}
