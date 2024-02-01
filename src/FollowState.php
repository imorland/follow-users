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

/**
 * @property int            $id
 * @property int            $user_id
 * @property int            $followed_user_id
 * @property string         $subscription
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class FollowState extends AbstractModel
{
    protected $table = 'user_followers';

    protected $fillable = ['user_id', 'followed_user_id', 'subscription', 'updated_at'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

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

    /**
     * Get the number of users the given user is following.
     *
     * @param User $user
     *
     * @return int
     */
    public static function getFollowingCount(User $user): int
    {
        return self::where('user_id', $user->id)->count();
    }

    /**
     * Get the number of users following the given user.
     *
     * @param User $user
     *
     * @return int
     */
    public static function getFollowerCount(User $user): int
    {
        return self::where('followed_user_id', $user->id)->count();
    }
}
