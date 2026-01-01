import app from 'flarum/forum/app';
import addFollowControls from './addFollowControls';
import addProfilePage from './addProfilePage';
import addFollowBadge from './addFollowBadge';
import addPrivacySetting from './addPrivacySetting';
import addFollowingUsers from './addFollowingUsers';
import addUserCardStats from './addUserCardStats';
import addNotificationSettings from './addNotifictionSettings';

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
  },
  -10 // Run before fof-follow-tags (which runs at -1)
);
