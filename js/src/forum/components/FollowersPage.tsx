import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import Placeholder from 'flarum/common/components/Placeholder';
import UserListItem from './UserListItem';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';

export default class FollowersPage extends UserPage {
  loading!: boolean;
  followers!: User[];

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    this.loading = true;
    this.followers = [];

    this.loadUser(m.route.param('username'));
  }

  show(user: User): void {
    super.show(user);

    this.followers = user.followedBy() || [];
    this.loading = false;

    m.redraw();
  }

  content(): Mithril.Children {
    if (this.loading) {
      return (
        <div className="DiscussionList">
          <LoadingIndicator />
        </div>
      );
    }

    if (this.followers.length === 0) {
      return (
        <div className="DiscussionList">
          <Placeholder text={app.translator.trans('ianm-follow-users.forum.profile_page.no_followers')} />
        </div>
      );
    }

    return (
      <div className="FollowedUserList">
        <ul className="FollowedUserList-users">
          {this.followers.map((user) => {
            return (
              <li key={user.id()} data-id={user.id()}>
                <UserListItem user={user} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
