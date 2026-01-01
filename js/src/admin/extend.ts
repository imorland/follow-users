import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';

export default [
  ...commonExtend,

  new Extend.Admin() //
    .permission(
      () => ({
        icon: 'fas fa-user-friends',
        label: app.translator.trans('ianm-follow-users.admin.permissions.be_followed_label'),
        permission: 'user.beFollowed',
      }),
      'reply',
      95
    )
    .setting(() => ({
      label: app.translator.trans('ianm-follow-users.admin.settings.button-on-profile-label'),
      type: 'bool',
      setting: 'ianm-follow-users.button-on-profile',
    }))
    .setting(() => ({
      label: app.translator.trans('ianm-follow-users.admin.settings.stats-on-profile-label'),
      type: 'bool',
      setting: 'ianm-follow-users.stats-on-profile',
    })),
];
