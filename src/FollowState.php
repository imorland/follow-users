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

namespace IanM\FollowUsers;

use Flarum\Database\AbstractModel;
use Flarum\User\User;

class FollowState extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'user_followers';

    /**
     * {@inheritDoc}
     */
    protected $fillable = ['user_id', 'followed_user_id', 'subscription'];

    /**
     * Get the follow user subscription state for the given User.
     *
     * @param User $actor
     * @param User $user
     *
     * @return null|string
     */
    public static function for(User $actor, User $user): ?string
    {
        $sub = self::where('user_id', $actor->id)->where('followed_user_id', $user->id)->first();

        return $sub ? $sub->subscription : null;
    }
}
