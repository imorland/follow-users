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

namespace IanM\FollowUsers\Notifications;

use Flarum\Notification\AlertableInterface;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\User\User;

class NewUnfollowerBlueprint implements BlueprintInterface, AlertableInterface
{
    public function __construct(public User $actor)
    {
    }

    /**
     * {@inheritdoc}
     */
    public function getFromUser(): ?\Flarum\User\User
    {
        return $this->actor;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject(): ?\Flarum\Database\AbstractModel
    {
        return $this->actor;
    }

    /**
     * {@inheritdoc}
     */
    public function getData(): mixed
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public static function getType(): string
    {
        return 'newUnfollower';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel(): string
    {
        return User::class;
    }
}
