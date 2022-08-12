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

use Flarum\Api\Serializer\UserSerializer;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;

class AddUserAttributes
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(UserSerializer $serializer, User $user, array $attributes): array
    {
        $actor = $serializer->getActor();

        $attributes['followed'] = FollowState::for($actor, $user);
        $attributes['canBeFollowed'] = $actor->can('follow', $user);

        $attributes['followingCount'] = FollowState::getFollowingCount($user);

        if ((bool) $this->settings->get('ianm-follow-users.stats-on-profile')) {
            $attributes['followerCount'] = FollowState::getFollowerCount($user);
        }

        return $attributes;
    }
}
