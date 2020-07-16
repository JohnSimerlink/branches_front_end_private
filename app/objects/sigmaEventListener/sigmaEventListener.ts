import {inject, injectable, tagged} from 'inversify';
import {TYPES} from '../types';
import {
	CONTENT_TYPES,
	IBindable,
	IFamilyLoader,
	IFlipCardMutationArgs,
	ISigma,
	ISigmaEventListener,
	ISigmaNodeData,
	IState,
	ISwitchToMapMutationArgs,
	ITooltipOpener,
} from '../interfaces';
import {CustomSigmaEventNames} from './customSigmaEvents';
import {TAGS} from '../tags';
import {Store} from 'vuex';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {IMoveTreeCoordinateMutationArgs} from '../../core/store/store_interfaces';
import {SIGMA_EVENT_NAMES} from './sigmaEventNames';
import {createNewCardAndStartEditing} from '../../components/cardAddButton/cardAddButton';
import {InteractionStateActionProcessor} from '../interactionStateProcessor/interactionStateProcessor';
import {MouseNodeEvents} from '../interactionStateProcessor/interactionStateProcessor.interfaces';

@injectable()
export class SigmaEventListener implements ISigmaEventListener {
	private tooltipOpener: ITooltipOpener;
	private sigmaInstance: ISigma;
	private familyLoader: IFamilyLoader;
	private dragListener: IBindable;
	private store: Store<IState>;
	private interactionStateActionProcessor: InteractionStateActionProcessor;
	// private cardOpen: boolean

	constructor(@inject(TYPES.SigmaEventListenerArgs){
		tooltipOpener,
		sigmaInstance,
		familyLoader,
		dragListener,
		store,
		interactionStateActionProcessor
	}: SigmaEventListenerArgs) {
		this.tooltipOpener = tooltipOpener;
		this.sigmaInstance = sigmaInstance;
		this.familyLoader = familyLoader;
		this.dragListener = dragListener;
		this.store = store;
		this.interactionStateActionProcessor = interactionStateActionProcessor;
		// this.cardOpen = false
	}

