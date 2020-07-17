import {
	IMapAction,
	IMapInteractionStateUpdates,
	IMouseNodeEvent,
	Keypresses, MouseNodeEvents,
	NullError
} from './interactionStateProcessor.interfaces';
import {IHash, IMapInteractionState, ISigmaNodeInteractionState, ISigmaNodes, ISigmaNodesUpdater} from '../interfaces';
import {Store} from 'vuex';
import {TYPES} from '../types';
import {inject, injectable, tagged} from 'inversify';
import {log} from '../../core/log'
import {ActionProcessorHelpers} from './ActionProcessorHelpers';
import {TAGS} from '../tags';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';

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

@injectable()
export class InteractionStateActionProcessor {
	private sigmaNodesUpdater: ISigmaNodesUpdater;
	private sigmaNodes: ISigmaNodes;
	private store: Store<any>;
	private mapInteractionState: IMapInteractionState;

	constructor(@inject(TYPES.InteractionStateActionProcessorArgs){
		sigmaNodesUpdater,
		sigmaNodes,
		store,
		mapInteractionState
	}: InteractionStateActionProcessorArgs) {
		this.sigmaNodesUpdater = sigmaNodesUpdater;
		this.sigmaNodes = sigmaNodes;
		this.store = store;
		this.mapInteractionState = mapInteractionState;
	}

	public _determineUpdates(action: IMapAction, mapInteractionState: IMapInteractionState, cards: ISigmaNodes): IMapInteractionStateUpdates {
		const cardUpdates: IHash<ISigmaNodeInteractionState> = {}
		let newMapInteractionState: IMapInteractionState = mapInteractionState;

		// TODO: figure out if there is a way to define these actions outside of this closure, and then import them into
		//  this closure
		function onHoverNodeWhenNothingElse() {
			log('onHoverNodeWhenNothingElse:::node hovered')
			action = action as IMouseNodeEvent
			cardUpdates[action.nodeId] = {
				flipped: false,
				editing: false,
				hovering: true,
			};

			const {hoveringCardId} = mapInteractionState
			const oldHoveringCard = cards[hoveringCardId]
			if (mapInteractionState.hoveringCardId) {
				cardUpdates[hoveringCardId] = {
					...oldHoveringCard,
					hovering: false
				}
			}
			newMapInteractionState = {
				...mapInteractionState,
				hoveringCardId: action.nodeId,
				hoverCardIsSomething: true
			}
		}

		function flipCardClickedOn() {
			log('flipCard')
			action = action as IMouseNodeEvent
			const {nodeId} = action
			const card = cards[nodeId]
			cardUpdates[action.nodeId] = {
				flipped: !card.flipped,
				editing: false, // editing is irrelevant in this case, but wouldn't have been able to flip by clicking when
				// editing anyway
				hovering: true, // set hovering to true in case it wasn't already
			};
		}

		function flipCurrentlyHoveredCard() {
			log('flipCard')
			action = action as IMouseNodeEvent
			const {hoveringCardId} = mapInteractionState
			const card = cards[hoveringCardId]
			cardUpdates[action.nodeId] = {
				flipped: !card.flipped,
				editing: false, // editing is irrelevant in this case, but wouldn't have been able to flip by clicking when
				// editing anyway
				hovering: true, // set hovering to true in case it wasn't already
			};
		}

		function stopHovering() {
			log('flipCard')
			action = action as IMouseNodeEvent
			const {hoveringCardId} = mapInteractionState
			const card = cards[hoveringCardId]
			cardUpdates[action.nodeId] = {
				flipped: card.flipped,
				editing: card.editing,  // TODO: what do we do when two separate updates for the same card try to get
				// processed? I think cardUpdates should be an array
				hovering: false,
			};
		}
		function processClickState() {
			//closeCard()
			//saveAnyEditingCards()
		}

		ActionProcessorHelpers.match(action.type, mapInteractionState)(
			/* https://docs.google.com/spreadsheets/d/1mLjsd_q1jsjKLzNLRYW1lbxrgZuXzxJWMXwx9qK7M5A/edit#gid=565596988 */
			/* the first state the app should usually start in */
			// TODO: we do need a way to match _ for a boolean
			[MouseNodeEvents.HOVER_SIGMA_NODE, [false, false, false, false, false], onHoverNodeWhenNothingElse],
			[MouseNodeEvents.HOVER_SIGMA_NODE, [false, false, true, false, false], onHoverNodeWhenNothingElse],
			[MouseNodeEvents.HOVER_SIGMA_NODE, [false, false, false, true, false], stopHovering],


			[MouseNodeEvents.CLICK_SIGMA_NODE, [true, false, false, false, false], flipCardClickedOn],
			[MouseNodeEvents.CLICK_SIGMA_NODE, [true, false, false, true, false], flipCardClickedOn],


			// TODO: add a noop action?

			/* .. [hoverCardIsSomething		editCardIsSomething twoCardsExistAndAreSame hoverCardExistsAndIsFlipped
			 editCardExistsAndIsFlipped */
			/* front hover edit. no other card being edited */
			// nothing is being hovered or edited
			[Keypresses.SHIFT_ENTER, [false, false, true, false, false], () => log('shift enter pressed')],

			[Keypresses.SHIFT_ENTER, [false, true, true, false, false], () => log('shift enter pressed')],
			[Keypresses.SHIFT_ENTER, [true, true, true, false, false], () => log('shift enter pressed')],
			[Keypresses.ESC, [true, true, true, false, false], () => log('esc')],
			[Keypresses.TAB, [true, true, true, false, false], () => log('tab pressed')],
			[Keypresses.SPACE, [true, true, true, false, false], () => log('tab pressed')],
			[Keypresses.A, [true, true, true, false, false], () => log('case 2')],
			[Keypresses.E, [true, true, true, false, false], () => log('case 2')],
			[Keypresses.ONE, [true, true, true, false, false], () => log('case 2')],
			[Keypresses.TWO, [true, true, true, false, false], () => log('case 2')],
			[Keypresses.THREE, [true, true, true, false, false], () => log('case 2')],
			[Keypresses.FOUR, [true, true, true, false, false], () => log('case 2')],
			[Keypresses.OTHER, [true, true, true, false, false], () => log('case 2')],

		);
		// if (ActionProcessorHelpers.match(action, mapInteractionState, Keypresses.SHIFT_ENTER, [true, true, true, false, false])) {
		// 	//case 1
		// }
		/*

		ActionProcessorHelpers.match(action, mapInteractionState)(
			[Keypresses.SHIFT_ENTER, [true, true, true, false, false], () => { //do stuff  w],
			[Keypresses.SHIFT_ENTER, [true, true, true, false, false], () => { //do stuff  }],


		 */
		// if (ActionProcessorHelpers.mapInteractionStateIs(mapInteractionState, [true, true, true, false, false])) {
		// 	if (action.type === Keypresses.SHIFT_ENTER)
		// }
		// const result = matches(action, mapInteractionState)(
		// 	(x = null, y = null) => 123,
		// );
		// if (result === null) {
		// 	console.log("RESULT IS", null)
		// 	// consol
		// 	throw new NullError("action and mapInteractionState can't be null")
		// } else {
		// 	console.log("RESULT IS", result)
		// }
		// TODO: misc, when adding a new card, the initial text on the new card should be fully selected/focused such
		//  that the first key you press on it replaces the initial text with that key
		// const cardUpdates = {}
		const globalMutations = [];
		return {
			cardUpdates, globalMutations, mapInteractionState: newMapInteractionState
		}
	}

