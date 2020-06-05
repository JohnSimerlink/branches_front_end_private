import {IMapAction} from './actionProcessor.interfaces';
import {IMapInteractionState, ISigmaNode} from '../interfaces';

export function determineUpdates(action: IMapAction, mapInteractionState: IMapInteractionState) {
	
    // TODO: misc, when adding a new card, the initial text on the new card should be fully selected/focused such
    //  that the first key you press on it replaces the initial text with that key
    const cardUpdates = {};
    const globalMutations = [];
    return {
        cardUpdates, globalMutations
    }
}

export function processUpdates() {

}


switchMany(mapInterationState, ['hoverCardIsSomething', 'editCardIsSomething', 'twoCardsAreSame', 'hoverCardFlipped', 'editCardFlipped'],
  [
    ([true, true, true, false, false]) => console.log("NO FHE. doing stuff"),))
]
matches(mapInteractionState,
  ())
hoverCardIsSomething: true
editCardIsSomething: true
twoCardsAreSame: true
hoverCardFlipped: false
editCardFlipped: false
// function caseAction(o: T)
type CaseAction<T> = (o: T) => any;
function matches<T>(obj: T, caseActions: Array<CaseAction<T>>) {
   for (const caseAction of caseActions) {


   }
}
