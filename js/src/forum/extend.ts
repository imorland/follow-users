import commonExtend from '../common/extend';
import Extend from 'flarum/common/extenders';
import User from 'flarum/common/models/User';
import NewFollowerNotification from './components/NewFollowerNotification';
import NewUnfollowerNotification from './components/NewUnfollowerNotification';
import NewDiscussionNotification from './components/NewDiscussionNotification';
import NewPostNotification from './components/NewPostNotification';

export default [
  ...commonExtend,

  new Extend.Model(User)
    .attribute<boolean>('followed')
    .hasMany<User>('followedUsers')
    .hasMany<User>('followedBy')
    .attribute<boolean>('blocksFollow')
    .attribute<boolean>('canBeFollowed')
    .attribute<number>('followingCount')
    .attribute<number>('followerCount'),

  new Extend.Routes() //
    .add('user.followedUsers', '/u/:username/followedUsers', () => import('./components/ProfilePage')),

  new Extend.Notification() //
    .add('newFollower', NewFollowerNotification)
    .add('newUnfollower', NewUnfollowerNotification)
    .add('newDiscussionByUser', NewDiscussionNotification)
    .add('newPostByUser', NewPostNotification),
];
