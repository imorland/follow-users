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
            // SQLite: Recreate table with new structure
            $prefix = $connection->getTablePrefix();

            // Create temporary table with new structure
            $schema->create('user_followers_temp', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('user_id')->unsigned();
                $table->integer('followed_user_id')->unsigned();
                $table->string('subscription')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent();

                $table->foreign('user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');

                $table->foreign('followed_user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');

                $table->index(['user_id', 'followed_user_id']);
            });

            // Copy data from old table
            $connection->statement("INSERT INTO {$prefix}user_followers_temp (user_id, followed_user_id, subscription, created_at, updated_at)
                                    SELECT user_id, followed_user_id, subscription, created_at, updated_at
                                    FROM {$prefix}user_followers");

            // Drop old table and rename temp
            $schema->drop('user_followers');
            $schema->rename('user_followers_temp', 'user_followers');
        } else {
            // MySQL/PostgreSQL: Can add column directly
            $schema->table('user_followers', function (Blueprint $table) {
                $table->increments('id')->first();
            });
        }
    },

    'down' => function (Builder $schema) {
        $connection = $schema->getConnection();

        if ($connection->getDriverName() === 'sqlite') {
            // SQLite: Recreate table with old structure
            $prefix = $connection->getTablePrefix();

            $schema->create('user_followers_temp', function (Blueprint $table) {
                $table->integer('user_id')->unsigned();
                $table->integer('followed_user_id')->unsigned();
                $table->string('subscription')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent();

                $table->foreign('user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');

                $table->foreign('followed_user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');

                $table->primary(['user_id', 'followed_user_id']);
            });

            $connection->statement("INSERT INTO {$prefix}user_followers_temp (user_id, followed_user_id, subscription, created_at, updated_at)
                                    SELECT user_id, followed_user_id, subscription, created_at, updated_at
                                    FROM {$prefix}user_followers");

            $schema->drop('user_followers');
            $schema->rename('user_followers_temp', 'user_followers');
        } else {
            $schema->table('user_followers', function (Blueprint $table) {
                $table->dropPrimary();
                $table->dropColumn('id');
                $table->primary(['user_id', 'followed_user_id']);
            });
        }
    },
];
