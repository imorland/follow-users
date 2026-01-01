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
        $connection = $schema->getConnection();

        if ($connection->getDriverName() === 'sqlite') {
            // SQLite doesn't support dropping primary keys directly
            // This will be handled in the next migration (add_primary_key)
            // which recreates the table
            return;
        }

        $schema->table('user_followers', function (Blueprint $table) {
            $table->index(['user_id', 'followed_user_id']);
            $table->dropPrimary(['user_id', 'followed_user_id']);
        });
    },

    'down' => function (Builder $schema) {
        $connection = $schema->getConnection();

        if ($connection->getDriverName() === 'sqlite') {
            return;
        }

        $schema->table('user_followers', function (Blueprint $table) {
            $table->primary(['user_id', 'followed_user_id']);
        });
    },
];
