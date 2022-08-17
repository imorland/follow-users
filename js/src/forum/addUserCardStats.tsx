import { extend } from 'flarum/common/extend';
import icon from 'flarum/common/helpers/icon';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import UserCard from 'flarum/forum/components/UserCard';
import type Mithril from 'mithril';

export default function addUserCardStats() {
  extend(UserCard.prototype, 'infoItems', function (items: ItemList<Mithril.Children>) {
    if (!this.attrs.user || !app.forum.attribute('ianm-follow-users.stats-on-profile')) return;

    const user = this.attrs.user;
    const followedUsersCount = user.followingCount();
    const followersUsersCount = user.followerCount();

    items.add(
      'followers',
      <div className="FollowUsers--stats">
        <span>
          {icon('fas fa-user-friends')}
          <span className="Button-badge">{followedUsersCount} </span>{' '}
          {app.translator.trans('ianm-follow-users.forum.followed', { count: followedUsersCount })}
          <span className="Button-badge">{followersUsersCount}</span>{' '}
          {app.translator.trans('ianm-follow-users.forum.followers', { count: followersUsersCount })}
        </span>
      </div>,
      40
    );
  });
}
