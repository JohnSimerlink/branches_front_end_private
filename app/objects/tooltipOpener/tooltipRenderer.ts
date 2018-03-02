import {inject, injectable} from 'inversify';
import Vue from 'vue';
import clonedeep = require('lodash.clonedeep') // TODO: why didn't regular require syntax work?

import {isMobile} from '../../core/utils';
import {TYPES} from '../types';
import {ISigmaNode, ISigmaNodeData, ITooltipOpener, ITooltipRenderer, ITooltipRendererFunction} from '../interfaces';
import {log} from '../../core/log'
import {Store} from 'vuex';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';

export function escape(str) {
    if (!str) {
        return ''
    }
    return encodeURIComponent(JSON.stringify(str))
}
/* If we ever have a feature where someone can essentially masquerade
 as another user and open a tooltip with a different userId,
 we will have to instantiate another tooltipOpener object */
@injectable()
export class TooltipRenderer implements ITooltipRenderer {
    private store: Store<any>
    constructor(@inject(TYPES.TooltipOpenerArgs){store}: TooltipRendererArgs) {
        this.store = store
        // TODO: maybe set up this watch outside of constructor?
    }
    private userId(): string {
        return this.store.state.userId
    }
    public renderer(node: ISigmaNodeData, template): string {
        const contentId = node.contentId
        const userId = this.userId()
        const contentUserId = getContentUserId({contentId, userId})
        const contentString = JSON.stringify(node.content)
        const contentUserDataString = node.contentUserData ?
            JSON.stringify(node.contentUserData) : ''
        const resultElement = document.createElement('div')
        resultElement.setAttribute('id', 'vue')
        const tree = document.createElement('tree')
        tree.setAttribute('id', node.id)
        tree.setAttribute('parent-id', node.parentId)
        tree.setAttribute('content-id', node.contentId)
        tree.setAttribute('content-string', contentString)
        tree.setAttribute('content-user-id', contentUserId)
        tree.setAttribute('content-user-data-string', contentUserDataString)
        resultElement.appendChild(tree)
        const result: string = resultElement.outerHTML

        return result
    }
    public getTooltipsConfig() {
        const tooltipsConfig = {
            node: [
                {
                    show: 'rightClickNode',
                    cssClass: 'sigma-tooltip',
                    position: 'center',
                    template: '',
                    renderer: this.renderer.bind(this)
                }],
        };
        return tooltipsConfig
    }
}

@injectable()
export class TooltipRendererArgs {
    @inject(TYPES.Object) public store
}
