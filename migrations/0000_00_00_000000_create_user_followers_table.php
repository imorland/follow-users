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
        if ($schema->hasTable('user_followers')) {
            return;
        }

        $schema->create(
            'user_followers',
            function (Blueprint $table) {
                $table->integer('user_id')->unsigned();
                $table->integer('followed_user_id')->unsigned();
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
            }
        );
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('user_followers');
    },
];
