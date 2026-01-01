import Notification from 'flarum/forum/components/Notification';
import type Mithril from 'mithril';
export default class NewDiscussionNotification extends Notification {
    icon(): string;
    href(): string;
    content(): Mithril.Children;
    excerpt(): null;
}
