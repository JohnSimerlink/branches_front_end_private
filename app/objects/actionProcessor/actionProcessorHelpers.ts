import {IMapInteractionState} from '../interfaces';
import {IMapAction, IMapActionTypes, MatcherFunction} from './actionProcessor.interfaces';

export class ActionProcessorHelpers {
	public static match(action: IMapAction, mapInteractionState: IMapInteractionState): MatcherFunction {

	}
	public static matchOld(action: IMapAction, mapInteractionState: IMapInteractionState, desiredActionType: IMapActionTypes,desiredMapInteractionState: boolean[]) {

	}
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
