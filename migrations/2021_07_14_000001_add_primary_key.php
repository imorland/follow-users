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

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('user_followers', function (Blueprint $table) {
            $table->increments('id');
        });
    },

    'down' => function (Builder $schema) {
        $schema->table('user_followers', function (Blueprint $table) {
            $table->dropPrimary();
            $table->unsignedInteger('id')->change(); // for removing auto increment
        });
    },
];
