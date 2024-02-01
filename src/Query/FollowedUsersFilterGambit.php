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

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;
use Flarum\User\User;
use Flarum\User\UserRepository;
use Illuminate\Database\Query\Builder;

class FollowedUsersFilterGambit extends AbstractRegexGambit implements FilterInterface
{
    /**
     * @var \Flarum\User\UserRepository
     */
    protected $users;

    /**
     * @param \Flarum\User\UserRepository $users
     */
    public function __construct(UserRepository $users)
    {
        $this->users = $users;
    }

    protected function getGambitPattern()
    {
        return 'is:followeduser';
    }

    /**
     * {@inheritdoc}
     */
    public function apply(SearchState $search, $bit)
    {
        return parent::apply($search, $bit);
    }

    /**
     * {@inheritdoc}
     */
    protected function conditions(SearchState $search, array $matches, $negate)
    {
        $this->constrain($search->getQuery(), $search->getActor(), $negate);
    }

    public function getFilterKey(): string
    {
        return 'followeduser';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $this->constrain($filterState->getQuery(), $filterState->getActor(), $negate);
    }

    protected function constrain(Builder $query, User $actor, bool $negate)
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
