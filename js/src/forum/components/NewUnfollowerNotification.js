import app from 'flarum/forum/app';
import Notification from 'flarum/forum/components/Notification';

export default class NewUnfollowerNotification extends Notification {
  icon() {
    return 'fas fa-user-minus';
  }

  href() {
    const notification = this.attrs.notification;
    const user = notification.subject();

    return app.route.user(user);
  }

  content() {
    return app.translator.trans('ianm-follow-users.forum.notifications.new_unfollower_text', {
      user: this.attrs.notification.fromUser(),
    });
  }

  excerpt() {
    return null;
  }
}
