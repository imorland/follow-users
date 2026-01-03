import app from 'flarum/forum/app';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import User from 'flarum/common/models/User';
import Button from 'flarum/common/components/Button';
import Select from 'flarum/common/components/Select';
import { FollowLevels } from '../../common/FollowLevels';
import type Mithril from 'mithril';

interface SelectFollowLevelModalAttrs extends IFormModalAttrs {
  user: User;
}

interface SelectFollowLevelModalState {
  user: User | null;
  saving: boolean;
  followState: 'lurk' | 'follow' | 'unfollow' | undefined;
}

export default class SelectFollowLevelModal extends FormModal<SelectFollowLevelModalAttrs> {
  followState: SelectFollowLevelModalState = {
    /**
     * User being followed
     */
    user: null,

    /**
     * Is the modal currently saving?
     */
    saving: false,

    /**
     * Currently selected follow level.
     *
     * @example "lurk"
     */
    followState: undefined,
  };

  oninit(vnode: Mithril.Vnode<SelectFollowLevelModalAttrs, this>) {
    super.oninit(vnode);

    this.followState.user = this.attrs.user;

    const followedStatus = this.followState.user.followed();
    this.followState.followState = (followedStatus === true ? 'follow' : followedStatus) || 'unfollow';
  }

  className = (): string => 'iam_follow_users-selectFollowLevelModal';

  title(): Mithril.Children {
    return this.trans('title', { username: <em>{this.followState.user?.displayName?.()}</em> });
  }

  content(): Mithril.Children {
    // If `this.user` isn't a valid User, exit quickly to prevent complete forum errors.
    if (!(this.followState.user instanceof User)) {
      // Show a more detailed error if this happens when the forum is in debug mode.
      return (
        <div class="Modal-body">
          <p>{this.trans(`no_user_attr_provided_err${app.forum.attribute('debug') ? '_debug' : ''}`)}</p>
        </div>
      );
    }

    const user = this.followState.user;

    const availableLevelOptions = FollowLevels.reduce((acc, curr) => ({ ...acc, [curr.value]: curr.name() }), {} as Record<string, string>);
    const selectedLevel = FollowLevels.find((l) => l.value === this.followState.followState);

    if (!selectedLevel) {
      return null;
    }

    return (
      <div class="Modal-body">
        <fieldset>
          <legend>{this.trans('description', { user })}</legend>

          <div class="selectFollowLevelModal-level">
            <label for="selectFollowLevelModal-select">{this.trans('follow_select_label')}</label>

            <Select
              disabled={this.followState.saving}
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
          <Button disabled={this.followState.saving} class="Button" onclick={this.hide.bind(this)}>
            {this.trans('cancel_btn')}
          </Button>
          <Button
            disabled={this.followState.saving}
            class="Button Button--primary"
            onclick={this.saveFollowLevel.bind(this)}
            loading={this.followState.saving}
          >
            {this.trans('save_btn')}
          </Button>
        </fieldset>
      </div>
    );
  }

  /**
   * Handles a change on the <select> element and saves the new value to a class property.
   */
  onFollowLevelChange(): void {
    const selectElement = this.$('.Select-input')[0] as HTMLInputElement;

    this.followState.followState = (selectElement.value as 'lurk' | 'follow') || 'unfollow';
  }

  /**
   * Helper for app.translator.trans, already including the initial keys up to `modals.select_follow_level`.
   */
  trans(key: string, opts?: Record<string, any>): Mithril.Children {
    return app.translator.trans(`ianm-follow-users.forum.modals.select_follow_level.${key}`, opts || {});
  }

  onsubmit(): void {
    this.saveFollowLevel();
  }

  /**
   * Sends the new follow state to the server
   */
  async saveFollowLevel(): Promise<void> {
    const newFollowState = this.followState.followState === 'unfollow' ? null : this.followState.followState;

    this.followState.saving = true;

    // Exit early if level not changed
    if (this.followState.user!.attribute('following') === newFollowState) {
      this.hide();
      return;
    }

    await this.followState.user!.save({ followUsers: newFollowState });

    this.hide();
  }
}
