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
use Flarum\Api\Controller\ShowForumController;
use Flarum\Api\Controller\ShowUserController;
use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Discussion\Event as DiscussionEvent;
use Flarum\Discussion\Filter\DiscussionFilterer;
use Flarum\Extend;
use Flarum\Gdpr\Extend\UserData;
use Flarum\Http\RequestUtil;
use Flarum\User\Event\Saving;
use Flarum\User\Filter\UserFilterer;
use Flarum\User\Search\UserSearcher;
use Flarum\User\User;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Model(User::class))
        ->belongsToMany('followedUsers', User::class, 'user_followers', 'user_id', 'followed_user_id')
        ->belongsToMany('followedBy', User::class, 'user_followers', 'followed_user_id', 'user_id'),

    (new Extend\View())
        ->namespace('ianm-follow-users', __DIR__.'/resources/views'),

    (new Extend\Notification())
        ->type(Notifications\NewFollowerBlueprint::class, BasicUserSerializer::class, ['alert'])
        ->type(Notifications\NewUnfollowerBlueprint::class, BasicUserSerializer::class, ['alert'])
        ->type(Notifications\NewDiscussionBlueprint::class, DiscussionSerializer::class, ['alert', 'email'])
        ->type(Notifications\NewPostByUserBlueprint::class, DiscussionSerializer::class, ['alert', 'email']),

    (new Extend\Event())
        ->listen(Saving::class, Listeners\SaveFollowedToDatabase::class)
        ->listen(DiscussionEvent\Deleted::class, Listeners\DeleteNotificationWhenDiscussionIsHiddenOrDeleted::class)
        ->listen(DiscussionEvent\Hidden::class, Listeners\DeleteNotificationWhenDiscussionIsHiddenOrDeleted::class)
        ->listen(DiscussionEvent\Restored::class, Listeners\RestoreNotificationWhenDiscussionIsRestored::class)
        ->subscribe(Listeners\QueueNotificationJobs::class),

    (new Extend\Filter(DiscussionFilterer::class))
        ->addFilter(Query\FollowUsersDiscussionFilter::class),

    (new Extend\Filter(UserFilterer::class))
        ->addFilter(Query\FollowedUsersFilterGambit::class),

    (new Extend\SimpleFlarumSearch(UserSearcher::class))
        ->addGambit(Query\FollowedUsersFilterGambit::class),

    (new Extend\User())
        ->registerPreference('blocksFollow', 'boolval', false),

    (new Extend\Policy())
        ->modelPolicy(User::class, Access\UserPolicy::class),

    (new Extend\ApiSerializer(CurrentUserSerializer::class))
        ->hasMany('followedUsers', UserSerializer::class),

    (new Extend\ApiSerializer(BasicUserSerializer::class))
        ->attributes(Api\AddBasicUserAttributes::class),

    (new Extend\ApiSerializer(UserSerializer::class))
        ->attributes(Api\AddUserAttributes::class),

    (new Extend\ApiController(ListUsersController::class))
        ->prepareDataForSerialization(function (ListUsersController $controller, $data, $request) {
            $actor = RequestUtil::getActor($request);
            $actor->load('followedUsers');

            return $data;
        })
        ->addInclude(['followedUsers', 'followedBy']),

    (new Extend\ApiController(ShowUserController::class))
        ->prepareDataForSerialization(Api\LoadRelations::class)
        ->addInclude(['followedUsers', 'followedBy']),

    (new Extend\ApiController(ShowForumController::class))
        ->addInclude('actor.followedUsers'),

    (new Extend\Settings())
        ->default('ianm-follow-users.button-on-profile', false)
        ->default('ianm-follow-users.stats-on-profile', true)
        ->serializeToForum('ianm-follow-users.button-on-profile', 'ianm-follow-users.button-on-profile', 'boolVal')
        ->serializeToForum('ianm-follow-users.stats-on-profile', 'ianm-follow-users.stats-on-profile', 'boolVal'),

    (new Extend\Conditional())
        ->whenExtensionEnabled('flarum-gdpr', fn () => [
            (new UserData())
                ->addType(Data\FollowUser::class),
        ]),
];
