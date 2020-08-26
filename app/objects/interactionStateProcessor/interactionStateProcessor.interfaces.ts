import {IHash, IMapInteractionState, ISigmaNodeInteractionState, MapInteractionStateChanges} from '../interfaces';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';

export enum KeyCodes {
	TAB = 9,
	ESC = 27,
	SPACE = 32,
}
export enum Keypresses {
	A = 'Keypresses__A',
	E = 'Keypresses__E',
	TAB = 'Keypresses__TAB',
	SPACE = 'Keypresses__SPACE',
	SHIFT_ENTER = 'Keypresses__SHIFT_ENTER',
	ESC = 'Keypresses__ESC',
	ONE = 'Keypresses__ONE',
	TWO = 'Keypresses__TWO',
	THREE = 'Keypresses__THREE',
	FOUR = 'Keypresses__FOUR',
	UP = 'Keypresses__UP', // panning
	DOWN = 'Keypresses__DOWN',
	LEFT = 'Keypresses__LEFT',
	RIGHT = 'Keypresses__RIGHT',
	SHIFT_UP = 'Keypresses__SHIFT_UP', //zooming
	SHIFT_DOWN = 'Keypresses__SHIFT_DOWN',
	OTHER = 'Keypresses__OTHER',
}
export enum MouseNodeEvents {
	CLICK_SIGMA_NODE = 'IMouseNodeEvents__CLICK_SIGMA_NODE',
	CLICK_ADD_BUTTON = 'IMouseNodeEvents__CLICK_ADD_BUTTON',
	CLICK_EDIT_BUTTON = 'IMouseNodeEvents__CLICK_EDIT_BUTTON',
	HOVER_SIGMA_NODE = 'IMouseNodeEvents__HOVER_SIGMA_NODE',
	HOVER_VUE_NODE = 'IMouseNodeEvents__HOVER_VUE_NODE',
}
export enum MouseStageEvents {
	CLICK_STAGE = 'IMouseNodeEvents__CLICK_STAGE',
}
export interface IMapEventCore {
	type: string
}
export interface IMouseNodeEvent extends IMapEventCore {
	type: MouseNodeEvents,
	nodeId: string
}
export interface IMouseStageEvent extends IMapEventCore {
	type: MouseStageEvents,
}
export interface IKeyEvent extends IMapEventCore {
	type: Keypresses
}
export type IMapAction = IMouseNodeEvent | IMouseStageEvent | IKeyEvent;
export type IMapActionTypes = MouseNodeEvents | MouseStageEvents | Keypresses
export class NullError extends Error {}

export interface IGlobalMutation {
	name: MUTATION_NAMES, args: any
}
export interface IMapInteractionStateUpdates {
	cardUpdates: IHash<ISigmaNodeInteractionState> // hashmap keyed by cardId
	globalMutations: IGlobalMutation[] // hashmap keyed by global mutation
	mapInteractionState: IMapInteractionState,
	mapInteractionStateChanges: MapInteractionStateChanges

}
// export const _ = Symbol('__MATCHES_ANYTHING__');
export const _ = '__MATCHES_ANYTHING__';
export type __ = '__MATCHES_ANYTHING__';
export type hyperboolean = __ | boolean;
export type IMapInteractionStateTuple = [hyperboolean, hyperboolean, hyperboolean, hyperboolean, hyperboolean]
// ActionMatcher - an object that specifies a function that should be run if the action+mapInteractionState matches
// that passed in the first two indices of the array
export type ActionMatcher = [IMapActionTypes, IMapInteractionStateTuple, () => void];

export type MatcherFunction = (...args: ActionMatcher[]) => void;
