import {IMapInteractionState} from '../interfaces';
import {
	ActionMatcher,
	IMapAction,
	IMapActionTypes,
	IMapInteractionStateTuple,
	MatcherFunction
} from './actionProcessor.interfaces';

export class ActionProcessorHelpers {
	// A function that takes an array of config arguments. The function returns a function that you can pass
	// actions/mapInteractionStates into to match.
	// tslint:disable-next-line:variable-name
	public static match(action_: IMapAction, mapInteractionState: IMapInteractionState): MatcherFunction {

		function matcherFunction(...args: ActionMatcher[]) {
			for (const actionMatcher of args) {
				const [action, mapInteractionStateTuple, operations ]:
					[IMapActionTypes, IMapInteractionStateTuple, () => void] = actionMatcher
				const match = action_.type === action &&
					ActionProcessorHelpers.mapInteractionStateIs(mapInteractionState, mapInteractionStateTuple)
				if (match) {
					operations();
				}
				break; // for now let each action/state pair only be able to be matched once.
				// TODO: maybe add a "_" matching feature similar to ocaml
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
			twoCardsAreSame,
			hoverCardFlipped,
			editCardFlipped}: IMapInteractionState,
		[
			// tslint:disable-next-line:variable-name
			_hoverCardIsSomething, _editCardIsSomething, _twoCardsAreSame, _hoverCardFlipped, _editCardFlipped
		]: boolean[]): boolean {
		return hoverCardIsSomething && _hoverCardIsSomething &&
			editCardIsSomething && _editCardIsSomething &&
			twoCardsAreSame && _twoCardsAreSame &&
			hoverCardFlipped && _hoverCardFlipped &&
			editCardFlipped && _hoverCardFlipped
	}
}
