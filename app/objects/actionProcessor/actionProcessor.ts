import {IMapAction, IMapInteractionStateUpdates, Keypresses, NullError} from './actionProcessor.interfaces';
import {IMapInteractionState, ISigmaNodeInteractionState, ISigmaNodes, ISigmaNodesUpdater} from '../interfaces';
import {matches} from 'z'
import {Store} from 'vuex';
import {TYPES} from '../types';
import {inject} from 'inversify';
import {ActionProcessorHelpers} from './actionProcessorHelpers';

/*
What are cardInteractionStateUpdates?
    changing one of the following 3 properties:
    - flipped,
    - cardMode: editing or viewing
    - hovering: or not hovering

    - they are not anything with EDITing the conteent of the card or the user's proficiency on the card
 */

/*
    any sigmNodeInteractionStateUpdate should be handled thru sigmaNodesUpdater, and not thru the store
 */

export class ActionHandler {
	private sigmaNodesUpdater: ISigmaNodesUpdater;
	private sigmaNodes: ISigmaNodes;
	private store: Store<any>;

	constructor(@inject(TYPES.ActionHandlerArgs){
		sigmaNodesUpdater,
		sigmaNodes,
		store,
	}: ActionHandlerArgs){
		this.sigmaNodesUpdater = sigmaNodesUpdater;
		this.sigmaNodes = sigmaNodes;
		this.store = store;
	}

	public determineUpdates(action: IMapAction, mapInteractionState: IMapInteractionState, cards: ISigmaNodes): IMapInteractionStateUpdates {
		if (ActionProcessorHelpers.matchOld(action, mapInteractionState, Keypresses.SHIFT_ENTER, [true, true, true, false, false])) {
			//case 1
		}
		/*

		ActionProcessorHelpers.match(action, mapInteractionState)(
			[Keypresses.SHIFT_ENTER, [true, true, true, false, false], () => { //do stuff  w],
			[Keypresses.SHIFT_ENTER, [true, true, true, false, false], () => { //do stuff  }],


		 */
		// if (ActionProcessorHelpers.mapInteractionStateIs(mapInteractionState, [true, true, true, false, false])) {
		// 	if (action.type === Keypresses.SHIFT_ENTER)
		// }
		const result = matches(action, mapInteractionState)(
			(x = null, y = null) => 123,
		);
		if (result === null) {
			console.log("RESULT IS", null)
			// consol
			throw new NullError("action and mapInteractionState can't be null")
		} else {
			console.log("RESULT IS", result)
		}
		// TODO: misc, when adding a new card, the initial text on the new card should be fully selected/focused such
		//  that the first key you press on it replaces the initial text with that key
		const cardUpdates = {}
		const globalMutations = [];
		return {
			cardUpdates, globalMutations
		}
	}

	public processUpdates(updates: IMapInteractionStateUpdates) {
		Object.keys(updates.cardUpdates).forEach(cardId => {
			const update: ISigmaNodeInteractionState = updates.cardUpdates[cardId]
			this.sigmaNodesUpdater.handleInteractionStateUpdate({id: cardId, ...update})
		});
		for (const mutation of updates.globalMutations) {
			this.store.commit(mutation.name, mutation.args)
		}
	}
}
export class ActionHandlerArgs {
	@inject(TYPES.ISigmaNodesUpdater) public sigmaNodesUpdater: ISigmaNodesUpdater;
	@inject(TYPES.ISigmaNodes) public sigmaNodes: ISigmaNodes;
	@inject(TYPES.BranchesStore) public store: Store<any>
}

// export function processUpdates(/*sigmaNodesUpdater, store */ updates: IMapInteractionStateUpdates) {
//     Object.keys(updates.cardUpdates).forEach(cardId => {
//         this.sigmaNodesUpdateh
//
//     })
//
// }

//
// switchMany(mapInterationState, ['hoverCardIsSomething', 'editCardIsSomething', 'twoCardsAreSame',
// 'hoverCardFlipped', 'editCardFlipped'], [ ([true, true, true, false, false]) => console.log("NO FHE. doing
// stuff"),)) ] matches(mapInteractionState, ()) hoverCardIsSomething: true editCardIsSomething: true twoCardsAreSame:
// true hoverCardFlipped: false editCardFlipped: false // function caseAction(o: T) type CaseAction<T> = (o: T) => any;
// function matches<T>(obj: T, caseActions: Array<CaseAction<T>>) { for (const caseAction of caseActions) {   } }
