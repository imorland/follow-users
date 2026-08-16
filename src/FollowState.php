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
     * User IDs seen during serialization whose follow data has not been loaded
     * yet. Collected while the serializer walks the document; drained by a
     * single batch query the first time a deferred field getter resolves.
     *
     * @var array<int, true>
     */
    private static array $pendingUserIds = [];

    /**
     * The actor the pending IDs are to be resolved against.
     */
    private static ?int $pendingActorId = null;

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
     * Note that a user is going to be serialized, so that their follow data can
     * be loaded alongside every other user in the same document.
     *
     * Called while the serializer walks the document, before any deferred field
     * getter has resolved. Registering costs nothing; the query happens once,
     * when the first getter actually needs a value.
     */
    public static function willSerialize(User $actor, User $user): void
    {
        $actorId = (int) $actor->id;

        // A new actor invalidates anything queued for the previous one. In
        // practice one request has one actor, but this keeps the queue honest
        // if that ever stops being true.
        if (self::$pendingActorId !== $actorId) {
            self::$pendingUserIds = [];
            self::$pendingActorId = $actorId;
        }

        self::$pendingUserIds[(int) $user->id] = true;
    }

    /**
     * Load follow data for every user registered by willSerialize() that is not
     * already cached, in one query per data set.
     *
     * Runs at most once per batch: the queue is cleared before the queries are
     * issued, so the getters that resolve after the first one find their values
     * already cached.
     */
    public static function resolvePending(): void
    {
        if (self::$pendingActorId === null || empty(self::$pendingUserIds)) {
            return;
        }

        $actorId = self::$pendingActorId;
        $userIds = array_keys(self::$pendingUserIds);

        self::$pendingUserIds = [];
        self::$pendingActorId = null;

        // Only load what an earlier seed or a previous batch has not supplied.
        $needsState = array_values(array_filter(
            $userIds,
            fn (int $id) => !array_key_exists($actorId.':'.$id, self::$followStateCache)
        ));

        $needsCounts = array_values(array_filter(
            $userIds,
            fn (int $id) => !isset(self::$followerCountCache[$id]) || !isset(self::$followingCountCache[$id])
        ));

        if (!empty($needsState)) {
            self::seedActorFollowStates($actorId, $needsState);
        }

        if (!empty($needsCounts)) {
            self::seedCountsFor($needsCounts);
        }
    }

    /**
     * Load follower and following counts for many users in two grouped queries
     * rather than one COUNT per user.
     *
     * @param int[] $userIds
     */
    public static function seedCountsFor(array $userIds): void
    {
        if (empty($userIds)) {
            return;
        }

        $followers = self::query()
            ->selectRaw('followed_user_id, count(*) as aggregate')
            ->whereIn('followed_user_id', $userIds)
            ->groupBy('followed_user_id')
            ->pluck('aggregate', 'followed_user_id');

        $following = self::query()
            ->selectRaw('user_id, count(*) as aggregate')
            ->whereIn('user_id', $userIds)
            ->groupBy('user_id')
            ->pluck('aggregate', 'user_id');

        // Users with no rows are absent from the grouped results, so default
        // every requested ID to zero before applying what was found.
        foreach ($userIds as $userId) {
            self::$followerCountCache[$userId] = (int) ($followers[$userId] ?? 0);
            self::$followingCountCache[$userId] = (int) ($following[$userId] ?? 0);
        }
    }

    /**
     * Discard all memoised state.
     *
     * Under php-fpm or the CLI the process ends with the request, so these
     * caches never outlive it. A persistent runtime (Swoole, FrankenPHP worker
     * mode, Octane) reuses the process, where a cache that is never cleared
     * would serve data from an earlier request — including follow state that
     * has since changed. Such a runtime should call this between requests.
     */
    public static function flushCache(): void
    {
        self::$followStateCache = [];
        self::$followerCountCache = [];
        self::$followingCountCache = [];
        self::$pendingUserIds = [];
        self::$pendingActorId = null;
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
            // Load this user together with every other user queued for the same
            // document, rather than one query for this one alone.
            self::resolvePending();
        }

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
            self::resolvePending();
        }

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
            self::resolvePending();
        }

        if (!isset(self::$followerCountCache[(int) $user->id])) {
            self::$followerCountCache[(int) $user->id] = self::where('followed_user_id', $user->id)->count();
        }

        return self::$followerCountCache[(int) $user->id];
    }
}
