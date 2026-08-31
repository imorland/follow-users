import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';

export default [
  ...commonExtend,

  new Extend.Admin() //
    .permission(
      () => ({
        icon: 'fas fa-user-plus',
        label: app.translator.trans('ianm-follow-users.admin.permissions.follow_label'),
        permission: 'user.follow',
      }),
      'reply',
      96
    )
    .permission(
      () => ({
        icon: 'fas fa-user-friends',
        label: app.translator.trans('ianm-follow-users.admin.permissions.be_followed_label'),
        permission: 'user.beFollowed',
      }),
      'reply',
      95
    )
    .permission(
      () => ({
        icon: 'fas fa-user-secret',
        label: app.translator.trans('ianm-follow-users.admin.permissions.view_followed_users_label'),
        permission: 'user.viewFollowedUsers',
      }),
      'moderate',
      94
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
