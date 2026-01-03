import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
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
}
