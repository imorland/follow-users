import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Discussion from 'flarum/common/models/Discussion';
import User from 'flarum/common/models/User';
import Badge from 'flarum/common/components/Badge';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export default function addFollowBadge() {
  extend(Discussion.prototype, 'badges', function (items: ItemList<Mithril.Children>) {
    const user = this.user();
    if (user && user instanceof User) {
      const followedStatus = user.followed?.();
      if (followedStatus) {
        items.add(
          'user-following',
          <Badge label={app.translator.trans(`ianm-follow-users.forum.badge.label.${followedStatus}`)} icon="fas fa-user-friends" type="friend" />
        );
      }
    }
  });

  extend(User.prototype, 'badges', function (items: ItemList<Mithril.Children>) {
    const followedStatus = this.followed?.();
    if (followedStatus) {
      items.add(
        'user-following',
        <Badge label={app.translator.trans(`ianm-follow-users.forum.badge.label.${followedStatus}`)} icon="fas fa-user-friends" type="friend" />
      );
    }
  });
}
