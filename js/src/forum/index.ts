import app from 'flarum/forum/app';
import addFollowControls from './addFollowControls';
import addProfilePage from './addProfilePage';
import addFollowBadge from './addFollowBadge';
import addPrivacySetting from './addPrivacySetting';
import addFollowingUsers from './addFollowingUsers';
import addUserCardStats from './addUserCardStats';
import addNotificationSettings from './addNotifictionSettings';
import extendUserDirectoryPage from './extendUserDirectoryPage';

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
    addNotificationSettings();

    if ('fof-user-directory' in flarum.extensions) {
      extendUserDirectoryPage();
    }
  },
  -10 // Run before fof-follow-tags (which runs at -1)
);
