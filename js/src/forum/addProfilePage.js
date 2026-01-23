import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import LinkButton from 'flarum/common/components/LinkButton';
import UserPage from 'flarum/forum/components/UserPage';

export default function () {
  extend(UserPage.prototype, 'navItems', function (items) {
    if (app.session.user && app.session.user === this.user) {
      const followedUsersCount = this.user.followingCount();
      const followersCount = this.user.followerCount();

      items.add(
        'followed-users',
        <LinkButton href={app.route('user.followedUsers', { username: this.user.slug() })} icon="fas fa-user-friends">
          {app.translator.trans('ianm-follow-users.forum.profile_link')}
          <span className="Button-badge">{followedUsersCount}</span>
        </LinkButton>
      );

      items.add(
        'followers',
        <LinkButton href={app.route('user.followers', { username: this.user.slug() })} icon="fas fa-users">
          {app.translator.trans('ianm-follow-users.forum.profile_page.followers_link')}
          <span className="Button-badge">{followersCount}</span>
        </LinkButton>
      );
    }
  });
}
