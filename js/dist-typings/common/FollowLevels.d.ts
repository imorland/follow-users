type TranslatorParameters = Record<string, unknown>;
type TranslationFunction = (opts?: TranslatorParameters) => any;
export interface FollowLevel {
    value: string;
    name: TranslationFunction;
    description: TranslationFunction;
}
export declare const FollowLevels: readonly FollowLevel[];
export {};
