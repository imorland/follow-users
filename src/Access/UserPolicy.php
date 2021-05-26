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

namespace IanM\FollowUsers\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class UserPolicy extends AbstractPolicy
{
    public function follow(User $actor, User $user)
    {
        // admins may follow any user
        if ($actor->isAdmin()) {
            return $this->allow();
        }

        // prevent following self, a user who blocks following, or a user who does not have permission
        if ($user->id === $actor->id || $user->preferences['blocksFollow'] || !$user->hasPermission('user.beFollowed')) {
            return $this->deny();
        }

        // otherwise allow following
        return $this->allow();
    }
}
