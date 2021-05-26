<?php

namespace IanM\FollowUsers\Query;

use Carbon\Carbon;
use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;
use Flarum\User\Guest;
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
            if ($negate) {
                $query->where('suspended_until', null)->orWhere('suspended_until', '<', Carbon::now());
            } else {
                $query->whereIn('id', $actor->followedUsers()->pluck('id'));
            }
        });
    }
}