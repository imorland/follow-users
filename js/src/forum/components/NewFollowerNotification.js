import Notification from 'flarum/common/components/Notification';

export default class NewFollowerNotification extends Notification {
    icon() {
        return 'fas fa-user-plus';
    }

    href() {
        const notification = this.attrs.notification;
        const user = notification.subject();

        return app.route.user(user);
    }

    content() {
        return app.translator.trans('ianm-follow-users.forum.notifications.new_follower_text', {
            user: this.attrs.notification.fromUser(),
        });
    }
}
