import UserPage from 'flarum/forum/components/UserPage';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';
export default class ProfilePage extends UserPage {
    loading: boolean;
    followedUsers: User[] | undefined;
    oninit(vnode: Mithril.Vnode): void;
    refresh(): void;
    changeUserFollowOptions(user: User): void;
    content(): Mithril.Children;
    show(): void;
}
