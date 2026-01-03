import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import User from 'flarum/common/models/User';
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
    followState: SelectFollowLevelModalState;
    oninit(vnode: Mithril.Vnode<SelectFollowLevelModalAttrs, this>): void;
    className: () => string;
    title(): Mithril.Children;
    content(): Mithril.Children;
    /**
     * Handles a change on the <select> element and saves the new value to a class property.
     */
    onFollowLevelChange(): void;
    /**
     * Helper for app.translator.trans, already including the initial keys up to `modals.select_follow_level`.
     */
    trans(key: string, opts?: Record<string, any>): Mithril.Children;
    onsubmit(): void;
    /**
     * Sends the new follow state to the server
     */
    saveFollowLevel(): Promise<void>;
}
export {};
