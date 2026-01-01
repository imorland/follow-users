import Component from 'flarum/common/Component';
import UserCard from 'flarum/forum/components/UserCard';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';

interface FollowedUserListItemAttrs {
  user: User;
}

export default class FollowedUserListItem extends Component<FollowedUserListItemAttrs> {
  view(): Mithril.Children {
    const { user } = this.attrs;

    return (
      <div className="User">
        <UserCard user={user} className="UserCard--follow-list" controlsButtonClassName="Button Button--icon Button--flat" />
      </div>
    );
  }
}
