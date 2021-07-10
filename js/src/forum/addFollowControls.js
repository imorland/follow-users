import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import UserControls from 'flarum/common/utils/UserControls';
import Button from 'flarum/common/components/Button';
import { SelectFollowUserTypeModal } from './components/SelectFollowLevelModal';
import User from 'flarum/common/models/User';

export default () => {
    extend(UserControls, 'userControls', function (items, user) {
        if (!app.session.user || app.session.user === user) {
            return;
        }

        /**
         * Opens the SelectFollowLevelModal with the provided user.
         *
         * @param {User} user
         */
        function openFollowLevelModal(user) {
            if (!(user instanceof User)) return;

            // if (confirm(app.translator.trans(`ianm-follow-users.forum.user_controls.unfollow_confirmation`))) {
            //     user.save({ followed: false });
            // }

            app.modal.show(SelectFollowUserTypeModal, { user });
        }

        if (user.followed()) {
            items.add(
                'unfollow',
                <Button icon="fas fa-user-slash" onclick={openFollowLevelModal.bind(this, user)}>
                    {app.translator.trans('ianm-follow-users.forum.user_controls.unfollow_button')}
                </Button>
            );
        } else if (user.canBeFollowed()) {
            items.add(
                'follow',
                <Button icon="fas fa-user-friends" onclick={openFollowLevelModal.bind(this, user)}>
                    {app.translator.trans('ianm-follow-users.forum.user_controls.follow_button')}
                </Button>
            );
        }
    });
};
