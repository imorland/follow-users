import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import LinkButton from 'flarum/common/components/LinkButton';
import UserPage from 'flarum/forum/components/UserPage';

export default function () {
  extend(UserPage.prototype, 'navItems', function (items) {
    if (!this.user) return;

    const isActor = app.session.user && app.session.user === this.user;

    // "Following" list is only relevant on your own profile (shows follow-level controls)
    if (isActor) {
      items.add(
        'followed-users',
        <LinkButton href={app.route('user.followedUsers', { username: this.user.slug() })} icon="fas fa-user-friends">
          {app.translator.trans('ianm-follow-users.forum.profile_link')}
          <span className="Button-badge">{this.user.followingCount()}</span>
        </LinkButton>
      );
    }

    // "Followers" list is shown on any profile
    items.add(
      'followers',
      <LinkButton href={app.route('user.followers', { username: this.user.slug() })} icon="fas fa-users">
        {app.translator.trans('ianm-follow-users.forum.followers_link')}
        <span className="Button-badge">{this.user.followerCount()}</span>
      </LinkButton>
    );
  });
}
