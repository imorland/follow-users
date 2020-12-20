import { extend } from 'flarum/extend';
import Discussion from 'flarum/models/Discussion';
import User from 'flarum/models/User';
import Badge from 'flarum/components/Badge';

export default function addSubscriptionBadge() {
    extend(Discussion.prototype, 'badges', function (badges) {
        let badge;

        if (this.user() && this.user().followed()) {
            badge = Badge.component({
                label: app.translator.trans('ianm-follow-users.forum.badge.label'),
                icon: 'fas fa-user-friends',
                type: 'friend',
            });
        }

        if (badge) {
            badges.add('user-following', badge);
        }
    });

    extend(User.prototype, 'badges', function (badges) {
        let badge;

        if (this.followed()) {
            badge = Badge.component({
                label: app.translator.trans('ianm-follow-users.forum.badge.label'),
                icon: 'fas fa-user-friends',
                type: 'friend',
            });
        }

        if (badge) {
            badges.add('user-following', badge);
        }
    });
}
