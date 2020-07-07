import {IHash, ISigmaNodeInteractionState} from '../interfaces';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';

export enum Keypresses {
	A = 'Keypresses__A',
	E = 'Keypresses__E',
	TAB = 'Keypresses__TAB',
	SPACE = 'Keypresses__SPACE',
	SHIFT_ENTER = 'Keypresses__SHIFT_ENTER',
	ESC = 'Keypresses__ESC',
	OTHER = 'Keypresses__OTHER',
}
export enum IMouseNodeEvents {
	CLICK_SIGMA_NODE = 'IMouseNodeEvents__CLICK_SIGMA_NODE',
	CLICK_ADD_BUTTON = 'IMouseNodeEvents__CLICK_ADD_BUTTON',
	CLICK_EDIT_BUTTON = 'IMouseNodeEvents__CLICK_EDIT_BUTTON',
	HOVER_SIGMA_NODE = 'IMouseNodeEvents__HOVER_SIGMA_NODE',
	HOVER_VUE_NODE = 'IMouseNodeEvents__HOVER_VUE_NODE',
}
export enum IMouseStageEvents {
	CLICK_STAGE = 'IMouseNodeEvents__CLICK_STAGE',
}
export interface IMapEventCore {
	type: string
}
export interface IMouseNodeEvent extends IMapEventCore {
	type: IMouseNodeEvents,
	nodeId: string
}
export interface IMouseStageEvent extends IMapEventCore {
	type: IMouseStageEvents,
}
export interface IKeyEvent extends IMapEventCore {
	type: Keypresses
}
export type IMapAction = IMouseNodeEvent | IMouseStageEvent | IKeyEvent;
export type IMapActionTypes = IMouseNodeEvents | IMouseStageEvents | Keypresses
export class NullError extends Error {}


export interface IMapInteractionStateUpdates {
	cardUpdates: IHash<ISigmaNodeInteractionState> // hashmap keyed by cardId
	globalMutations: Array<{name: MUTATION_NAMES, args: any}> // hashmap keyed by global mutation

}

export type IMapInteractionStateTuple = [boolean, boolean, boolean, boolean, boolean]
// ActionMatcher - an object that specifies a function that should be run if the action+mapInteractionState matches
// that passed in the first two indices of the array
export type ActionMatcher = [IMapActionTypes, IMapInteractionStateTuple, () => void];

export type MatcherFunction = (...args: ActionMatcher[]) => void;
