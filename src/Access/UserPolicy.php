<?php

namespace IanM\FollowUsers\Access;

use Flarum\User\AbstractPolicy;
use Flarum\User\User;

class UserPolicy extends AbstractPolicy
{
    /**
     * {@inheritdoc}
     */
    protected $model = User::class;

    /**
     * @param  User $actor
     * @param  User $user
     * @return bool|null
     */
    public function follow(User $actor, User $user)
    {
        if ($actor->isAdmin()) {
            return true;
        }

        if ($user->id === $actor->id || $user->preferences['blocksFollow'] || !$user->hasPermission('user.beFollowed')) {
            return false;
        }

        return true;
    }
}
