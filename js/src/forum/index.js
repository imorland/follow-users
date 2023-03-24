import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import NotificationGrid from 'flarum/forum/components/NotificationGrid';

import addFollowControls from './addFollowControls';
import addProfilePage from './addProfilePage';
import NewDiscussionNotification from './components/NewDiscussionNotification';
import NewPostNotification from './components/NewPostNotification';
import NewFollowerNotification from './components/NewFollowerNotification';
import NewUnfollowerNotification from './components/NewUnfollowerNotification';
import addFollowBadge from './addFollowBadge';
import addPrivacySetting from './addPrivacySetting';
import addFollowingUsers from './addFollowingUsers';
import addUserCardStats from './addUserCardStats';

export { default as extend } from './extend';

app.initializers.add(
  'ianm-follow-users',
  () => {
    addFollowControls();
    addProfilePage();
    addFollowBadge();
    addPrivacySetting();
    addFollowingUsers();
    addUserCardStats();

    app.notificationComponents.newFollower = NewFollowerNotification;
    app.notificationComponents.newUnfollower = NewUnfollowerNotification;
    app.notificationComponents.newDiscussionByUser = NewDiscussionNotification;
    app.notificationComponents.newPostByUser = NewPostNotification;

    extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
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
  },
  -1
);
