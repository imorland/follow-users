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
use Flarum\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Query\Builder;

class FollowUsersDiscussionFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'following-users';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $this->constrain($filterState->getQuery(), $filterState->getActor(), $negate);
    }

    protected function constrain(Builder $query, User $actor, bool $negate)
    {
        if ($actor->isGuest()) {
            return;
        }

        $method = $negate ? 'orWhereIn' : 'whereIn';

        /**
         * @var BelongsToMany $followed
         */
        $followed = $actor->followedUsers();

        $query->$method('discussions.id', function (Builder $query) use ($followed) {
            $query->select('id')
                ->from('discussions')
                ->whereIn('user_id', $followed->pluck('users.id')->toArray());
        });
    }
}
