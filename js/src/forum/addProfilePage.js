import { extend } from 'flarum/extend';
import app from 'flarum/app';
import LinkButton from 'flarum/components/LinkButton';
import UserPage from 'flarum/components/UserPage';

export default function () {
    extend(UserPage.prototype, 'navItems', function (items) {
        if (app.session.user && app.session.user === this.user)
            items.add(
                'followed-users',
                LinkButton.component(
                    {
                        href: app.route('followedUsers'),
                        icon: 'fas fa-user-friends',
                    },
                    app.translator.trans('ianm-follow-users.forum.profile_link')
                )
            );
    });
}
