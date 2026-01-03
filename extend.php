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

use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Discussion\Event as DiscussionEvent;
use Flarum\Extend;
use Flarum\Gdpr\Extend\UserData;
use Flarum\User\Search\UserSearcher;
use Flarum\User\User;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->jsDirectory(__DIR__.'/js/dist/forum')
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
        ->type(Notifications\NewFollowerBlueprint::class, ['alert'])
        ->type(Notifications\NewUnfollowerBlueprint::class, ['alert'])
        ->type(Notifications\NewDiscussionBlueprint::class, ['alert', 'email'])
        ->type(Notifications\NewPostByUserBlueprint::class, ['alert', 'email']),

    (new Extend\Event())
        ->listen(DiscussionEvent\Deleted::class, Listeners\DeleteNotificationWhenDiscussionIsHiddenOrDeleted::class)
        ->listen(DiscussionEvent\Hidden::class, Listeners\DeleteNotificationWhenDiscussionIsHiddenOrDeleted::class)
        ->listen(DiscussionEvent\Restored::class, Listeners\RestoreNotificationWhenDiscussionIsRestored::class)
        ->subscribe(Listeners\QueueNotificationJobs::class),

    (new Extend\User())
        ->registerPreference('blocksFollow', 'boolval', false),

    (new Extend\Policy())
        ->modelPolicy(User::class, Access\UserPolicy::class),

    // API Resource extensions (Flarum 2.x)
    (new Extend\ApiResource(Resource\UserResource::class))
        ->fields(Api\UserResourceFields::class)
        ->endpoint(Endpoint\Index::class, function (Endpoint\Index $endpoint) {
            return $endpoint->addDefaultInclude(['followedUsers', 'followedBy']);
        })
        ->endpoint(Endpoint\Show::class, function (Endpoint\Show $endpoint) {
            return $endpoint->addDefaultInclude(['followedUsers', 'followedBy']);
        }),

    (new Extend\ApiResource(Resource\ForumResource::class))
        ->endpoint(Endpoint\Show::class, function (Endpoint\Show $endpoint) {
            return $endpoint->addDefaultInclude(['actor.followedUsers']);
        }),

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

    (new Extend\SearchDriver(\Flarum\Search\Database\DatabaseSearchDriver::class))
        ->addFilter(\Flarum\Discussion\Search\DiscussionSearcher::class, Query\FollowUsersDiscussionFilter::class)
        ->addFilter(UserSearcher::class, Query\FollowedUsersFilter::class),
];
