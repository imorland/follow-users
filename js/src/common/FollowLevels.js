import app from 'flarum/common/app';

const trans = (key) => () => app.translator.trans(`ianm-follow-users.lib.follow_levels.${key}`);

export const FollowLevels = Object.freeze([
    {
        value: 'DISCUSSIONS',
        name: trans('discussions.name'),
        description: trans('discussions.description'),
    },
    {
        value: 'POSTS',
        name: trans('posts.name'),
        description: trans('posts.description'),
    },
]);