	public _processUpdates(updates: IMapInteractionStateUpdates) {
		Object.keys(updates.cardUpdates).forEach(cardId => {
			const update: ISigmaNodeInteractionState = updates.cardUpdates[cardId]
			this.sigmaNodesUpdater.handleInteractionStateUpdate({id: cardId, ...update})
		});
		for (const mutation of updates.globalMutations) {
			this.store.commit(mutation.name, mutation.args)
		}
		this.store.commit(MUTATION_NAMES.UPDATE_MAP_INTERACTION_STATE, updates.mapInteractionState)
		// Object.keys(updates.mapInteractionState).forEach(key => {
		// 	this.mapInteractionState[key] = updates.mapInteractionState[key]
		// })
		console.log('updates processed. new mapInteractionState is ', this.mapInteractionState)
	}
	public processAction(action: IMapAction) {
		const updates = this._determineUpdates(action, this.mapInteractionState, this.sigmaNodes)
		this._processUpdates(updates)
	}
}
@injectable()
export class InteractionStateActionProcessorArgs {
	@inject(TYPES.IMapInteractionState) public mapInteractionState: IMapInteractionState;

	// ^^ shared between some UI renderer and just this component. isn't even in the main store IMO.


	@inject(TYPES.ISigmaNodesUpdater)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaNodesUpdater: ISigmaNodesUpdater;
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
