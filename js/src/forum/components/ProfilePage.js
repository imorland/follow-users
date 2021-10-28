import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import UserPage from 'flarum/forum/components/UserPage';
import { SelectFollowUserTypeModal } from './SelectFollowLevelModal';

export default class ProfilePage extends UserPage {
  oninit(vnode) {
    super.oninit(vnode);

    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.followedUsers = app.session.user.followedUsers();
    this.loadUser(app.session.user.username());
  }

  changeUserFollowOptions(user) {
    app.modal.show(SelectFollowUserTypeModal, { user });
  }

  content() {
    if (this.followedUsers.length === 0) {
      return (
        <div class="Placeholder">
          <p>{app.translator.trans('ianm-follow-users.forum.profile_page.no_following')}</p>
        </div>
      );
    }

    return (
      <table className="NotificationGrid followPage-grid">
        {this.followedUsers.map((user, i) => {
          return (
            <tr class="followPage-user">
              <td>
                <Link href={app.route.user(user)}>
                  <h3>
                    {avatar(user, { className: 'followPage-avatar' })}
                    <div class="followPage-userInfo">
                      {username(user)}

                      <span class="followPage-type">{app.translator.trans(`ianm-follow-users.forum.badge.label.${user.followed()}`)}</span>
                    </div>
                  </h3>
                </Link>
              </td>

              <td className="followPage-button">
                <Button
                  icon="fas fa-user-friends"
                  type="button"
                  className="Button Button--warning"
                  onclick={() => this.changeUserFollowOptions(user)}
                >
                  {app.translator.trans('ianm-follow-users.forum.user_controls.unfollow_button')}
                </Button>
              </td>
            </tr>
          );
        })}
      </table>
    );
  }

  show() {
    this.user = app.session.user;

    m.redraw();
  }
}
