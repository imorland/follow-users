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

use Flarum\Api\Serializer\BasicUserSerializer;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use IanM\FollowUsers\FollowState;

class AddBasicUserAttributes
{
    public function __construct(protected SettingsRepositoryInterface $settings)
    {
    }

    public function __invoke(BasicUserSerializer $serializer, User $user, array $attributes): array
    {
        $attributes['followed'] = FollowState::for($serializer->getActor(), $user);

        if ((bool) $this->settings->get('ianm-follow-users.stats-on-profile')) {
            $attributes['followerCount'] = FollowState::getFollowerCount($user);
            $attributes['followingCount'] = FollowState::getFollowingCount($user);
        }

        return $attributes;
    }
}
