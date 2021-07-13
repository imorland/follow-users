<?php

namespace IanM\FollowUsers;

use Flarum\Database\AbstractModel;
use Flarum\User\User;

class FollowState extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'user_followers';

    /**
     * {@inheritDoc}
     */
    protected $fillable = ['user_id', 'followed_user_id', 'subscription'];

    /**
     * {@inheritDoc}
     */
    protected $primaryKey = ['user_id', 'followed_user_id'];

    /**
     * {@inheritDoc}
     */
    public $incrementing = false;

    /**
     * Get the follow user subscription state for the given User.
     *
     * @param User $actor
     * @param User $user
     * @return null|string
     */
    public static function for (User $actor, User $user): ?string
    {
        $sub = self::where('user_id', $actor->id)->where('followed_user_id', $user->id)->first();

        return $sub ? $sub->subscription : null;
    }

    /**
     * Set the keys for a save update query.
     *
     * @param Builder $query
     * @return Builder
     */
    protected function setKeysForSaveQuery($query)
    {
        $query->where('user_id', $this->user_id)
              ->where('followed_user_id', $this->followed_user_id);

        return $query;
    }
}
