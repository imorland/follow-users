import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import Separator from 'flarum/common/components/Separator';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import UserDirectoryPage from 'ext:fof/user-directory/forum/components/UserDirectoryPage';
import CheckableButton from 'ext:fof/user-directory/forum/components/CheckableButton';
import addFollowingPageOption from 'ext:fof/follow-tags/common/utils/addFollowingPageOption';
import { getDefaultFollowingFiltering } from 'ext:fof/follow-tags/forum/utils/getDefaultFollowingFiltering';

export default function () {
  // Register our "users" option with fof-follow-tags
  addFollowingPageOption(() => ({
    users: app.translator.trans('ianm-follow-users.lib.following_link'),
  }));

  extend(
    DiscussionListState.prototype,
    'requestParams',
    function (this: DiscussionListState & { followTags?: string | {} }, params: Record<string, any>) {
      // Check if we're on the following page (inline to avoid import issues)
      const isFollowingPage = 'flarum-subscriptions' in flarum.extensions && m.route.get().includes(app.route('following'));

      if (!isFollowingPage || !app.session.user) return;

      if (!this.followTags) {
        this.followTags = getDefaultFollowingFiltering();
      }

      const followTags = this.followTags;

      if (app.current.get('routeName') === 'following' && followTags === 'users') {
        params.filter['following-users'] = true;

        delete params.filter.subscription;
      }
    }
  );

  if ('fof-user-directory' in flarum.extensions) {
    // Initialize the filter state from URL parameters
    extend(UserDirectoryPage.prototype, 'oninit', function (this: any) {
      const q = m.route.param('q') || '';
      if (q.includes('is:followeduser')) {
        if (!this.enabledSpecialGroupFilters) this.enabledSpecialGroupFilters = {};
        this.enabledSpecialGroupFilters['ianm-follow-users'] = 'is:followeduser';
      }
    });

    extend(
      UserDirectoryPage.prototype,
      'groupItems',
      function (
        this: typeof UserDirectoryPage.prototype & { enabledSpecialGroupFilters?: Record<string, string> },
        items: ItemList<Mithril.Children>
      ) {
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
      }
    );
  }
}
