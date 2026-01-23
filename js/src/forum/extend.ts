import Extend from 'flarum/common/extenders';
import User from 'flarum/common/models/User';
import FollowingPage from './components/FollowingPage';
import FollowersPage from './components/FollowersPage';

export default [
  new Extend.Model(User)
    .attribute<boolean>('followed')
    .hasMany<User>('followedUsers')
    .hasMany<User>('followedBy')
    .attribute<boolean>('blocksFollow')
    .attribute<boolean>('canBeFollowed')
    .attribute<number>('followingCount')
    .attribute<number>('followerCount'),

  new Extend.Routes()
    .add('user.followedUsers', '/u/:username/followedUsers', FollowingPage)
    .add('user.followers', '/u/:username/followers', FollowersPage),
];
