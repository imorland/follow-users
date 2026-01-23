import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import Placeholder from 'flarum/common/components/Placeholder';
import UserListItem from './UserListItem';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

export default class FollowersPage extends UserPage {
  oninit(vnode) {
    super.oninit(vnode);

    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.loadUser(app.session.user.username());
    this.followers = app.session.user.followedBy() || [];

    this.loading = false;
    m.redraw();
  }

  content() {
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

  show() {
    this.user = app.session.user;

    m.redraw();
  }
}
