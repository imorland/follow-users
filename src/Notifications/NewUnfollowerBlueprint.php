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

use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\User\User;

class NewUnfollowerBlueprint implements BlueprintInterface
{
    /**
     * @var User
     */
    public $actor;

    public function __construct(User $actor)
    {
        $this->actor = $actor;
    }

    /**
     * {@inheritdoc}
     */
    public function getFromUser()
    {
        return $this->actor;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject()
    {
        return $this->actor;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'newUnfollower';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return User::class;
    }
}
