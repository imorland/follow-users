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
use Flarum\Notification\MailableInterface;
use Flarum\User\User;
use Symfony\Contracts\Translation\TranslatorInterface;

class NewFollowerBlueprint implements BlueprintInterface, MailableInterface
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
    public function getEmailView()
    {
        return ['text' => 'ianm-follow-users::emails.newFollower'];
    }

    /**
     * {@inheritdoc}
     */
    public function getEmailSubject(TranslatorInterface $translator)
    {
        return $translator->trans('ianm-follow-users.email.new_follower_subject', [
            '{username}' => $this->actor->username,
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'newFollower';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return User::class;
    }
}
