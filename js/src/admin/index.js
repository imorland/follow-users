import app from 'flarum/admin/app';
import * as follow_tags from '@fof-follow-tags';
import followingPageOptions from '../common/helpers/followingPageOptions';

app.initializers.add('ianm-follow-users', () => {
  app.extensionData
    .for('ianm-follow-users')
    .registerPermission(
      {
        icon: 'fas fa-user-friends',
        label: app.translator.trans('ianm-follow-users.admin.permissions.be_followed_label'),
        permission: 'user.beFollowed',
      },
      'reply',
      95
    )
    .registerSetting({
      label: app.translator.trans('ianm-follow-users.admin.settings.button-on-profile-label'),
      type: 'bool',
      setting: 'ianm-follow-users.button-on-profile',
    })
    .registerSetting({
      label: app.translator.trans('ianm-follow-users.admin.settings.stats-on-profile-label'),
      type: 'bool',
      setting: 'ianm-follow-users.stats-on-profile',
    });

  if (app.initializers.has('fof/follow-tags')) {
    // Replace the original function with our customized version
    follow_tags.utils.followingPageOptions = followingPageOptions;
    // Execute the customized helper to cache the returned list of options
    follow_tags.utils.followingPageOptions('admin.settings');
  }
});
