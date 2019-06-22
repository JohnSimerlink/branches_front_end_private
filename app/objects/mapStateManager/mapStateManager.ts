import {
	inject,
	injectable, tagged
} from 'inversify';
import {TYPES} from '../types';
import {
	GRAPH_CONTAINER_ID,
	GRAPH_CONTAINER_SELECTOR
} from '../../core/globals';
import {
	fImportSigmaConstructor,
	IMapStateManager,
	ISigma,
	ISigmaConstructor
} from '../interfaces';
import {TAGS} from '../tags';
import {MAP_STATES} from './MAP_STATES';
import {
	editingModeNodeRenderer,
	mainModeNodeRenderer
} from '../../../other_imports/sigma/renderers/canvas/canvasNodeRendererHellpers';

@injectable()

export class MapStateManager implements IMapStateManager {

	private mapState: MAP_STATES;
	private sigmaConstructor: ISigmaConstructor
	private importSigmaConstructor: fImportSigmaConstructor;
	constructor(@inject(TYPES.MapStateManagerArgs) {
		mapState,
		importSigmaConstructor
	}: MapStateManagerArgs) {
		this.mapState = mapState
		this.importSigmaConstructor = importSigmaConstructor;
	}
	public init() {
		/*
		 TODO: I don't like how this breaks the dependency injection model
		 But i guess that's neccessary with the nature of how we do the importSigmaConstructor currently
		*/
		this.sigmaConstructor = this.importSigmaConstructor();
		// debugger;
		this.enterMainMode();
	}
	/* hmmmm this whole class may be counterproductive once we have the click on stage to create card going on
	 . . . maybe maybe not. */
	private get map(): HTMLElement {
		return document.querySelector(GRAPH_CONTAINER_SELECTOR);
	}
	private get mapStyle() {
		return this.map.style
	}
	public enterEditingMode() {
		this.mapStyle.backgroundColor = 'rgba(0, 0, 0, .7)'; // make screen dark
		this.mapState = MAP_STATES.EDITING
		this.sigmaConstructor.canvas.nodes.def = editingModeNodeRenderer
	}
	public enterMainMode() {
		this.mapState = MAP_STATES.MAIN
		this.mapStyle.removeProperty('background-color'); // make screen dark
		this.sigmaConstructor.canvas.nodes.def = mainModeNodeRenderer
	}
	public getMapState(): MAP_STATES {
		return this.mapState
	}
}

@injectable()
export class MapStateManagerArgs {
	@inject(TYPES.MapState) @tagged(TAGS.MAIN_SIGMA_INSTANCE, true) public mapState: MAP_STATES;
	@inject(TYPES.fImportSigmaConstructor) public importSigmaConstructor: fImportSigmaConstructor;
	// sigmaInstance // for refresh method
	// DOM element of canvas
	// some utility function to change behavior of canvas renderer
	// @inject(TYPES.BranchesStore) public store: Store<any>;
}

