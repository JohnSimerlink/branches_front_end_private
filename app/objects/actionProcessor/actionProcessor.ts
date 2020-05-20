import {IMapAction} from './actionProcessor.interfaces';
import {ISigmaNode} from '../interfaces';

export function determineUpdates(action: IMapAction, hoveringCard: ISigmaNode, editingCard: ISigmaNode, mapState) {
    const cardUpdates = {};
    const globalMutations = [];
    return {
        cardUpdates, globalMutations
    }
}
