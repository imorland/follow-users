import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import Placeholder from 'flarum/common/components/Placeholder';
import FollowedUserListItem from './FollowedUserListItem';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';

export default class ProfilePage extends UserPage {
  loading!: boolean;
  followedUsers!: User[] | undefined;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.loadUser(app.session.user!.username());
    this.followedUsers = app.session.user?.followedUsers();

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

    if (!this.followedUsers || this.followedUsers.length === 0) {
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
                <FollowedUserListItem user={user} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  show(): void {
    this.user = app.session.user;

    m.redraw();
  }
}
