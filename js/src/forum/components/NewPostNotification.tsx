import app from 'flarum/forum/app';
import Notification from 'flarum/forum/components/Notification';
import type Mithril from 'mithril';

export default class NewPostNotification extends Notification {
  icon(): string {
    return 'fas fa-user-friends';
  }

  href(): string {
    const notification = this.attrs.notification;
    const discussion = notification.subject();
    const content = notification.content() || {};

    return app.route.discussion(discussion as any, (content as any).postNumber);
  }

  content(): Mithril.Children {
    return app.translator.trans('ianm-follow-users.forum.notifications.new_post_text', {
      user: this.attrs.notification.fromUser(),
    });
  }

  excerpt(): null {
    return null;
  }
}
