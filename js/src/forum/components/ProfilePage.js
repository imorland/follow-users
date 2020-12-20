import avatar from 'flarum/helpers/avatar';
import Button from 'flarum/components/Button';
import username from 'flarum/helpers/username';
import UserPage from 'flarum/components/UserPage';
import Stream from 'flarum/utils/Stream';

export default class ProfilePage extends UserPage {
    oninit(vnode) {
        super.oninit(vnode);

        this.loading = true;

        this.followedUsers = app.session.user.followedUsers();

        this.loadUser(app.session.user.username());
    }

    content() {
        return (
            <table className="NotificationGrid">
                {this.followedUsers.map((user, i) => {
                    var unfollow = () => {
                        if (confirm(app.translator.trans(`ianm-follow-users.forum.user_controls.unfollow_confirmation`))) {
                            user.save({ followed: false });
                            this.followedUsers.splice(i, 1);
                            app.session.user.followedUsers = Stream(this.followedUsers);
                        }
                    };

                    return (
                        <tr>
                            <td>
                                <a href={app.route.user(user)} config={m.route}>
                                    <h3>
                                        {avatar(user, { className: 'followPage-avatar' })} {username(user)}
                                    </h3>
                                </a>
                            </td>
                            <td className="followPage-button">
                                {Button.component(
                                    {
                                        icon: 'fas fa-comment-slash',
                                        type: 'button',
                                        className: 'Button Button--warning',
                                        onclick: unfollow.bind(user),
                                    },
                                    app.translator.trans('ianm-follow-users.forum.user_controls.unfollow_button')
                                )}
                            </td>
                        </tr>
                    );
                })}
            </table>
        );
    }

    show(user) {
        this.user = app.session.user;

        m.redraw();
    }
}
