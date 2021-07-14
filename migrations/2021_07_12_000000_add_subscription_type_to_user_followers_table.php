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

return Migration::addColumns('user_followers', [
    'subscription' => ['enum', 'allowed' => ['follow', 'lurk'], 'nullable' => true],
]);
