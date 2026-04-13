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
     * Request-scoped cache of actor→user follow subscription strings.
     * Keyed as "{actor_id}:{user_id}" → subscription|null.
     *
     * @var array<string, string|null>
     */
    private static array $followStateCache = [];

    /**
     * Request-scoped cache of follower counts (users following a given user).
     * Keyed as user_id → count.
     *
     * @var array<int, int>
     */
    private static array $followerCountCache = [];

    /**
     * Request-scoped cache of following counts (users a given user follows).
     * Keyed as user_id → count.
     *
     * @var array<int, int>
     */
    private static array $followingCountCache = [];

    /**
     * Pre-seed the static count caches from Eloquent loadCount() results so
     * that subsequent per-user getFollowerCount/getFollowingCount calls are
     * served from memory instead of issuing individual COUNT queries.
     */
    public static function seedCountCache(int $userId, int $followerCount, int $followingCount): void
    {
        self::$followerCountCache[$userId] = $followerCount;
        self::$followingCountCache[$userId] = $followingCount;
    }

    /**
     * Batch-load the actor's follow state for every user in $userIds using a
     * single SELECT, then seed the follow-state cache so that FollowState::for()
     * can serve results from memory without issuing per-user queries.
     *
     * All entries are written unconditionally so that stale data from a
     * previous request (e.g. between integration test cases) is overwritten.
     *
     * @param int   $actorId
     * @param int[] $userIds
     */
    public static function seedActorFollowStates(int $actorId, array $userIds): void
    {
        if (empty($userIds)) {
            return;
        }

        // Pre-mark every user as "not followed"; overwrite any stale entry.
        foreach ($userIds as $userId) {
            self::$followStateCache[$actorId.':'.$userId] = null;
        }

        // One query to fetch all real follow states and overwrite the nulls.
        self::where('user_id', $actorId)
            ->whereIn('followed_user_id', $userIds)
            ->each(function (self $state) use ($actorId): void {
                self::$followStateCache[$actorId.':'.(int) $state->followed_user_id] = $state->subscription;
            });
    }

    /**
     * Get the follow subscription state for the given actor→user pair.
     * Returns the cached value if already loaded; otherwise queries the DB
     * and caches the result for the remainder of the request.
     */
    public static function for(User $actor, User $user): ?string
    {
        $key = $actor->id.':'.$user->id;

        if (!array_key_exists($key, self::$followStateCache)) {
            $sub = self::where('user_id', $actor->id)->where('followed_user_id', $user->id)->first();
            self::$followStateCache[$key] = $sub?->subscription;
        }

        return self::$followStateCache[$key];
    }

    /**
     * Get the number of users the given user is following.
     * Returns the cached value if already loaded; otherwise queries the DB.
     */
    public static function getFollowingCount(User $user): int
    {
        if (!isset(self::$followingCountCache[(int) $user->id])) {
            self::$followingCountCache[(int) $user->id] = self::where('user_id', $user->id)->count();
        }

        return self::$followingCountCache[(int) $user->id];
    }

    /**
     * Get the number of users following the given user.
     * Returns the cached value if already loaded; otherwise queries the DB.
     */
    public static function getFollowerCount(User $user): int
    {
        if (!isset(self::$followerCountCache[(int) $user->id])) {
            self::$followerCountCache[(int) $user->id] = self::where('followed_user_id', $user->id)->count();
        }

        return self::$followerCountCache[(int) $user->id];
    }
}
