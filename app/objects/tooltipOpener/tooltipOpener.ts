import {
	inject,
	injectable
} from 'inversify';
import Vue
	from 'vue';
import {isMobile} from '../../core/utils';
import {TYPES} from '../types';
import {
	IMapStateManager,
	ISigmaNode,
	IState,
	ITooltipConfigurer,
	ITooltipOpener
} from '../interfaces';
import {Store} from 'vuex';
import clonedeep = require('lodash.clonedeep');
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES'; // TODO: why didn't regular require syntax work?

export function escape(str) {
	if (!str) {
		return '';
	}
	return encodeURIComponent(JSON.stringify(str));
}

/* If we ever have a feature where someone can essentially masquerade
 as another user and open a tooltip with a different userId,
 we will have to instantiate another tooltipOpener object.
  with the way we currently have this set up */
@injectable()
export class TooltipOpener implements ITooltipOpener {
	// private getTooltips: () => any;
	private store: Store<any>;
	// private tooltipsConfig: object;
	private tooltipConfigurer: ITooltipConfigurer;
	private mapStateManager: IMapStateManager;

	// private userId: string
	constructor(@inject(TYPES.TooltipOpenerArgs){store, tooltipConfigurer, mapStateManager}: TooltipOpenerArgs) {
		this.tooltipConfigurer = tooltipConfigurer;
		this.store = store;
		this.mapStateManager = mapStateManager;
		// const state: IState = store.state;
		// this.getTooltips = state.getTooltips; // TODO: big violations of Law of Demeter here
		// TODO: maybe set up this watch outside of constructor?
	}

	public openPrimaryTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipConfig = this.tooltipConfigurer.getTooltipsConfig();
		this._openTooltip(node, tooltipConfig)
		this.store.commit(MUTATION_NAMES.SET_CARD_OPEN)
	}

	public openHoverTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getHovererTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
		//deliberately don't sed CARD OPEN flag, because the card really isn't open. . . just some hover icons are
	}

	public openEditTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getEditTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
		this.mapStateManager.enterEditingMode()
		this.store.commit(MUTATION_NAMES.SET_CARD_OPEN)
	}

	public openAddTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getAddTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
		this.mapStateManager.enterEditingMode()
		this.store.commit(MUTATION_NAMES.SET_CARD_OPEN)
	}

	private _openTooltip(node: ISigmaNode, tooltipsConfig) {
		const configClone = clonedeep(tooltipsConfig);

		if (isMobile.any()) {
			this.store.commit(MUTATION_NAMES.OPEN_MOBILE_CARD)
			// configClone.node[0].cssClass = configClone.node[0].cssClass + ' mobileAnswerTray';
		}

		const tooltips = this.store.state.getTooltips(); // TODO: fix LoD violation
		// TODO: may have to use renderer2
		tooltips.open(node, configClone.node[0], node['renderer1:x']
			|| node['renderer2:x'], node['renderer1:y'] || node['renderer2:y']);
		setTimeout(() => {
			const vm = new Vue(
				{
					el: '#vue',
					store: this.store,
				}
			);
			/* push this bootstrap function to the end of the callstack
							so that it is called after mustace does the tooltip rendering */
		}, 0);

	}
}

@injectable()
export class TooltipOpenerArgs {
	@inject(TYPES.ITooltipConfigurer) public tooltipConfigurer: ITooltipConfigurer;
	@inject(TYPES.BranchesStore) public store: Store<any>;
	@inject(TYPES.IMapStateManager) public mapStateManager: IMapStateManager;
}
