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

use Flarum\Group\Group;
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
        // The actor must be allowed to follow at all.
        //
        // Read the *processed* permission groups rather than using
        // hasPermission()/isAdmin(). Extensions may downgrade a user's effective
        // groups — flarum/suspend collapses a suspended user's to GUEST — and
        // only permissionGroupIds() reflects that. isAdmin() reads the raw groups
        // relation, and hasPermission() short-circuits true for admins, so both
        // would let a suspended admin through. A suspended user is not a Guest
        // object either, so isGuest() and assertRegistered() miss them too.
        $groupIds = $actor->permissionGroupIds();
        $isAdmin = in_array(Group::ADMINISTRATOR_ID, $groupIds);

        if (!$isAdmin && !in_array('user.follow', $actor->getPermissions())) {
            return $this->deny();
        }

        // admins may follow any user
        if ($isAdmin) {
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
