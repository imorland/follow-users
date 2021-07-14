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

use IanM\FollowUsers\FollowState;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        FollowState::whereNull('subscription')
            ->update(['subscription' => 'follow']);
    },

    'down' => function (Builder $schema) {
        // Nothing.
    },
];
