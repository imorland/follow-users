<?php

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

        if ((bool) $this->settings->get('ianm-follow-users.stats-on-profile')) {
            $attributes['followingCount'] = FollowState::getFollowingCount($user);
            $attributes['followerCount'] = FollowState::getFollowerCount($user);
        }

        return $attributes;
    }
}
