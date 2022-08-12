import Component from 'flarum/common/Component';
import UserCard from 'flarum/forum/components/UserCard';

export default class FollowedUserListItem extends Component {
  view() {
    const { user } = this.attrs;

    return (
      <div className="User">
        <UserCard user={user} className="UserCard--follow-list" controlsButtonClassName="Button Button--icon Button--flat" />
      </div>
    );
  }
}
