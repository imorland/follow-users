import app from 'flarum/admin/app';
import { utils } from 'ext:fof/follow-tags/forum/utils';
import ianMfollowingPageOptions from '../common/helpers/followingPageOptions';

export { default as extend } from './extend';

app.initializers.add('ianm-follow-users', () => {
  if ('fof-follow-tags' in flarum.extensions) {
    // Replace the original function with our customized version
    utils.followingPageOptions = ianMfollowingPageOptions;
    // Execute the customized helper to cache the returned list of options
    utils.followingPageOptions('admin.settings');
  }
});
