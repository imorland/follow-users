import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import { utils } from 'ext:fof/follow-tags/forum/utils';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import followingPageOptions from '../common/helpers/followingPageOptions';
import Separator from 'flarum/common/components/Separator';
import UserDirectoryPage from 'ext:fof/user-directory/forum/components/UserDirectoryPage';
import CheckableButton from 'ext:fof/user-directory/forum/components/CheckableButton';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export default function () {
  if ('fof-follow-tags' in flarum.extensions) {
    // Replace the original function with our customized version
    utils.followingPageOptions = followingPageOptions;
    // Execute the customized helper to cache the returned list of options
    utils.followingPageOptions('forum.index.following');

    extend(
      DiscussionListState.prototype,
      'requestParams',
      function (this: DiscussionListState & { followTags?: string | {} }, params: Record<string, any>) {
        if (!utils.isFollowingPage() || !app.session.user) return;

        if (!this.followTags) {
          this.followTags = utils.getDefaultFollowingFiltering();
        }

        const followTags = this.followTags;

        if (app.current.get('routeName') === 'following' && followTags === 'users') {
          params.filter['following-users'] = true;

          delete params.filter.subscription;
        }
      }
    );
  }

  if ('fof-user-directory' in flarum.extensions) {
    extend(
      UserDirectoryPage.prototype,
      'groupItems',
      function (this: UserDirectoryPage & { enabledSpecialGroupFilters?: Record<string, string> }, items: ItemList<Mithril.Children>) {
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
