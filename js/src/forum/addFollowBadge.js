import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Discussion from 'flarum/common/models/Discussion';
import User from 'flarum/common/models/User';
import Badge from 'flarum/common/components/Badge';

export default function addFollowBadge() {
  extend(Discussion.prototype, 'badges', function (badges) {
    if (this.user()?.followed?.()) {
      badges.add(
        'user-following',
        <Badge
          label={app.translator.trans(`ianm-follow-users.forum.badge.label.${this.user().followed()}`)}
          icon="fas fa-user-friends"
          type="friend"
        />
      );
    }
  });

  extend(User.prototype, 'badges', function (badges) {
    if (this.followed()) {
      badges.add(
        'user-following',
        <Badge label={app.translator.trans(`ianm-follow-users.forum.badge.label.${this.followed()}`)} icon="fas fa-user-friends" type="friend" />
      );
    }
  });
}
