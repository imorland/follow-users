import UserPage from 'flarum/forum/components/UserPage';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';
export default class FollowersPage extends UserPage {
    loading: boolean;
    followers: User[];
    oninit(vnode: Mithril.Vnode): void;
    show(user: User): void;
    content(): Mithril.Children;
}
