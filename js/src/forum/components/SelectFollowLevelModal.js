import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import User from 'flarum/common/models/User';
import Button from 'flarum/common/components/Button';
import { FollowLevels } from '../../common/FollowLevels';

export class SelectFollowUserTypeModal extends Modal {
    /**
     * User being followed
     *
     * @type User | null
     */
    user = null;

    /**
     * Is the modal currently saving?
     *
     * @type boolean
     */
    saving = false;

    /**
     * Set of following levels active.
     *
     * @example new Set(["DISCUSSIONS", "POSTS"])
     */
    inputs = new Set();

    oninit(vnode) {
        super.oninit(vnode);

        this.user = this.attrs.user;

        this.inputs = new Set(this.user.attribute('following'));
    }

    className = () => 'iam_follow_users-selectFollowLevelModal';

    title() {
        return this.trans('title', { username: <em>{this.user?.username?.()}</em> });
    }

    content() {
        // If this.user isn't a valid User, exit quickly to prevent complete forum errors.
        if (!(this.user instanceof User)) {
            return <p>{this.trans(`no_user_attr_provided_err${app.forum.attribute('debug') ? '_debug' : ''}`)}</p>;
        }

        return (
            <div class="Modal-body">
                <fieldset>
                    <h3>{this.trans('follow_levels_heading')}</h3>

                    {FollowLevels.map((level) => {
                        return (
                            <div class="selectFollowLevelModal-level">
                                <input
                                    disabled={this.saving}
                                    type="checkbox"
                                    value={level.value}
                                    id={`selectFollowLevelModal-${level.value}-cb`}
                                    aria-described-by={`selectFollowLevelModal-${level.value}-help`}
                                    oninput={this.updateInputs.bind(this)}
                                />
                                <label for={`selectFollowLevelModal-${level.value}-cb`}>{level.name()}</label>
                                <p id={`selectFollowLevelModal-${level.value}-help`}>{level.description()}</p>
                            </div>
                        );
                    })}
                </fieldset>
                <fieldset class="selectFollowLevelModal-actions">
                    <Button disabled={this.saving} class="Button" onclick={this.hide.bind(this)}>
                        {this.trans('save_btn')}
                    </Button>
                    <Button disabled={this.saving} class="Button Button--primary" onclick={this.saveFollowLevel.bind(this)}>
                        {this.trans('cancel_btn')}
                    </Button>
                </fieldset>
            </div>
        );
    }

    async saveFollowLevel() {
        this.saving = true;

        const x = await this.user.save({ followUsers: Array.from(this.inputs) });

        console.log(x);

        this.hide();
    }

    /**
     * Helper for app.translator.trans, already including the initial keys up to `modals.select_follow_level`.
     */
    trans(key, ...opts) {
        return app.translator.trans(`ianm-follow-users.forum.modals.select_follow_level.${key}`, ...opts);
    }

    updateInputs(e) {
        /**
         * @type HTMLInputElement
         */
        const cbEl = e.target;

        if (cbEl.checked) {
            this.inputs.add(cbEl.value);
        } else {
            this.inputs.delete(cbEl.value);
        }

        console.log(this.inputs);
    }
}
