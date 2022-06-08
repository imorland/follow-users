import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import * as follow_tags from '@fof-follow-tags';
import * as user_directory from '@fof-user-directory';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import followingPageOptions from '../common/helpers/followingPageOptions';
import Separator from 'flarum/common/components/Separator';

export default function () {
  if (app.initializers.has('fof/follow-tags')) {
    // Replace the original function with our customized version
    follow_tags.utils.followingPageOptions = followingPageOptions;
    // Execute the customized helper to cache the returned list of options
    follow_tags.utils.followingPageOptions('forum.index.following');

    extend(DiscussionListState.prototype, 'requestParams', function (params) {
      if (!follow_tags.utils.isFollowingPage() || !app.session.user) return;

      if (!this.followTags) {
        this.followTags = follow_tags.utils.getDefaultFollowingFiltering();
      }

      const followTags = this.followTags;

      if (app.current.get('routeName') === 'following' && followTags === 'users') {
        params.filter['following-users'] = true;

        delete params.filter.subscription;
      }
    });
  }

  if (app.initializers.has('fof-user-directory')) {
    extend(user_directory.UserDirectoryPage.prototype, 'groupItems', function (items) {
      items.add(
        'follow-users',
        user_directory.CheckableButton.component(
          {
            className: 'GroupFilterButton',
            icon: 'fas fa-user-friends',
            checked: this.enabledSpecialGroupFilters['ianm-follow-users'] === 'is:followeduser',
            onclick: () => {
              const id = 'ianm-follow-users';
              if (this.enabledSpecialGroupFilters[id] === 'is:followeduser') {
                this.enabledSpecialGroupFilters[id] = '';
              } else {
                this.enabledSpecialGroupFilters[id] = 'is:followeduser';
              }

              this.changeParams(this.params().sort);
            },
          },
          app.translator.trans('ianm-follow-users.forum.filter.following')
        ),
        65
      );

      items.add('separator', <Separator />, 50);
    });
  }
}
