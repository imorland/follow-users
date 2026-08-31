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

// Gates the ability to follow other users. Granted to members, matching the
// previous behaviour where any registered user could follow. Routing this
// through a permission means extensions that downgrade a user's permission
// groups — flarum/suspend collapses them to GUEST — deny following for free.
return Migration::addPermissions([
    'user.follow' => Group::MEMBER_ID,
]);
