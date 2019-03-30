import {inject, injectable} from 'inversify';
import Vue from 'vue';
import {isMobile} from '../../core/utils';
import {TYPES} from '../types';
import {
	ISigmaNode,
	ITooltipConfigurer,
	ITooltipOpener
} from '../interfaces';
import {log} from '../../core/log';
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
	private tooltips;
	private store: Store<any>;
	// private tooltipsConfig: object;
	private tooltipConfigurer: ITooltipConfigurer;

	// private userId: string
	constructor(@inject(TYPES.TooltipConfigurerArgs){tooltips, store, tooltipConfigurer}: TooltipOpenerArgs) {
		this.tooltipConfigurer = tooltipConfigurer;
		this.tooltips = tooltips;
		this.store = store;
		// TODO: maybe set up this watch outside of constructor?
	}

	public openTooltip(node: ISigmaNode) {
		const me = this;
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getTooltipsConfig();
		const configClone = clonedeep(tooltipsConfig);

		if (isMobile.any()) {
			configClone.node[0].cssClass = configClone.node[0].cssClass + ' mobileAnswerTray';
		}

		// TODO: may have to use renderer2
		this.tooltips.open(node, configClone.node[0], node['renderer1:x']
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
	public openHoverTooltip(node: ISigmaNode) {
		const me = this;
		// Make copy of singleton's config by value to avoid mutation
		const tooltipsConfig = this.tooltipConfigurer.getHovererTooltipsConfig();
		const configClone = clonedeep(tooltipsConfig);

		if (isMobile.any()) {
			configClone.node[0].cssClass = configClone.node[0].cssClass + ' mobileAnswerTray';
		}

		// TODO: may have to use renderer2
		this.tooltips.open(node, configClone.node[0], node['renderer1:x']
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
	@inject(TYPES.Object) public tooltips;
	@inject(TYPES.ITooltipConfigurer) public tooltipConfigurer: ITooltipConfigurer;
	@inject(TYPES.Object) public store: Store<any>;
}
