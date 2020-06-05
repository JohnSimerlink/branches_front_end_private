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
