import app from 'flarum/common/app';
import * as follow_tags from '@fof-follow-tags';
import followingPageOptions from '../common/helpers/followingPageOptions';

app.initializers.add('ianm-follow-users', () => {
  app.extensionData.for('ianm-follow-users').registerPermission(
    {
      icon: 'fas fa-user-friends',
      label: app.translator.trans('ianm-follow-users.admin.permissions.be_followed_label'),
      permission: 'user.beFollowed',
    },
    'reply',
    95
  );

  if (app.initializers.has('fof/follow-tags')) {
    // Replace the original function with our customized version
    follow_tags.utils.followingPageOptions = followingPageOptions;
    // Execute the customized helper to cache the returned list of options
    follow_tags.utils.followingPageOptions('admin.settings');
  }
});
