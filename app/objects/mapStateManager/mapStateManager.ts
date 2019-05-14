import {
	inject,
	injectable
} from 'inversify';
import {TYPES} from '../types';
import {
	GRAPH_CONTAINER_ID,
	GRAPH_CONTAINER_SELECTOR
} from '../../core/globals';
import {IMapStateManager} from '../interfaces';

@injectable()

export class MapStateManager implements IMapStateManager {

	constructor(@inject(TYPES.MapStateManagerArgs) {
	}: MapStateManagerArgs) {
	}

	// hmmmm this whole class may be counterproductive once we have the click on stage to create card going on . . . maybe maybe not.
	private get map(): HTMLElement {
		return document.querySelector(GRAPH_CONTAINER_SELECTOR);
	}
	private get mapStyle() {
		return this.map.style
	}
	public enterEditingMode() {
		this.mapStyle.backgroundColor = 'rgba(0, 0, 0, .7)'; // make screen dark
	}
	public enterMainMode() {
		this.mapStyle.removeProperty('background-color'); // make screen dark
	}
}

@injectable()
export class MapStateManagerArgs {
	// sigmaInstance // for refresh method
	// DOM element of canvas
	// some utility function to change behavior of canvas renderer
	// @inject(TYPES.BranchesStore) public store: Store<any>;
}
