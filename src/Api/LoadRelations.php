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
use Flarum\Http\RequestUtil;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;
use Illuminate\Database\Eloquent\Collection;
use IanM\FollowUsers\FollowState;

class LoadRelations
{
    public function __invoke(AbstractSerializeController $controller, User $data, ServerRequestInterface $request): User
    {
        RequestUtil::getActor($request)
            ->load('followedUsers');

        $data->load('followedUsers');

        return $data;
    }

    /**
     * Batch-loads follower/following counts onto the User models of
     * the discussion collection before serialization.
     *
     * Sets $user->followed_by_count and $user->followed_users_count via
     * Eloquent's loadCount().
     */
    public static function countRelation($controller, $data): void
    {
        $users = null;

        if ($data instanceof Discussion) {
            $users = new Collection(array_filter([$data->user, $data->lastPostedUser]));
        } elseif ($data instanceof Collection) {
            $data->loadMissing(['user', 'lastPostedUser']);
            $users = new Collection(
                $data->flatMap(fn($d) => array_filter([$d->user, $d->lastPostedUser]))
                    ->unique('id')->values()->all()
            );
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
