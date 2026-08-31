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

use Flarum\Database\Migration;
use Flarum\Group\Group;

// The "who I follow" list is private to the user it belongs to. Moderators
// keep visibility for moderation purposes; admins pass permission checks
// unconditionally and so need no explicit grant. See issue #58.
return Migration::addPermissions([
    'user.viewFollowedUsers' => Group::MODERATOR_ID,
]);
