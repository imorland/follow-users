import app from 'flarum/common/app';
import { BooleanGambit } from 'flarum/common/query/IGambit';

export default class FollowedUsersGambit extends BooleanGambit {
  key() {
    return app.translator.trans('ianm-follow-users.lib.gambits.followeduser.key', {}, true);
  }

  filterKey() {
    return 'followeduser';
  }
}
