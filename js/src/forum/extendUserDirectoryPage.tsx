import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Separator from 'flarum/common/components/Separator';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export default function () {
  extend('ext:fof/user-directory/forum/components/UserDirectoryPage', 'oninit', function (this: any) {
    const q = m.route.param('q') || '';
    if (q.includes('is:followeduser')) {
      if (!this.enabledSpecialGroupFilters) this.enabledSpecialGroupFilters = {};
      this.enabledSpecialGroupFilters['ianm-follow-users'] = 'is:followeduser';
    }
  });

  extend('ext:fof/user-directory/forum/components/UserDirectoryPage', 'groupItems', function (this: any, items: ItemList<Mithril.Children>) {
    // Get CheckableButton from Flarum's registry (it's in the same lazy-loaded chunk)
    const CheckableButton = flarum.reg.get('fof-user-directory', 'forum/components/CheckableButton');

    items.add(
      'follow-users',
      <CheckableButton
        className="GroupFilterButton"
        icon="fas fa-user-friends"
        checked={this.enabledSpecialGroupFilters?.['ianm-follow-users'] === 'is:followeduser'}
        onclick={() => {
          const id = 'ianm-follow-users';
          if (!this.enabledSpecialGroupFilters) this.enabledSpecialGroupFilters = {};
          if (this.enabledSpecialGroupFilters[id] === 'is:followeduser') {
            this.enabledSpecialGroupFilters[id] = '';
          } else {
            this.enabledSpecialGroupFilters[id] = 'is:followeduser';
          }

          this.changeParams(this.params().sort);
        }}
      >
        {app.translator.trans('ianm-follow-users.forum.filter.following')}
      </CheckableButton>,
      65
    );

    items.add('separator', <Separator />, 50);
  });
}
