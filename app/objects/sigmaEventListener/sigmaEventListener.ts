import {inject, injectable, tagged} from 'inversify';
import {TYPES} from '../types';
import {
	CONTENT_TYPES,
	IBindable, IFamilyLoader, ISwitchToMapMutationArgs, ISigma,
	ISigmaEventListener, ISigmaNodeData,
	ITooltipOpener, ISigmaNode,
} from '../interfaces';
import {log} from '../../core/log';
import {CustomSigmaEventNames} from './customSigmaEvents';
import {TAGS} from '../tags';
import {Store} from 'vuex';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {IMoveTreeCoordinateMutationArgs} from '../../core/store/store_interfaces';

@injectable()
export class SigmaEventListener implements ISigmaEventListener {
	private tooltipOpener: ITooltipOpener;
	private sigmaInstance: ISigma;
	private familyLoader: IFamilyLoader;
	private dragListener: IBindable;
	private store: Store<any>;

	constructor(@inject(TYPES.SigmaEventListenerArgs){
		tooltipOpener,
		sigmaInstance,
		familyLoader,
		dragListener,
		store
	}: SigmaEventListenerArgs) {
		this.tooltipOpener = tooltipOpener;
		this.sigmaInstance = sigmaInstance;
		this.familyLoader = familyLoader;
		this.dragListener = dragListener;
		this.store = store;
	}

	public startListening() {
		this.sigmaInstance.bind('clickNode', (event) => {
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			if (!nodeId) {
				return;
			}
			const sigmaNode = this.sigmaInstance.graph.nodes(nodeId);
			this.tooltipOpener.openTooltip(sigmaNode);

			const nodeData: ISigmaNodeData = event.data.node;
			const contentType: CONTENT_TYPES = event.data.node.content.type;
			switch (contentType) {
				case CONTENT_TYPES.MAP: {
					const branchesMapId = nodeId;
					const switchToMapMutationArgs: ISwitchToMapMutationArgs = {
						branchesMapId
					};
					this.store.commit(MUTATION_NAMES.SWITCH_TO_MAP, switchToMapMutationArgs);
					break;
				}
			}

		});
		// debugger;
		this.sigmaInstance.bind('overNode', (event) => {
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			if (!nodeId) {
				return;
			}
			this.familyLoader.loadFamilyIfNotLoaded(nodeId);
		});
		this.sigmaInstance.bind('clickStage', (event) => {
			const nodeId = event && event.data &&
				event.data.node && event.data.node.id;
			/** explicitly close any current open flashcards.
			 * Sometimes after the user has clicked the play button before, sigmaJS tooltips plugin
			 * won't natively close the card,
			 * so we must do it manually through this mutation
			 */
			this.store.commit(MUTATION_NAMES.CLOSE_CURRENT_FLASHCARD);
		});
		this.dragListener.bind('dragend', (event) => {
			const node = event && event.data && event.data.node;
			const nodeId = node.id;
			const mutationArgs: IMoveTreeCoordinateMutationArgs = {
				treeId: nodeId,
				point: {x: node.x, y: node.y}
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
}
