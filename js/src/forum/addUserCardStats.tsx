import { extend } from 'flarum/common/extend';
import Icon from 'flarum/common/components/Icon';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import UserCard from 'flarum/forum/components/UserCard';
import type Mithril from 'mithril';
import type User from 'flarum/common/models/User';

export default function addUserCardStats() {
  extend(UserCard.prototype, 'infoItems', function (this: UserCard & { attrs: { user?: User } }, items: ItemList<Mithril.Children>) {
    if (!this.attrs.user || !app.forum.attribute('ianm-follow-users.stats-on-profile')) return;

    const user = this.attrs.user;
    const followedUsersCount = user.followingCount();
    const followersUsersCount = user.followerCount();

    items.add(
      'followers',
      <div className="FollowUsers--stats">
        <span>
          <Icon name="fas fa-user-friends" />
          <span className="FollowUsers--count">{followedUsersCount} </span>{' '}
          {app.translator.trans('ianm-follow-users.forum.followed', { count: followedUsersCount })}
          <span className="FollowUsers--count">{followersUsersCount}</span>{' '}
          {app.translator.trans('ianm-follow-users.forum.followers', { count: followersUsersCount })}
        </span>
      </div>,
      40
    );
  });
}
