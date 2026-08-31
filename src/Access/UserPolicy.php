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
    /**
     * Who may see the list of users someone follows.
     *
     * This is private by default: the profile UI only renders the "Following"
     * list on your own profile. Moderators are granted the permission by
     * migration so they retain visibility for moderation purposes.
     */
    public function viewFollowedUsers(User $actor, User $user): ?string
    {
        // Your own following list is always visible to you.
        if ($actor->id === $user->id) {
            return $this->allow();
        }

        // Admins pass every permission check, so they need no special case here.
        return $actor->hasPermission('user.viewFollowedUsers') ? $this->allow() : $this->deny();
    }

    public function follow(User $actor, User $user): ?string
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
