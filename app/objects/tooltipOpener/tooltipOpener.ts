import {
	inject,
	injectable
} from 'inversify';
import Vue
	from 'vue';
import {isMobile} from '../../core/utils';
import {TYPES} from '../types';
import {
	ISigmaNode,
	IState,
	ITooltipConfigurer,
	ITooltipOpener
} from '../interfaces';
import {Store} from 'vuex';
import clonedeep = require('lodash.clonedeep'); // TODO: why didn't regular require syntax work?

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

	// private userId: string
	constructor(@inject(TYPES.TooltipOpenerArgs){store, tooltipConfigurer}: TooltipOpenerArgs) {
		this.tooltipConfigurer = tooltipConfigurer;
		this.store = store;
		// const state: IState = store.state;
		// this.getTooltips = state.getTooltips; // TODO: big violations of Law of Demeter here
		// TODO: maybe set up this watch outside of constructor?
	}

	public openPrimaryTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
	}

	public openHoverTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getHovererTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
	}

	public openEditTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getEditTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
	}

	public openAddTooltip(node: ISigmaNode) {
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getAddTooltipsConfig();
		this._openTooltip(node, tooltipsConfig)
	}

	private _openTooltip(node: ISigmaNode, tooltipsConfig) {
		const configClone = clonedeep(tooltipsConfig);

		if (isMobile.any()) {
			configClone.node[0].cssClass = configClone.node[0].cssClass + ' mobileAnswerTray';
		}

		const tooltips = this.store.state.getTooltips()// TODO: fix LoD violation
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
}
