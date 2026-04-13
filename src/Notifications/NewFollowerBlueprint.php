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
use Flarum\Notification\MailableInterface;
use Flarum\User\User;

class NewFollowerBlueprint implements BlueprintInterface, MailableInterface, AlertableInterface
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
    public function getEmailViews(): array
    {
        return ['text' => 'ianm-follow-users::email.plain.newFollower', 'html' => 'ianm-follow-users::email.html.newFollower'];
    }

    /**
     * {@inheritdoc}
     */
    public function getEmailSubject(\Flarum\Locale\TranslatorInterface $translator): string
    {
        return $translator->trans('ianm-follow-users.email.new_follower.subject', [
            '{follower_display_name}' => $this->actor->display_name,
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public static function getType(): string
    {
        return 'newFollower';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel(): string
    {
        return User::class;
    }
}
