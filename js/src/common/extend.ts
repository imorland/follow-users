import Extend from 'flarum/common/extenders';
import FollowedUsersGambit from './gambits/FollowedUsersGambit';

export default [
  new Extend.Search() //
    .gambit('users', FollowedUsersGambit),
];
