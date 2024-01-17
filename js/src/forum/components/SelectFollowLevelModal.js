import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import User from 'flarum/common/models/User';
import Button from 'flarum/common/components/Button';
import Select from 'flarum/common/components/Select';
import { FollowLevels } from '../../common/FollowLevels';

export class SelectFollowUserTypeModal extends Modal {
  state = {
    /**
     * User being followed
     *
     * @type User | null
     */
    user: null,

    /**
     * Is the modal currently saving?
     *
     * @type boolean
     */
    saving: false,

    /**
     * Currently selected follow level.
     *
     * @type "lurk" | "follow" | "unfollow"
     * @example "lurk"
     */
    followState: undefined,
  };

  oninit(vnode) {
    super.oninit(vnode);

    this.state.user = this.attrs.user;

    this.state.followState = this.state.user.followed() || 'unfollow';
  }

  className = () => 'iam_follow_users-selectFollowLevelModal';

  title() {
    return this.trans('title', { username: <em>{this.state.user?.displayName?.()}</em> });
  }

  content() {
    // If `this.user` isn't a valid User, exit quickly to prevent complete forum errors.
    if (!(this.state.user instanceof User)) {
      // Show a more detailed error if this happens when the forum is in debug mode.
      return (
        <div class="Modal-body">
          <p>{this.trans(`no_user_attr_provided_err${app.forum.attribute('debug') ? '_debug' : ''}`)}</p>
        </div>
      );
    }

    const user = this.state.user;

    const availableLevelOptions = FollowLevels.reduce((acc, curr) => ({ ...acc, [curr.value]: curr.name() }), {});
    const selectedLevel = FollowLevels.find((l) => l.value === this.state.followState);

    return (
      <div class="Modal-body">
        <fieldset>
          <legend>{this.trans('description', { user })}</legend>

          <div class="selectFollowLevelModal-level">
            <label for="selectFollowLevelModal-select">{this.trans('follow_select_label')}</label>

            <Select
              disabled={this.state.saving}
              id="selectFollowLevelModal-select"
              onchange={this.onFollowLevelChange.bind(this)}
              // Dynamic attrs that change based on the input
              value={selectedLevel.value}
              aria-described-by={`selectFollowLevelModal-${selectedLevel.value}-help`}
              options={availableLevelOptions}
            />

            {/* Helper text to describe the selected follow level */}
            <p id={`selectFollowLevelModal-${selectedLevel.value}-help`}>{selectedLevel.description({ user })}</p>
          </div>
        </fieldset>
        <fieldset class="selectFollowLevelModal-actions">
          <Button disabled={this.state.saving} class="Button" onclick={this.hide.bind(this)}>
            {this.trans('cancel_btn')}
          </Button>
          <Button disabled={this.state.saving} class="Button Button--primary" onclick={this.saveFollowLevel.bind(this)} loading={this.state.saving}>
            {this.trans('save_btn')}
          </Button>
        </fieldset>
      </div>
    );
  }

  /**
   * Handles a change on the <select> element and saves the new value to a class property.
   */
  onFollowLevelChange() {
    /**
     * @type HTMLInputElement
     */
    const selectElement = this.$('.Select-input')[0];

    this.state.followState = selectElement.value || 'unfollow';
  }

  /**
   * Helper for app.translator.trans, already including the initial keys up to `modals.select_follow_level`.
   */
  trans(key, ...opts) {
    return app.translator.trans(`ianm-follow-users.forum.modals.select_follow_level.${key}`, ...opts);
  }

  onsubmit() {
    this.saveFollowLevel();
  }

  /**
   * Sends the new follow state to the
   */
  async saveFollowLevel() {
    const newFollowState = this.state.followState === 'unfollow' ? null : this.state.followState;

    this.state.saving = true;

    // Exit early if level not changed
    if (this.state.user.attribute('following') === newFollowState) {
      this.hide();
      return;
    }

    const x = await this.state.user.save({ followUsers: newFollowState });

    this.hide();
  }
}
