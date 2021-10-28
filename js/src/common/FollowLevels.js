import app from 'flarum/common/app';

const trans = (key) => (opts) => app.translator.trans(`ianm-follow-users.lib.follow_levels.${key}`, opts);

export const FollowLevels = Object.freeze([
  {
    value: 'unfollow',
    name: trans('unfollow.name'),
    description: trans('unfollow.description'),
  },
  {
    value: 'follow',
    name: trans('follow.name'),
    description: trans('follow.description'),
  },
  {
    value: 'lurk',
    name: trans('lurk.name'),
    description: trans('lurk.description'),
  },
]);
