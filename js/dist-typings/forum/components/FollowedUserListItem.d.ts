import Component from 'flarum/common/Component';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';
interface FollowedUserListItemAttrs {
    user: User;
}
export default class FollowedUserListItem extends Component<FollowedUserListItemAttrs> {
    view(): Mithril.Children;
}
export {};
