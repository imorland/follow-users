import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import UserControls from 'flarum/forum/utils/UserControls';
import Button from 'flarum/common/components/Button';
import { SelectFollowUserTypeModal } from './components/SelectFollowLevelModal';
import User from 'flarum/common/models/User';
import UserCard from 'flarum/forum/components/UserCard';
import Link from 'flarum/common/components/Link';
import AvatarEditor from 'flarum/forum/components/AvatarEditor';
import username from 'flarum/common/helpers/username';
import avatar from 'flarum/common/helpers/avatar';
import listItems from 'flarum/common/helpers/listItems';
import Dropdown from 'flarum/common/components/Dropdown';

export default function addFollowControls() {
  extend(UserControls, 'userControls', function (items, user) {
    if (!app.session.user || app.session.user === user || !user.canBeFollowed()) {
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

  override(UserCard.prototype, 'view', function (original) {
    if (!app.forum.attribute('ianm-follow-users.button-on-profile')) {
      return original();
    }

    const user = this.attrs.user;
    const controls = UserControls.controls(user, this).toArray();
    const color = user.color();
    const badges = user.badges().toArray();

    /**
     * Opens the SelectFollowLevelModal with the provided user.
     *
     * @param {User} user
     */
    function openFollowLevelModal(user) {
      if (!(user instanceof User)) return;

      app.modal.show(SelectFollowUserTypeModal, { user });
    }

    return (
      <div className={'UserCard ' + (this.attrs.className || '')} style={color && { '--usercard-bg': color }}>
        <div className="darkenBackground">
          <div className="container">
            {controls.length
              ? Dropdown.component(
                  {
                    className: 'UserCard-controls App-primaryControl',
                    menuClassName: 'Dropdown-menu--right',
                    buttonClassName: this.attrs.controlsButtonClassName,
                    label: app.translator.trans('core.forum.user_controls.button'),
                    accessibleToggleLabel: app.translator.trans('core.forum.user_controls.toggle_dropdown_accessible_label'),
                    icon: 'fas fa-ellipsis-v',
                  },
                  controls
                )
              : ''}

            <div className="UserCard-profile">
              <h2 className="UserCard-identity">
                {this.attrs.editable ? (
                  [AvatarEditor.component({ user, className: 'UserCard-avatar' }), username(user)]
                ) : (
                  <Link href={app.route.user(user)}>
                    <div className="UserCard-avatar">{avatar(user)}</div>
                    {username(user)}
                  </Link>
                )}
              </h2>

              {badges.length ? <ul className="UserCard-badges badges">{listItems(badges)}</ul> : ''}

              {user.canBeFollowed() && (
                <Button className="Button" icon="fas fa-user-friends" onclick={openFollowLevelModal.bind(this, user)}>
                  {app.translator.trans(`ianm-follow-users.forum.user_controls.${user.followed() ? 'unfollow_button' : 'follow_button'}`)}
                </Button>
              )}

              <ul className="UserCard-info">{listItems(this.infoItems().toArray())}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  });
}
