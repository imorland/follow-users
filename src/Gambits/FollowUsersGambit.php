<?php

/*
 * This file is part of ianm/follow-users
 *
 *  Copyright (c) 2020 Ian Morland.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 *
 */

namespace IanM\FollowUsers\Gambits;

use Flarum\Discussion\Search\DiscussionSearch;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\AbstractSearch;
use Flarum\Subscriptions\Gambit\SubscriptionGambit;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Arr;
use LogicException;

class FollowUsersGambit extends AbstractRegexGambit
{
    /**
     * {@inheritdoc}
     */
    protected $pattern = 'is:following-users';

    /**
     * {@inheritdoc}
     */
    protected function conditions(AbstractSearch $search, array $matches, $negate)
    {
        if (!$search instanceof DiscussionSearch) {
            throw new LogicException('This gambit can only be applied on a DiscussionSearch');
        }

        /**
         * @var User $actor
         */
        $actor = $search->getActor();

        if ($actor->isGuest()) {
            return;
        }

        /**
         * @var BelongsToMany $followed
         */
        $followed = $actor->followedUsers();

        $includeFollowing = Arr::first($search->getActiveGambits(), function ($gambit) {
            return $gambit instanceof SubscriptionGambit;
        });

        $search->getQuery()->{$includeFollowing ? 'orWhereIn' : 'whereIn'}('id', function (Builder $query) use ($followed) {
            $query->select('id')
                ->from('discussions')
                ->whereIn('user_id', $followed->pluck('id')->toArray());
        });
    }
}
