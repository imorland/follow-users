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

use Flarum\Discussion\Discussion;
use Flarum\Notification\AlertableInterface;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\MailableInterface;
use Flarum\Post\Post;

class NewDiscussionBlueprint implements BlueprintInterface, MailableInterface, AlertableInterface
{
    public function __construct(public Discussion $discussion, public ?Post $post = null)
    {
    }

    /**
     * {@inheritdoc}
     */
    public function getFromUser(): ?\Flarum\User\User
    {
        return $this->discussion->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject(): ?\Flarum\Database\AbstractModel
    {
        return $this->discussion;
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
        return ['text' => 'ianm-follow-users::email.plain.newDiscussion', 'html' => 'ianm-follow-users::email.html.newDiscussion'];
    }

    /**
     * {@inheritdoc}
     */
    public function getEmailSubject(\Flarum\Locale\TranslatorInterface $translator): string
    {
        return $translator->trans('ianm-follow-users.email.new_discussion_by_user_subject', [
            '{title}' => $this->discussion->title,
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public static function getType(): string
    {
        return 'newDiscussionByUser';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel(): string
    {
        return Discussion::class;
    }
}
