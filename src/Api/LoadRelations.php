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

namespace IanM\FollowUsers\Api;

use Flarum\Api\Controller\AbstractSerializeController;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Http\RequestUtil;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;
use Illuminate\Database\Eloquent\Collection;
use IanM\FollowUsers\FollowState;

class LoadRelations
{
    public function __invoke(AbstractSerializeController $controller, User $data, ServerRequestInterface $request): User
    {
        $actor = RequestUtil::getActor($request);

        if (!$actor->isGuest()) {
            $actor->loadMissing('followedUsers');
        }

        $data->loadMissing('followedUsers');

        return $data;
    }

    /**
     * Pre-loads followedUsers on the actor model before serialization.
     */
    public static function loadActorFollows($controller, $data, ServerRequestInterface $request): void
    {
        $actor = RequestUtil::getActor($request);

        if ($actor->isGuest()) {
            return;
        }

        $actor->loadMissing('followedUsers');
    }

    /**
     * Batch-loads follower/following counts for the actor and every user in actor.followedUsers before serialization.
     */
    public static function loadForumActorCounts($controller, $data, ServerRequestInterface $request): void
    {
        $actor = RequestUtil::getActor($request);

        if ($actor->isGuest()) {
            return;
        }

        $actor->loadMissing('followedUsers');

        $users = (new Collection([$actor]))
            ->merge($actor->followedUsers)
            ->unique('id');

        if ($users->isNotEmpty()) {
            $users->loadCount(['followedUsers', 'followedBy']);

            foreach ($users as $user) {
                FollowState::seedCountCache(
                    (int) $user->id,
                    (int) ($user->followed_by_count ?? 0),
                    (int) ($user->followed_users_count ?? 0)
                );
            }
        }
    }

    /**
     * Pre-loads followedUsers on the actor and batch-loads follower/following counts for the entire user list.
     */
   public static function loadUserListCounts($controller, $data, ServerRequestInterface $request): void
   {
       $actor = RequestUtil::getActor($request);

       if (!$actor->isGuest()) {
           $actor->loadMissing('followedUsers');
       }

       if ($data instanceof Collection) {
           $data->loadCount(['followedUsers', 'followedBy']);

           foreach ($data as $user) {
               FollowState::seedCountCache(
                   (int) $user->id,
                   (int) ($user->followed_by_count ?? 0),
                   (int) ($user->followed_users_count ?? 0)
               );
           }
       }
   }

    /**
     * prepareDataForSerialization callback for ListDiscussionsController,
     * ShowDiscussionController, and ListPostsController.
     *
     * Collects all user models in the payload, runs a single loadCount() for
     * follower/following counts, and seeds the static FollowState cache.
     */
    public static function countRelation($controller, $data): void
    {
        $users = null;

        if ($data instanceof Discussion) {
            $data->loadMissing(['user', 'lastPostedUser']);
            $discussionUsers = array_filter([$data->user, $data->lastPostedUser]);

            // $data->posts is a plain PHP array containing a mix of Post model
            // instances and raw integer IDs (for not-yet-loaded positions). Wrap
            // in collect() and filter to Post instances before mapping to users.
            $postUsers = $data->relationLoaded('posts')
                ? collect($data->posts)
                    ->filter(fn($p) => $p instanceof Post)
                    ->map(fn($p) => $p->user)
                    ->filter()
                    ->all()
                : [];

            $users = (new Collection(array_merge($discussionUsers, $postUsers)))
                ->unique('id')
                ->values();
        } elseif ($data instanceof Collection) {
            if ($data->first() instanceof Discussion) {
                $data->loadMissing(['user', 'lastPostedUser']);
                $users = new Collection(
                    $data->flatMap(fn($d) => array_filter([$d->user, $d->lastPostedUser]))
                        ->unique('id')->values()->all()
                );
            }

            if ($data->first() instanceof Post) {
                $data->loadMissing('user');
                $users = new Collection(
                    $data->map(fn($p) => $p->user)
                        ->filter()
                        ->unique('id')
                        ->values()
                        ->all()
                );
            }
        }

        if ($users && $users->isNotEmpty()) {
            $users->loadCount(['followedUsers', 'followedBy']);

            foreach ($users as $user) {
                FollowState::seedCountCache(
                    (int) $user->id,
                    (int) ($user->followed_by_count ?? 0),
                    (int) ($user->followed_users_count ?? 0)
                );
            }
        }
    }
}
