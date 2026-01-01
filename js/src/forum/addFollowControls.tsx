import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import UserControls from 'flarum/forum/utils/UserControls';
import Button from 'flarum/common/components/Button';
import { SelectFollowUserTypeModal } from './components/SelectFollowLevelModal';
import User from 'flarum/common/models/User';
import UserCard from 'flarum/forum/components/UserCard';
import { findFirstVdomChild } from './util/findVdomChild';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

/**
 * Opens the SelectFollowLevelModal with the provided user.
 */
function openFollowLevelModal(user: User) {
  if (!(user instanceof User)) return;

  app.modal.show(SelectFollowUserTypeModal as any, { user });
}

export default function addFollowControls() {
  // @ts-expect-error - extend typing doesn't handle static method signatures with multiple parameters well
  extend(UserControls, 'userControls', function (items: ItemList<Mithril.Children>, user: any, _isContextControls?: boolean) {
    const typedUser = user as User;
    const followingBlockingUser = !typedUser.canBeFollowed() && typedUser.followed();
    const icon = 'fas fa-user-friends';

    if (followingBlockingUser) {
      items.add(
        'unfollow',
        <Button
          icon={icon}
          onclick={async () => {
            await typedUser.save({ followUsers: null });
            m.redraw();
          }}
        >
          {app.translator.trans('ianm-follow-users.forum.user_controls.unfollow_button')}
        </Button>
      );
    }

    if (
      !app.session.user ||
      app.session.user === typedUser ||
      !typedUser.canBeFollowed() ||
      followingBlockingUser ||
      (app.forum.attribute('ianm-follow-users.button-on-profile') &&
        !(app.current.data.routeName === 'fof_user_directory' && app.forum.attribute('userDirectorySmallCards')))
    ) {
      return;
    }

    items.add(
      'follow',
      <Button icon={icon} onclick={openFollowLevelModal.bind(this, typedUser)}>
        {app.translator.trans(`ianm-follow-users.forum.user_controls.${typedUser.followed() ? 'change_button' : 'follow_button'}`)}
      </Button>
    );
  });

  extend(UserCard.prototype, 'view', function (this: UserCard & { attrs: { user?: User } }, view: Mithril.Vnode) {
    const user = this.attrs.user;
    if (!user) return;
    if (
      !app.forum.attribute('ianm-follow-users.button-on-profile') ||
      !app.session.user ||
      app.session.user === user ||
      !user.canBeFollowed() ||
      (view.attrs as any)?.className?.includes('UserCard--small')
    ) {
      return;
    }

    const followButton = (
      <Button className="Button Button--follow-profile" icon="fas fa-user-friends" onclick={openFollowLevelModal.bind(this, user)}>
        {user.followed()
          ? app.translator.trans(`ianm-follow-users.forum.badge.label.${user.followed()}`)
          : app.translator.trans('ianm-follow-users.forum.user_controls.follow_button')}
      </Button>
    );

    findFirstVdomChild(view, '.UserCard-profile', (vdom) => {
      if (Array.isArray(vdom.children)) {
        vdom.children.splice(2, 0, followButton);
      }
    });
  });
}
