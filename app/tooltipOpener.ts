import {inject, injectable} from 'inversify';
import Vue from 'vue';
import clonedeep = require('lodash.clonedeep') // TODO: why didn't regular require syntax work?
import {tooltipsConfig} from './objects/sigmaNode/tooltipsConfig';

import {isMobile} from './core/utils';
import {TYPES} from './objects/types';
import {ISigmaNode, ITooltipOpener} from './objects/interfaces';
import {log} from './core/log'
log('tooltipOpener clonedeep is ', clonedeep)

@injectable()
export class TooltipOpener implements ITooltipOpener {
    private tooltips
    private store
    constructor(@inject(TYPES.TooltipOpenerArgs){tooltips, store}) {
        this.tooltips = tooltips
        this.store = store
    }
    public openTooltip(node: ISigmaNode) {
        const me = this
        // Make copy of singleton's config by value to avoid mutation
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
            )
        }, 0) /* push this bootstrap function to the end of the callstack
         so that it is called after mustace does the tooltip rendering */

    }
}

@injectable()
class TooltipOpenerArgs {
    @inject(TYPES.Object) public tooltips
    @inject(TYPES.Object) public store
}
