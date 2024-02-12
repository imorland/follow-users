import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import UserControls from 'flarum/forum/utils/UserControls';
import Button from 'flarum/common/components/Button';
import { SelectFollowUserTypeModal } from './components/SelectFollowLevelModal';
import User from 'flarum/common/models/User';
import UserCard from 'flarum/forum/components/UserCard';
import { findFirstVdomChild } from './util/findVdomChild';

/**
 * Opens the SelectFollowLevelModal with the provided user.
 *
 * @param {User} user
 */
function openFollowLevelModal(user) {
  if (!(user instanceof User)) return;

  app.modal.show(SelectFollowUserTypeModal, { user });
}

export default function addFollowControls() {
  extend(UserControls, 'userControls', function (items, user) {
    const followingBlockingUser = !user.canBeFollowed() && user.followed();
    const icon = 'fas fa-user-friends';

    if (followingBlockingUser) {
      items.add(
        'unfollow',
        <Button
          icon={icon}
          onclick={async () => {
            const x = await user.save({ followUsers: null });
            m.redraw();
          }}
        >
          {app.translator.trans('ianm-follow-users.forum.user_controls.unfollow_button')}
        </Button>
      );
    }

    if (
      !app.session.user ||
      app.session.user === user ||
      !user.canBeFollowed() ||
      followingBlockingUser ||
      (app.forum.attribute('ianm-follow-users.button-on-profile') &&
        !(app.current.data.routeName === 'fof_user_directory' && app.forum.attribute('userDirectorySmallCards')))
    ) {
      return;
    }

    items.add(
      'follow',
      <Button icon={icon} onclick={openFollowLevelModal.bind(this, user)}>
        {app.translator.trans(`ianm-follow-users.forum.user_controls.${user.followed() ? 'change_button' : 'follow_button'}`)}
      </Button>
    );
  });

  extend(UserCard.prototype, 'view', function (view) {
    const user = this.attrs.user;
    if (
      !app.forum.attribute('ianm-follow-users.button-on-profile') ||
      !app.session.user ||
      app.session.user === user ||
      !user.canBeFollowed() ||
      view.attrs.className.includes('UserCard--small')
    ) {
      return;
    }

    const followButton = (
      <Button className="Button" icon="fas fa-user-friends" onclick={openFollowLevelModal.bind(this, user)}>
        {user.followed()
          ? app.translator.trans(`ianm-follow-users.forum.badge.label.${user.followed()}`)
          : app.translator.trans('ianm-follow-users.forum.user_controls.follow_button')}
      </Button>
    );

    findFirstVdomChild(view, '.UserCard-profile', (vdom) => {
      vdom.children.splice(2, 0, followButton);
    });
  });
}
