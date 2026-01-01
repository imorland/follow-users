import app from 'flarum/forum/app';
import FormModal from 'flarum/common/components/FormModal';
import User from 'flarum/common/models/User';
import Button from 'flarum/common/components/Button';
import Select from 'flarum/common/components/Select';
import { FollowLevels } from '../../common/FollowLevels';
import type Mithril from 'mithril';

interface SelectFollowUserTypeModalAttrs {
  user: User;
}

interface SelectFollowUserTypeModalState {
  user: User | null;
  saving: boolean;
  followState: 'lurk' | 'follow' | 'unfollow' | undefined;
}

// @ts-expect-error - FormModal attrs constraint issue
export class SelectFollowUserTypeModal extends FormModal<SelectFollowUserTypeModalAttrs> {
  // @ts-expect-error - Custom state structure
  state: SelectFollowUserTypeModalState = {
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

  oninit(vnode: Mithril.Vnode<SelectFollowUserTypeModalAttrs, this>) {
    super.oninit(vnode);

    this.state.user = this.attrs.user;

    const followedStatus = this.state.user.followed();
    this.state.followState = (followedStatus === true ? 'follow' : followedStatus) || 'unfollow';
  }

  className = (): string => 'iam_follow_users-selectFollowLevelModal';

  title(): Mithril.Children {
    return this.trans('title', { username: <em>{this.state.user?.displayName?.()}</em> });
  }

  content(): Mithril.Children {
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

    const availableLevelOptions = FollowLevels.reduce((acc, curr) => ({ ...acc, [curr.value]: curr.name() }), {} as Record<string, string>);
    const selectedLevel = FollowLevels.find((l) => l.value === this.state.followState);

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
  onFollowLevelChange(): void {
    const selectElement = this.$('.Select-input')[0] as HTMLInputElement;

    this.state.followState = (selectElement.value as 'lurk' | 'follow') || 'unfollow';
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
    const newFollowState = this.state.followState === 'unfollow' ? null : this.state.followState;

    this.state.saving = true;

    // Exit early if level not changed
    if (this.state.user!.attribute('following') === newFollowState) {
      this.hide();
      return;
    }

    await this.state.user!.save({ followUsers: newFollowState });

    this.hide();
  }
}
