import app from 'flarum/forum/app';
import Notification from 'flarum/forum/components/Notification';
import type Mithril from 'mithril';

export default class NewUnfollowerNotification extends Notification {
  icon(): string {
    return 'fas fa-user-minus';
  }

  href(): string {
    const notification = this.attrs.notification;
    const user = notification.subject();

    return app.route.user(user as any);
  }

  content(): Mithril.Children {
    return app.translator.trans('ianm-follow-users.forum.notifications.new_unfollower_text', {
      user: this.attrs.notification.fromUser(),
    });
  }

  excerpt(): null {
    return null;
  }
}
