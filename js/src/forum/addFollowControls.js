import { extend } from 'flarum/common/extend';
import UserControls from 'flarum/common/utils/UserControls';
import Button from 'flarum/common/components/Button';

export default () => {
    extend(UserControls, 'userControls', function (items, user) {
        if (!app.session.user || app.session.user === user) {
            return;
        }

        function unfollow() {
            if (confirm(app.translator.trans(`ianm-follow-users.forum.user_controls.unfollow_confirmation`))) {
                this.save({ followed: false });
            }
        }

        function follow() {
            if (confirm(app.translator.trans(`ianm-follow-users.forum.user_controls.follow_confirmation`))) {
                this.save({ followed: true });
            }
        }

        if (user.followed()) {
            items.add(
                'unfollow',
                <Button icon="fas fa-user-slash" onclick={unfollow.bind(user)}>
                    {app.translator.trans('ianm-follow-users.forum.user_controls.unfollow_button')}
                </Button>
            );
        } else if (user.canBeFollowed()) {
            items.add(
                'follow',
                <Button icon="fas fa-user-friends" onclick={follow.bind(user)}>
                    {app.translator.trans('ianm-follow-users.forum.user_controls.follow_button')}
                </Button>
            );
        }
    });
};
