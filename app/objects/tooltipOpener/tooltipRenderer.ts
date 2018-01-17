import {inject, injectable} from 'inversify';
import Vue from 'vue';
import clonedeep = require('lodash.clonedeep') // TODO: why didn't regular require syntax work?

import {isMobile} from '../../core/utils';
import {TYPES} from '../types';
import {ISigmaNode, ITooltipOpener, ITooltipRenderer, ITooltipRendererFunction} from '../interfaces';
import {log} from '../../core/log'
import {Store} from 'vuex';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoader';

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
    private userId: string
    constructor(@inject(TYPES.TooltipOpenerArgs){store}) {
        this.store = store
        // TODO: maybe set up this watch outside of constructor?
        this.store.watch(
            state => state.userId,
            (newValue, oldValue) => {
                this.userId = newValue
            })
        // TODO: does this initialize userId with the initial value?
    }
    public renderer(node: ISigmaNode, template) {
        // var nodeInEscapedJsonForm = encodeURIComponent(JSON.stringify(node))
        // switch (node.type) {
        //     case 'tree':
        const contentEscaped = escape(node.content)
        const contentUserDataEscaped = escape(node.contentUserData)
        const contentId = node.contentId
        const userId = this.userId
        const contentUserId = getContentUserId({contentId, userId})
        log('tooltips config called', node, template, node.content, contentEscaped,
            ' and contentUserId is', contentUserId,
            ' and contentUserData is ', contentUserDataEscaped)
        const result: string =
            `<div id="vue">
            <tree
                parentid='${node.parentId}'
                contentid='${node.contentId}'
                content-string='${contentEscaped}'
                content-user-string='${contentUserDataEscaped}'
                content-user-id='${contentUserId}'
                id='${node.id}'>
            </tree>
        </div>`;
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
