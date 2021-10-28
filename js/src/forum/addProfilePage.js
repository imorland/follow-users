import { extend } from 'flarum/common/extend';
import app from 'flarum/common/app';
import LinkButton from 'flarum/common/components/LinkButton';
import UserPage from 'flarum/common/components/UserPage';

export default function () {
  extend(UserPage.prototype, 'navItems', function (items) {
    if (app.session.user && app.session.user === this.user)
      items.add(
        'followed-users',
        <LinkButton href={app.route('followedUsers')} icon="fas fa-user-friends">
          {app.translator.trans('ianm-follow-users.forum.profile_link')}
        </LinkButton>
      );
  });
}