	public startListening() {
		/* TODO: replace the below space listener into a different keyboardListener class */
		document.body.addEventListener('keydown', ev => {
			if (ev.keyCode === 9 || ev.key === ' ' /* DETECT SPACE */) {

				const flipCardMutationArgs: IFlipCardMutationArgs = {
					sigmaId: this.store.state.hoveringCardId
				}
				this.store.commit(MUTATION_NAMES.FLIP_FLASHCARD, flipCardMutationArgs)
			}
		});
		document.body.addEventListener('keydown', ev => {
			if (ev.key === 'a' /* DETECT `A` key */) {
				const hoveringCardId = this.store.state.hoveringCardId
				const nodeData: ISigmaNodeData = this.store.getters.sigmaNode(hoveringCardId)
				createNewCardAndStartEditing(hoveringCardId, nodeData.treeLocationData, this.store, nodeData)
			}
		});

		let doubleClickPromise
		let currentClickedNodeId = null
		this.sigmaInstance.bind(SIGMA_EVENT_NAMES.DOUBLE_CLICK_NODE, (event) => {
			// const nodeId = event && event.data &&
			// 	event.data.node && event.data.node.id;
			// // console.log("nodeId is ", nodeId)
			// if (!nodeId) {
			// 	return;
			// }
			// // console.log('double click node called', nodeId)
			// doubleClickPromise(true)
			//
			// this.store.commit(MUTATION_NAMES.SAVE_LOCAL_CARD_EDIT)
			// this.store.commit(MUTATION_NAMES.CLOSE_LOCAL_CARD_EDIT)
			// const setEditingCardIdMutationArgs: ISetEditingCardMutationArgs = {
			// 	sigmaId: nodeId,
			// 	contentId: event.data.node.contentId
			// }
			// this.store.commit(MUTATION_NAMES.SET_EDITING_CARD, setEditingCardIdMutationArgs);
			//
			//


		})
		this.sigmaInstance.bind(SIGMA_EVENT_NAMES.CLICK_NODE, async (event) => {
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			// console.log("nodeId is ", nodeId)
			if (!nodeId) {
				return;
			}
			// if (nodeId === currentClickedNodeId) {
			// 	return
			// }
			currentClickedNodeId = nodeId
			// const isDoubleClick = await new Promise((resolve, reject) => {
			// 	doubleClickPromise = resolve
			// 	setTimeout(() => {
			// 		resolve(false)
			// 		currentClickedNodeId = null
			// 	},400);
			// })
			// if (isDoubleClick) {
			// 	return
			// }
			// const sigmaNode = this.sigmaInstance.graph.nodes(nodeId);
			// this.tooltipOpener.openEditTooltip(sigmaNode);
			//
			// const setCardOpenMutationArgs: ISetCardOpenMutationArgs = {sigmaId: nodeId}
			// this.store.commit(MUTATION_NAMES.SET_CARD_OPEN, setCardOpenMutationArgs);
			const flipCardMutationArgs: IFlipCardMutationArgs = {
				sigmaId: nodeId
			}
			this.store.commit(MUTATION_NAMES.FLIP_FLASHCARD, flipCardMutationArgs)


			const nodeData: ISigmaNodeData = event.data.node;
			const contentType: CONTENT_TYPES = event.data.node.content.type;
			switch (contentType) {
				case CONTENT_TYPES.MAP: {
					const branchesMapId = nodeId;
					const switchToMapMutationArgs: ISwitchToMapMutationArgs = {
						branchesMapId
					};
					this.store.commit(MUTATION_NAMES.SWITCH_TO_MAP, switchToMapMutationArgs);
				}
			}

		});
		// debugger;
		this.sigmaInstance.bind(SIGMA_EVENT_NAMES.OVER_NODE, (event) => {
			if (this.store.state.cardOpen) {
				// can't open up a node via hovering when a card is already open. this leads to an annoying UX
				return
			}
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			if (!nodeId) {
				return;
			}
			this.familyLoader.loadFamilyIfNotLoaded(nodeId);
			this.interactionStateActionProcessor.processAction({
				type: MouseNodeEvents.HOVER_SIGMA_NODE,
				nodeId
			})
			// const sigmaNode = this.sigmaInstance.graph.nodes(nodeId);
			// const setHoveringCardMutationArgs: ISetHoveringCardMutationArgs = {
			// 	sigmaId: nodeId
			// }
			// this.store.commit(MUTATION_NAMES.SET_HOVERING_CARD, setHoveringCardMutationArgs)
			// this.tooltipOpener.openHoverTooltip(sigmaNode)
			// this.tooltipOpener.openEditTooltip(sigmaNode)
			// setTimeout(() => {
			// 	this.store.commit(MUTATION_NAMES.REFRESH); // needed to get rid of label disappearing bug
			// }, 0)
		});
		this.sigmaInstance.bind(SIGMA_EVENT_NAMES.CLICK_STAGE, (event) => {
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			/** explicitly close any current open flashcards.
			 * Sometimes after the user has clicked the play button before, sigmaJS tooltips plugin
			 * won't natively close the card,
			 * so we must do it manually through this mutation
			 */
			this.store.commit(MUTATION_NAMES.REMOVE_HOVERING_CARD);
			// this.store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
			this.store.commit(MUTATION_NAMES.SAVE_LOCAL_CARD_EDIT);
			this.store.commit(MUTATION_NAMES.CLOSE_LOCAL_CARD_EDIT);
			// this.store.commit(MUTATION_NAMES.REFRESH);
		});
		this.dragListener.bind(SIGMA_EVENT_NAMES.DRAG_END, (event) => {
			const node = event && event.data && event.data.node;
			const nodeId = node.id;

			const mutationArgs: IMoveTreeCoordinateMutationArgs = {
				treeId: nodeId,
				point: {
					x: node.x,
					y: node.y
				}
			};
			this.store.commit(MUTATION_NAMES.MOVE_TREE_COORDINATE, mutationArgs);
		});
		// debugger;
		this.sigmaInstance.renderers[0].bind(CustomSigmaEventNames.CENTERED_NODE, (event) => {
			const nodeId = event && event.data &&
				event.data.centeredNodeId;
			if (!nodeId) {
				return;
			}
			this.familyLoader.loadFamilyIfNotLoaded(nodeId);
		});
	}
}

export class SigmaEventListenerArgs {
	@inject(TYPES.ITooltipOpener) public tooltipOpener: ITooltipOpener;
	@inject(TYPES.ISigma) public sigmaInstance: ISigma;
	@inject(TYPES.IFamilyLoader) public familyLoader: IFamilyLoader;
	@inject(TYPES.BranchesStore) public store: Store<any>;
	@inject(TYPES.IBindable)
	@tagged(TAGS.DRAG_LISTENER, true)
	public dragListener: IBindable;
	@inject(TYPES.InteractionStateActionProcessor) public interactionStateActionProcessor: InteractionStateActionProcessor;
}
