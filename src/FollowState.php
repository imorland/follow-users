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

    private static array $followStateCache = [];

    private static array $followerCountCache = [];

    private static array $followingCountCache = [];

    /**
     * Pre-seed the static count caches from loadCount() results.
     * Call this after Eloquent's loadCount() so that any subsequent
     * serialization of the same user ID (via a different model instance)
     * hits the cache without issuing a DB query.
     */
    public static function seedCountCache(int $userId, int $followerCount, int $followingCount): void
    {
        self::$followerCountCache[$userId] = $followerCount;
        self::$followingCountCache[$userId] = $followingCount;
    }

    /**
     * Invalidate cached state for a follow/unfollow between users.
     */
    public static function invalidateCache(int $actorId, int $userId): void
    {
        unset(
            self::$followStateCache[$actorId.':'.$userId],
            self::$followerCountCache[$userId],
            self::$followingCountCache[$actorId]
        );
    }

    /**
     * Flush all request-scoped static caches.
     */
    public static function resetCaches(): void
    {
        self::$followStateCache = [];
        self::$followerCountCache = [];
        self::$followingCountCache = [];
    }

    /**
     * Get the follow user subscription state for the given User.
     * Results are cached for the duration of the request.
     *
     * @param User $actor
     * @param User $user
     *
     * @return null|string
     */
    public static function for(User $actor, User $user): ?string
    {
        $key = $actor->id.':'.$user->id;

        if (!array_key_exists($key, self::$followStateCache)) {
            $sub = self::where('user_id', $actor->id)->where('followed_user_id', $user->id)->first();
            self::$followStateCache[$key] = $sub ? $sub->subscription : null;
        }

        return self::$followStateCache[$key];
    }

    /**
     * Get the follow user subscription state using the already-loaded
     * followedUsers relation on the actor. Falls back to for() if the
     * relation has not been eager-loaded yet.
     *
     * @param User $actor
     * @param User $user
     *
     * @return null|string
     */
    public static function forFromRelation(User $actor, User $user): ?string
    {
        if (!$actor->relationLoaded('followedUsers')) {
            return self::for($actor, $user);
        }

        $key = $actor->id.':'.$user->id;

        if (!array_key_exists($key, self::$followStateCache)) {
            /** @phpstan-ignore-next-line Access to dynamic relationship property */
            $followed = $actor->followedUsers->first(fn ($u) => $u->id === $user->id);
            self::$followStateCache[$key] = $followed ? $followed->pivot->subscription : null;
        }

        return self::$followStateCache[$key];
    }

    /**
     * Get the number of users the given user is following.
     * Results are cached for the duration of the request.
     *
     * @param User $user
     *
     * @return int
     */
    public static function getFollowingCount(User $user): int
    {
        if (!isset(self::$followingCountCache[$user->id])) {
            self::$followingCountCache[$user->id] = self::where('user_id', $user->id)->count();
        }

        return self::$followingCountCache[$user->id];
    }

    /**
     * Get the number of users following the given user.
     * Results are cached for the duration of the request.
     *
     * @param User $user
     *
     * @return int
     */
    public static function getFollowerCount(User $user): int
    {
        if (!isset(self::$followerCountCache[$user->id])) {
            self::$followerCountCache[$user->id] = self::where('followed_user_id', $user->id)->count();
        }

        return self::$followerCountCache[$user->id];
    }
}
