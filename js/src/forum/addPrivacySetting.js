import { extend } from 'flarum/extend';
import SettingsPage from 'flarum/components/SettingsPage';
import Switch from 'flarum/components/Switch';

export default function () {
    extend(SettingsPage.prototype, 'privacyItems', function (items) {
        items.add(
            'follow-users-block',
            Switch.component(
                {
                    state: this.user.preferences().blocksFollow,
                    onchange: (value) => {
                        this.blocksFollowLoading = true;

                        this.user.savePreferences({ blocksFollow: value }).then(() => {
                            this.blocksFollowLoading = false;
                            m.redraw();
                        });
                    },
                    loading: this.blocksFollowLoading,
                },
                app.translator.trans('ianm-follow-users.forum.settings.block_follow')
            )
        );
    });
}
