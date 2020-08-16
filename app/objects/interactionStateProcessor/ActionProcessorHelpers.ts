import {IMapInteractionState, MapInteractionStateKeys} from '../interfaces';
import {
	_,
	ActionMatcher,
	IMapAction,
	IMapActionTypes,
	IMapInteractionStateTuple,
	MatcherFunction
} from './interactionStateProcessor.interfaces';
import {log} from '../../core/log';

export class ActionProcessorHelpers {
	// A function that takes an array of config arguments. The function returns a function that you can pass
	// actions/mapInteractionStates into to match.
	// tslint:disable-next-line:variable-name
	public static match(actionType_: IMapActionTypes, mapInteractionState: IMapInteractionState): MatcherFunction {

		function matcherFunction(...args: ActionMatcher[]) {
			let matchesFailed = 0
			for (const actionMatcher of args) {
				const [actionType, mapInteractionStateTuple, operations ] = actionMatcher
				const match = actionType_ === actionType &&
					ActionProcessorHelpers.mapInteractionStateIs(mapInteractionState, mapInteractionStateTuple)
				if (match) {
					operations();
					break; // for now let each action/state pair only be able to be matched once.
				} else {
					matchesFailed++;
				}
				// TODO: maybe add a "_" matching feature similar to ocaml
			}
			if (matchesFailed === args.length) {
				log('ActionProcessorHelpers.ts no match could be found')
			}

		}
		return matcherFunction

	}
	public static matchOld(action: IMapAction, mapInteractionState: IMapInteractionState, desiredActionType: IMapActionTypes,desiredMapInteractionState: boolean[]) {

	}
	// helper function to check if obj matches a state of the form [true, true, false, false, true] because it's less
	// typing
	public static mapInteractionStateIs(
		{
			hoverCardIsSomething,
			editCardIsSomething,
			editAndHoverCardsExistAndAreSame,
			hoverCardExistsAndIsFlipped,
			editCardExistsAndIsFlipped}: IMapInteractionState,
		[
			// tslint:disable-next-line:variable-name
			_hoverCardIsSomething,
			// tslint:disable-next-line:variable-name
			_editCardIsSomething,
			// tslint:disable-next-line:variable-name
			_twoCardsExistAndAreSame,
			// tslint:disable-next-line:variable-name
			_hoverCardExistsAndIsFlipped,
			// tslint:disable-next-line:variable-name
			_editCardExistsAndIsFlipped
		]: IMapInteractionStateTuple): boolean {
		return (_hoverCardIsSomething === _  || hoverCardIsSomething === _hoverCardIsSomething) &&
			(_editCardIsSomething === _ || editCardIsSomething === _editCardIsSomething) &&
			(_twoCardsExistAndAreSame === _ || editAndHoverCardsExistAndAreSame === _twoCardsExistAndAreSame) &&
			(_hoverCardExistsAndIsFlipped === _ || hoverCardExistsAndIsFlipped === _hoverCardExistsAndIsFlipped) &&
			(_hoverCardExistsAndIsFlipped === _ || editCardExistsAndIsFlipped === _editCardExistsAndIsFlipped)
	}
	public static toMapInteractionState(
	{
		hoverCardIsSomething,
		editCardIsSomething,
		editAndHoverCardsExistAndAreSame,
		hoverCardExistsAndIsFlipped,
		editCardExistsAndIsFlipped}: IMapInteractionState,

) {
		return [hoverCardIsSomething, editCardIsSomething, editAndHoverCardsExistAndAreSame, hoverCardExistsAndIsFlipped, editCardExistsAndIsFlipped]
	}
	public static stripSiblingProps(mapInteractionState: IMapInteractionState) {
		const o = {}
		Object.keys(mapInteractionState)
			.filter(k => Object.values(MapInteractionStateKeys).includes(k))
			.forEach(k => {
				o[k] = mapInteractionState[k]
			})
		return JSON.stringify(o)
	}
	public static toTuple({hoverCardIsSomething,
	  editCardIsSomething,
	  editAndHoverCardsExistAndAreSame,
	  hoverCardExistsAndIsFlipped,
	  editCardExistsAndIsFlipped,
	  hoveringCardId,
	  editingCardId}: IMapInteractionState) {
		return [
			hoverCardIsSomething,
			editCardIsSomething,
			editAndHoverCardsExistAndAreSame,
			hoverCardExistsAndIsFlipped,
			editCardExistsAndIsFlipped,
			hoveringCardId,
			editingCardId
		]

	}
}
