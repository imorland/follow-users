import app from 'flarum/forum/app';
import Notification from 'flarum/forum/components/Notification';

export default class NewDiscussionNotification extends Notification {
  icon() {
    return 'fas fa-user-friends';
  }

  href() {
    const notification = this.attrs.notification;
    const discussion = notification.subject();

    return app.route.discussion(discussion);
  }

  content() {
    return app.translator.trans('ianm-follow-users.forum.notifications.new_discussion_text', {
      user: this.attrs.notification.fromUser(),
      title: this.attrs.notification.subject().title(),
    });
  }

  excerpt() {
    return null;
  }
}
