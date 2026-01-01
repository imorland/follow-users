import { extend } from 'flarum/common/extend';

export default function addNotificationSettings() {
  extend('flarum/forum/components/NotificationGrid', 'notificationTypes', function (items) {
    items.add('newFollower', {
      name: 'newFollower',
      icon: 'fas fa-user-plus',
      label: app.translator.trans('ianm-follow-users.forum.settings.notify_new_follower_label'),
    });
    items.add('newUnfollower', {
      name: 'newUnfollower',
      icon: 'fas fa-user-minus',
      label: app.translator.trans('ianm-follow-users.forum.settings.notify_new_unfollower_label'),
    });
    items.add('newDiscussionByUser', {
      name: 'newDiscussionByUser',
      icon: 'fas fa-user-friends',
      label: app.translator.trans('ianm-follow-users.forum.settings.notify_new_discussion_label'),
    });
    items.add('newPostByUser', {
      name: 'newPostByUser',
      icon: 'fas fa-user-friends',
      label: app.translator.trans('ianm-follow-users.forum.settings.notify_new_post_label'),
    });
  });
}
