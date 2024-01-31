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

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->getConnection()->table('user_followers')
            ->whereNull('subscription')
            ->update(['subscription' => 'follow']);
    },

    'down' => function (Builder $schema) {
        // Nothing.
    },
];
