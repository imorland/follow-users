import Component from 'flarum/common/Component';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';
interface UserListItemAttrs {
    user: User;
}
export default class UserListItem extends Component<UserListItemAttrs> {
    view(): Mithril.Children;
}
export {};
