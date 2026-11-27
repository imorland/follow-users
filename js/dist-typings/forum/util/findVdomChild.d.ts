import type Mithril from 'mithril';
type VdomChildren = Mithril.Vnode<Record<string, unknown>> | Mithril.Vnode<Record<string, unknown>>[];
type ManipulationFunction = (vnode: Mithril.Vnode<Record<string, unknown>>) => void;
export declare function findAndRemoveFirstVdomChild(vdom: VdomChildren, selector: string): boolean;
export declare function findFirstVdomChild(vdom: VdomChildren, selector: string, manipulationFunc?: ManipulationFunction): Mithril.Vnode<Record<string, unknown>> | undefined;
export {};
