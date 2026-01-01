import app from 'flarum/forum/app';
import Notification from 'flarum/forum/components/Notification';
import type Mithril from 'mithril';

export default class NewFollowerNotification extends Notification {
  icon(): string {
    return 'fas fa-user-plus';
  }

  href(): string {
    const notification = this.attrs.notification;
    const user = notification.subject();

    return app.route.user(user as any);
  }

  content(): Mithril.Children {
    return app.translator.trans('ianm-follow-users.forum.notifications.new_follower_text', {
      user: this.attrs.notification.fromUser(),
    });
  }

  excerpt(): null {
    return null;
  }
}
