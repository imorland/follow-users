<?php

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