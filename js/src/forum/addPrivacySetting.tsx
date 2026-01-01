import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Switch from 'flarum/common/components/Switch';

export default function () {
  extend('flarum/forum/components/SettingsPage', 'privacyItems', function (items) {
    items.add(
      'follow-users-block',
      <Switch
        state={this.user.preferences().blocksFollow}
        onchange={(value: boolean) => {
          this.blocksFollowLoading = true;

          this.user.savePreferences({ blocksFollow: value }).then(() => {
            this.blocksFollowLoading = false;
            m.redraw();
          });
        }}
        loading={this.blocksFollowLoading}
      >
        {app.translator.trans('ianm-follow-users.forum.settings.block_follow')}
      </Switch>
    );
  });
}
