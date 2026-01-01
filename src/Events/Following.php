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
    public function __construct(public User $actor, public User $user, public string $subscription)
    {
    }
}
