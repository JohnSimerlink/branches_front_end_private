import {
	_,
	IGlobalMutation,
	IKeyEvent,
	IMapAction,
	IMapInteractionStateUpdates,
	IMouseNodeEvent,
	Keypresses,
	MouseNodeEvents,
	MouseStageEvents
} from './interactionStateProcessor.interfaces';
import {
	CONTENT_TYPES,
	IEditFlashcardMutationArgs,
	IHash,
	IMapInteractionState,
	ISigmaNodeData,
	ISigmaNodeInteractionState,
	ISigmaNodes,
	ISigmaNodesUpdater,
	IState,
	ISwitchToMapMutationArgs,
	MapInteractionStateChanges
} from '../interfaces';
import {Store} from 'vuex';
import {TYPES} from '../types';
import {inject, injectable, tagged} from 'inversify';
import {log} from '../../core/log'
import {ActionProcessorHelpers} from './ActionProcessorHelpers';
import {TAGS} from '../tags';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {INewChildTreeAndSetEditingCardMutationArgs} from '../../core/store/store_interfaces';

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
	private store: Store<IState>;

	constructor(@inject(TYPES.InteractionStateActionProcessorArgs){
		sigmaNodesUpdater,
		sigmaNodes,
		store,
	}: InteractionStateActionProcessorArgs) {
		this.sigmaNodesUpdater = sigmaNodesUpdater;
		this.sigmaNodes = sigmaNodes;
		this.store = store;
	}

	public _determineUpdates(action: IMapAction, mapInteractionState: IMapInteractionState, cards: ISigmaNodes): IMapInteractionStateUpdates {
		const cardUpdates: IHash<ISigmaNodeInteractionState> = {}
		let newMapInteractionState: IMapInteractionState = mapInteractionState;
		const mapInteractionStateChanges: MapInteractionStateChanges = []
		const globalMutations: IGlobalMutation[] = [];
		const me = this
		// TODO: figure out if there is a way to define these actions outside of this closure, and then import them into
		//  this closure
		// @requires mapInteractionState.hoveringCardId != null
		function createNewCardAndStartEditing() {
			console.log('createNewCardAndStartEditing called')
			console.log('createNewCardAndStartEditing called')
			console.log('createNewCardAndStartEditing called')
			console.log('createNewCardAndStartEditing called')
			action = action as IKeyEvent
			const parentTreeId = mapInteractionState.hoveringCardId
			// tslint:disable-next-line:no-shadowed-variable

			const args: INewChildTreeAndSetEditingCardMutationArgs = {parentTreeId}
			globalMutations.push({name: MUTATION_NAMES.NEW_CHILD_TREE_AND_SET_EDITING_CARD, args})
			// NOTE ^^ this also sets mapInteractionState.editingCardId = to the new card it

		}
		function hoverCard() {

			const {hoveringCardId: oldHoveringCardId} = mapInteractionState
			const oldHoveringCard = cards[oldHoveringCardId]
			log('onHoverNodeWhenNothingElse:::node hovered') //
			if (mapInteractionState.hoveringCardId) {
				cardUpdates[oldHoveringCardId] = {
					...oldHoveringCard,
					hovering: false
				}
			}
			action = action as IMouseNodeEvent
			// run this action afterwards in case the first action was setting hover unflipped
			const newHoveringCardId = action.nodeId
			const newHoveringCardOldState = cards[newHoveringCardId]
			cardUpdates[action.nodeId] = {
				...newHoveringCardOldState,
				hovering: true,
			};
			mapInteractionStateChanges.push({
				hoveringCardId: action.nodeId,
				hoverCardIsSomething: true
			})
		}

		function cardClickedOn() {
			log('flipCard')
			action = action as IMouseNodeEvent
			const {nodeId} = action
			const card = cards[nodeId]
			switch (card.content.type) {
				case CONTENT_TYPES.FLASHCARD:
					flipCard();
					break;
				case CONTENT_TYPES.MAP:
					openMap();
					break
			}
		}
		function flipCardClickedOn() {
		}
		function flipCard() {
			action = action as IMouseNodeEvent
			const {nodeId} = action
			const card = cards[nodeId]
			cardUpdates[nodeId] = makeFlippedCardState(card)
		}
		function openMap() {
			action = action as IMouseNodeEvent
			const branchesMapId = action.nodeId;
			const switchToMapMutationArgs: ISwitchToMapMutationArgs = {
				branchesMapId
			};
			globalMutations.push({name: MUTATION_NAMES.SWITCH_TO_MAP, args: switchToMapMutationArgs})
		}
		const makeFlippedCardState = card => {
			return {
				flipped: !card.flipped,
				editing: false, // editing is irrelevant in this case, but wouldn't have been able to flip by
				// clicking when
				// editing anyway
				hovering: true// set hovering to true in case it wasn't already
			};
		}

		function flipCurrentlyHoveredCard() {
			log('flipCard')
			action = action as IMouseNodeEvent
			const {hoveringCardId} = mapInteractionState
			const card = cards[hoveringCardId]
			cardUpdates[action.nodeId] = makeFlippedCardState(card)
		}

		function stopHovering() {
			log('stopHovering called', action)
			action = action as IMouseNodeEvent
			const {hoveringCardId} = mapInteractionState
			const card = cards[hoveringCardId]
			if (card) {
				cardUpdates[hoveringCardId] = {
					flipped: card.flipped,
					editing: card.editing,  // TODO: what do we do when two separate updates for the same card try to get
					// processed? I think cardUpdates should be an array
					hovering: false,
				};
			}
			mapInteractionStateChanges.push({
				hoveringCardId: null,
				hoverCardIsSomething: false,
				hoverCardExistsAndIsFlipped: false,
				editAndHoverCardsExistAndAreSame: false
			})

		}
		function onClickStageWhenHovering() {
			stopHovering();
		}
		function onClickStageWhenEditing() {
			log('onClickStageWhenEditing called')
			log('onClickStageWhenEditing called')
			log('onClickStageWhenEditing called')
			log('onClickStageWhenEditing called')
			saveEditingCard()
			//saveAnyEditingCards()
			closeLocalCardEdit()
		}

		function saveEditingCard() {
			const editFlashcardMutationArgs: IEditFlashcardMutationArgs = {
				contentId: mapInteractionState.editingCardContentId,
				question: mapInteractionState.editingCardQuestion,
				answer: mapInteractionState.editingCardAnswer,
			}
			globalMutations.push({name: MUTATION_NAMES.EDIT_FLASHCARD, args: editFlashcardMutationArgs})
		}
		function closeLocalCardEdit() {
			const editingCard = cards[mapInteractionState.editingCardId]
			cardUpdates[mapInteractionState.editingCardId] = {
				...editingCard,
				editing: false,
			}
			mapInteractionStateChanges.push({
				editCardIsSomething: false,
				editCardExistsAndIsFlipped: false,
				editAndHoverCardsExistAndAreSame: false,

				editingCardQuestion: null,
				editingCardAnswer: null,
				editingCardId: null,
				editingCardContentId: null
			})

		}

		log("ActionProcessorHelpers about to be called with type of", action.type, "and mapInteractionState" +
			" of ", ActionProcessorHelpers.toMapInteractionState(mapInteractionState))
		ActionProcessorHelpers.match(action.type, mapInteractionState)(
			/* action, [
				hoverCardIsSomething, editCardIsSomething, editAndHoverCardsExistAndAreSame,
				hoverCardExistsAndIsFlipped,editCardExistsAndIsFlipped, hoveringCardId,
				editingCardId ]
				*/
			/* https://docs.google.com/spreadsheets/d/1mLjsd_q1jsjKLzNLRYW1lbxrgZuXzxJWMXwx9qK7M5A/edit#gid=565596988 */
			/* the first state the app should usually start in */
			// TODO: we do need a way to match _ for a boolean
			[MouseNodeEvents.HOVER_SIGMA_NODE, [_, _, _, _, _], hoverCard],
			[MouseNodeEvents.HOVER_VUE_NODE, [_, _, _, _, _], hoverCard],


			[MouseStageEvents.CLICK_STAGE, [true, true, _, _, _],
				() => {
				onClickStageWhenEditing()
				onClickStageWhenHovering()
				}], // TODO: are
			[MouseStageEvents.CLICK_STAGE, [true, false, _, _, _], onClickStageWhenHovering], // TODO: are
			[MouseStageEvents.CLICK_STAGE, [false, true, _, _, _], onClickStageWhenEditing], // TODO: are
			[MouseNodeEvents.CLICK_SIGMA_NODE, [true, false, false, false, false], cardClickedOn], // TODO: are
			// these only happening because of this state machine? or a different event listener
			[Keypresses.A, [true, false, _, _, _], createNewCardAndStartEditing],


			// TODO: add a noop action?

			/* .. [hoverCardIsSomething		editCardIsSomething twoCardsExistAndAreSame hoverCardExistsAndIsFlipped
			 editCardExistsAndIsFlipped */
			/* front hover edit. no other card being edited */
			// nothing is being hovered or edited
			[Keypresses.SHIFT_ENTER, [_, _, _, _, _], () => log('shift enter pressed')],
			[Keypresses.ESC, [_, _, _, _, _], () => log('esc')],
			[Keypresses.TAB, [_, _, _, _, _], () => log('tab pressed')],
			[Keypresses.SPACE, [_, _, _, _, _] , () => log('tab pressed')],
			[Keypresses.A, [_, _, _, _, _], () => log('a pressed')],
			[Keypresses.E, [_, _, _, _, _], () => log('e pressed')],
			[Keypresses.ONE, [_, _, _, _, _], () => log('one pressed')],
			[Keypresses.TWO, [_, _, _, _, _], () => log('two pressed')],
			[Keypresses.THREE, [_, _, _, _, _], () => log('three pressed')],
			[Keypresses.FOUR, [_, _, _, _, _], () => log('four pressed')],
			[Keypresses.OTHER, [_, _, _, _, _], () => log('other pressed')],

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
		return {
			cardUpdates, globalMutations, mapInteractionState: newMapInteractionState, mapInteractionStateChanges
		}
	}

	public _processUpdates(updates: IMapInteractionStateUpdates) {
		log('_processUpdates called. updates are', updates)
		// 1: Global Mutations must happen first, as some of them depend on the node state updates not having
		// happened yet
		for (const mutation of updates.globalMutations) {
			this.store.commit(mutation.name, mutation.args)
		}
		Object.keys(updates.cardUpdates).forEach(cardId => {
			const update: ISigmaNodeInteractionState = updates.cardUpdates[cardId]
			this.sigmaNodesUpdater.handleInteractionStateUpdate({id: cardId, ...update})
		});
		updates.mapInteractionStateChanges.forEach(change => {

			this.store.commit(MUTATION_NAMES.UPDATE_MAP_INTERACTION_STATE, change)
		})
		// this.store.commit(MUTATION_NAMES.UPDATE_MAP_INTERACTION_STATE, updates.mapInteractionState)
		// Object.keys(updates.mapInteractionState).forEach(key => {
		// 	this.mapInteractionState[key] = updates.mapInteractionState[key]
		// })
		log('updates processed. new mapInteractionState is ', ActionProcessorHelpers.toTuple(this.mapInteractionState))
	}
	public processAction(action: IMapAction) {
		const updates = this._determineUpdates(action, this.mapInteractionState, this.sigmaNodes)
		log('interactionStateProcessor mapInteractionState is', ActionProcessorHelpers.toTuple(updates.mapInteractionState))
		this._processUpdates(updates)
	}
	private get mapInteractionState() {
		return this.store.state
	}

}
@injectable()
export class InteractionStateActionProcessorArgs {
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
