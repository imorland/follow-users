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

namespace IanM\FollowUsers\Query;

use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;
use Flarum\User\User;
use Flarum\User\UserRepository;
use Illuminate\Database\Query\Builder;

class FollowedUsersFilter implements FilterInterface
{
    /**
     * @param \Flarum\User\UserRepository $users
     */
    public function __construct(protected UserRepository $users)
    {
    }

    /**
     * {@inheritdoc}
     */

    /**
     * {@inheritdoc}
     */

    public function getFilterKey(): string
    {
        return 'followeduser';
    }

    public function filter(SearchState $state, array|string $value, bool $negate): void
    {
        $this->constrain($state->getQuery(), $state->getActor(), $negate);
    }

    protected function constrain(\Illuminate\Database\Eloquent\Builder $query, User $actor, bool $negate): void
    {
        $query->where(function ($query) use ($actor, $negate) {
            $ids = $actor->followedUsers()->pluck('users.id');
            if ($negate) {
                $query->whereNotIn('id', $ids);
            } else {
                $query->whereIn('id', $ids);
            }
        });
    }
}
