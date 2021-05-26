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

use Flarum\Api\Controller\ListUsersController;
use Flarum\Api\Controller\ShowUserController;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Database\AbstractModel;
use Flarum\Discussion\Event as DiscussionEvent;
use Flarum\Discussion\Filter\DiscussionFilterer;
use Flarum\Extend;
use Flarum\User\Event\Saving;
use Flarum\User\User;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less')
        ->route('/followedUsers', 'followed.users.view'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Model(User::class))
        ->relationship('followedUsers', function (AbstractModel $model) {
            return $model->belongsToMany(User::class, 'user_followers', 'user_id', 'followed_user_id')
                ->withTimestamps();
        })
        ->relationship('followedBy', function (AbstractModel $model) {
            return $model->belongsToMany(User::class, 'user_followers', 'followed_user_id', 'user_id');
        }),

    (new Extend\View())
        ->namespace('ianm-follow-users', __DIR__.'/resources/views'),

    (new Extend\Notification())
        ->type(Notifications\NewFollowerBlueprint::class, BasicUserSerializer::class, ['alert'])
        ->type(Notifications\NewUnfollowerBlueprint::class, BasicUserSerializer::class, ['alert'])
        ->type(Notifications\NewDiscussionBlueprint::class, DiscussionSerializer::class, ['alert', 'email'])
        ->type(Notifications\NewPostByUserBlueprint::class, DiscussionSerializer::class, []),

    (new Extend\Event())
        ->listen(Saving::class, Listeners\SaveFollowedToDatabase::class)
        ->listen(DiscussionEvent\Deleted::class, Listeners\DeleteNotificationWhenDiscussionIsHiddenOrDeleted::class)
        ->listen(DiscussionEvent\Hidden::class, Listeners\DeleteNotificationWhenDiscussionIsHiddenOrDeleted::class)
        ->listen(DiscussionEvent\Restored::class, Listeners\RestoreNotificationWhenDiscussionIsRestored::class)
        ->subscribe(Listeners\QueueNotificationJobs::class),

    (new Extend\Filter(DiscussionFilterer::class))
        ->addFilter(Query\FollowUsersDiscussionFilter::class),

    (new Extend\User())
        ->registerPreference('blocksFollow', 'boolval', false),

    (new Extend\Policy())
        ->modelPolicy(User::class, Access\UserPolicy::class),

    (new Extend\ApiSerializer(CurrentUserSerializer::class))
        ->hasMany('followedUsers', UserSerializer::class),

    (new Extend\ApiSerializer(UserSerializer::class))
        ->attributes(function (UserSerializer $serializer, User $user, array $attributes): array {
            $attributes['followed'] = $serializer->getActor()->followedUsers->contains($user);
            $attributes['canBeFollowed'] = $serializer->getActor()->can('follow', $user);

            return $attributes;
        }),

    (new Extend\ApiController(ListUsersController::class))
        ->prepareDataForSerialization(function (ListUsersController $controller, $data, $request) {
            $actor = $request->getAttribute('actor');
            $actor->load('followedUsers');

            return $data;
        })
        ->addInclude(['followedUsers', 'followedBy']),

    (new Extend\ApiController(ShowUserController::class))
        ->prepareDataForSerialization(function (ShowUserController $controller, $data, $request) {
            $actor = $request->getAttribute('actor');
            $actor->load('followedUsers');

            return $data;
        })
        ->addInclude(['followedUsers', 'followedBy']),
];
