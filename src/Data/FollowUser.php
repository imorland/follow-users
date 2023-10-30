<?php

namespace IanM\FollowUsers\Data;

use Blomstra\Gdpr\Data\Type;
use IanM\FollowUsers\FollowState;
use Illuminate\Support\Arr;

class FollowUser extends Type
{
    public function export(): ?array
    {
        $dataExport = [];

        FollowState::query()
            ->where('user_id', $this->user->id)
            ->each(function (FollowState $followState) use (&$dataExport) {
                $dataExport[] = [
                    "follow-users/following/{$followState->followed_user_id}.json" => $this->encodeForExport($this->sanitize($followState))
                ];
            });

        FollowState::query()
            ->where('followed_user_id', $this->user->id)
            ->each(function (FollowState $followState) use (&$dataExport) {
                $dataExport[] = [
                    "follow-users/followers/{$followState->user_id}.json" => $this->encodeForExport($this->sanitize($followState))
                ];
            });

        return $dataExport;
    }

    protected function sanitize(FollowState $state): array
    {
        return Arr::except($state->toArray(), [
            'user_id', 'id', 'followed_user_id',
        ]);
    }

    public function anonymize(): void
    {
        $this->delete();
    }

    public function delete(): void
    {
        FollowState::query()
            ->where('user_id', $this->user->id)
            ->orWhere('followed_user_id', $this->user->id)
            ->delete();
    }
}
