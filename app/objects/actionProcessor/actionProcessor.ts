import {IMapAction, NullError} from './actionProcessor.interfaces';
import {IMapInteractionState, ISigmaNode} from '../interfaces';
import {matches} from 'z'

export function determineUpdates(action: IMapAction, mapInteractionState: IMapInteractionState) {
    const result = matches(action, mapInteractionState) (
      (x = null, y = null) => 123,
    );
    if (result === null) {
        console.log("RESULT IS", null)
        // consol
        throw new NullError("action and mapInteractionState can't be null")
    } else {
        console.log("RESULT IS" ,result)
    }
    // TODO: misc, when adding a new card, the initial text on the new card should be fully selected/focused such
    //  that the first key you press on it replaces the initial text with that key
    const cardUpdates ={}
    const globalMutations = [];
    return {
        cardUpdates, globalMutations
    }
}

export function processUpdates() {

}

//
// switchMany(mapInterationState, ['hoverCardIsSomething', 'editCardIsSomething', 'twoCardsAreSame', 'hoverCardFlipped', 'editCardFlipped'],
//   [
//     ([true, true, true, false, false]) => console.log("NO FHE. doing stuff"),))
// ]
// matches(mapInteractionState,
//   ())
// hoverCardIsSomething: true
// editCardIsSomething: true
// twoCardsAreSame: true
// hoverCardFlipped: false
// editCardFlipped: false
// // function caseAction(o: T)
// type CaseAction<T> = (o: T) => any;
// function matches<T>(obj: T, caseActions: Array<CaseAction<T>>) {
//    for (const caseAction of caseActions) {
//
//
//    }
// }
