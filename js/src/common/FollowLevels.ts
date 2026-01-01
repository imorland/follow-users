import app from 'flarum/common/app';

type TranslatorParameters = Record<string, unknown>;
type TranslationFunction = (opts?: TranslatorParameters) => any;

const trans =
  (key: string): TranslationFunction =>
  (opts) =>
    app.translator.trans(`ianm-follow-users.lib.follow_levels.${key}`, opts ?? {});

export interface FollowLevel {
  value: string;
  name: TranslationFunction;
  description: TranslationFunction;
}

export const FollowLevels: readonly FollowLevel[] = Object.freeze([
  {
    value: 'unfollow',
    name: trans('unfollow.name'),
    description: trans('unfollow.description'),
  },
  {
    value: 'follow',
    name: trans('follow.name'),
    description: trans('follow.description'),
  },
  {
    value: 'lurk',
    name: trans('lurk.name'),
    description: trans('lurk.description'),
  },
]);
