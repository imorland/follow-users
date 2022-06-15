import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import UserControls from 'flarum/forum/utils/UserControls';
import Button from 'flarum/common/components/Button';
import { SelectFollowUserTypeModal } from './components/SelectFollowLevelModal';
import User from 'flarum/common/models/User';
import UserCard from 'flarum/forum/components/UserCard';
import { findFirstVdomChild } from './util/findVdomChild';

export default function addFollowControls() {
  extend(UserControls, 'userControls', function (items, user) {
    if (!app.session.user || app.session.user === user || !user.canBeFollowed() || app.forum.attribute('ianm-follow-users.button-on-profile')) {
      return;
    }

    /**
     * Opens the SelectFollowLevelModal with the provided user.
     *
     * @param {User} user
     */
    function openFollowLevelModal(user) {
      if (!(user instanceof User)) return;

      app.modal.show(SelectFollowUserTypeModal, { user });
    }

    items.add(
      'follow',
      <Button icon="fas fa-user-friends" onclick={openFollowLevelModal.bind(this, user)}>
        {app.translator.trans(`ianm-follow-users.forum.user_controls.${user.followed() ? 'unfollow_button' : 'follow_button'}`)}
      </Button>
    );
  });

  extend(UserCard.prototype, 'view', function (view) {
    const user = this.attrs.user;
    if (!app.forum.attribute('ianm-follow-users.button-on-profile') || !app.session.user || app.session.user === user || !user.canBeFollowed()) {
      return;
    }

    /**
     * Opens the SelectFollowLevelModal with the provided user.
     *
     * @param {User} user
     */
    function openFollowLevelModal(user) {
      if (!(user instanceof User)) return;

      app.modal.show(SelectFollowUserTypeModal, { user });
    }

    const followButton = (
      <Button className="Button" icon="fas fa-user-friends" onclick={openFollowLevelModal.bind(this, user)}>
        {app.translator.trans(`ianm-follow-users.forum.user_controls.${user.followed() ? 'unfollow_button' : 'follow_button'}`)}
      </Button>
    );

    findFirstVdomChild(view, '.UserCard-profile', (vdom) => {
      vdom.children.splice(2, 0, followButton);
    });
  });
}
