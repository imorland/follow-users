<?php

use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'user.beFollowed'   => Group::MEMBER_ID,
]);
