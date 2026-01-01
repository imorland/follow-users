import app from 'flarum/admin/app';
import addFollowingPageOption from 'ext:fof/follow-tags/common/utils/addFollowingPageOption';

export { default as extend } from './extend';

app.initializers.add(
  'ianm-follow-users',
  () => {
    if ('fof-follow-tags' in flarum.extensions) {
      // Register our "users" option with fof-follow-tags
      addFollowingPageOption(() => ({
        users: app.translator.trans('ianm-follow-users.lib.following_link'),
      }));
    }
  },
  -10 // Run before fof-follow-tags so our option is registered before the cache is populated
);
