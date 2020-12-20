import { extend } from 'flarum/extend';
import * as follow_tags from '@fof-follow-tags';
import DiscussionListState from 'flarum/states/DiscussionListState';
import followingPageOptions from '../common/helpers/followingPageOptions';

export default function () {
    if (app.initializers.has('fof/follow-tags')) {
        // Replace the original function with our customized version
        follow_tags.utils.followingPageOptions = followingPageOptions;
        // Execute the customized helper to cache the returned list of options
        follow_tags.utils.followingPageOptions('forum.index.following');

        extend(DiscussionListState.prototype, 'requestParams', function (params) {
            if (!follow_tags.utils.isFollowingPage() || !app.session.user) return;

            let q = params.filter.q || '';

            if (!this.followTags) {
                this.followTags = follow_tags.utils.getDefaultFollowingFiltering();
            }
            const followTags = this.followTags;

            if (app.current.get('routeName') === 'following' && followTags) {
                if (followTags === 'users') {
                    q += ' is:following-users';
                    q = q.replace(' is:following', '');
                }

                params.filter.q = q;
            }
        });
    }
}
