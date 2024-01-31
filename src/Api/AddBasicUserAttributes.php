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
use Flarum\User\User;
use IanM\FollowUsers\FollowState;

class AddBasicUserAttributes
{
    public function __invoke(BasicUserSerializer $serializer, User $user, array $attributes): array
    {
        $actor = $serializer->getActor();

        $attributes['followed'] = FollowState::for($actor, $user);

        return $attributes;
    }
}
