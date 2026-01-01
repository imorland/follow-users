import app from 'flarum/forum/app';
import Notification from 'flarum/forum/components/Notification';
import type Mithril from 'mithril';

export default class NewDiscussionNotification extends Notification {
  icon(): string {
    return 'fas fa-user-friends';
  }

  href(): string {
    const notification = this.attrs.notification;
    const discussion = notification.subject();

    return app.route.discussion(discussion as any);
  }

  content(): Mithril.Children {
    const subject = this.attrs.notification.subject();
    return app.translator.trans('ianm-follow-users.forum.notifications.new_discussion_text', {
      user: this.attrs.notification.fromUser(),
      title: subject && typeof (subject as any).title === 'function' ? (subject as any).title() : '',
    });
  }

  excerpt(): null {
    return null;
  }
}
