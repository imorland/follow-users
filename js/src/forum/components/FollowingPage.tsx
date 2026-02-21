import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import Placeholder from 'flarum/common/components/Placeholder';
import UserListItem from './UserListItem';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';

export default class FollowingPage extends UserPage {
  loading!: boolean;
  followedUsers!: User[];

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    this.loading = true;
    this.followedUsers = [];

    this.loadUser(m.route.param('username'));
  }

  show(user: User): void {
    super.show(user);

    this.followedUsers = user.followedUsers() || [];
    this.loading = false;

    m.redraw();
  }

  changeUserFollowOptions(user: User): void {
    app.modal.show(() => import('./SelectFollowLevelModal'), { user });
  }

  content(): Mithril.Children {
    if (this.loading) {
      return (
        <div className="DiscussionList">
          <LoadingIndicator />
        </div>
      );
    }

    if (this.followedUsers.length === 0) {
      return (
        <div className="DiscussionList">
          <Placeholder text={app.translator.trans('ianm-follow-users.forum.profile_page.no_following')} />
        </div>
      );
    }

    return (
      <div className="FollowedUserList">
        <ul className="FollowedUserList-users">
          {this.followedUsers.map((user) => {
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
