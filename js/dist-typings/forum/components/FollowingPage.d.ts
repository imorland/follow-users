import UserPage from 'flarum/forum/components/UserPage';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';
export default class FollowingPage extends UserPage {
    loading: boolean;
    followedUsers: User[];
    oninit(vnode: Mithril.Vnode): void;
    show(user: User): void;
    changeUserFollowOptions(user: User): void;
    content(): Mithril.Children;
}
