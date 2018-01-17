import {log} from '../../core/log'
import {ISigmaNode} from '../interfaces';
import 'reflect-metadata'
import {encode} from 'punycode';
export function escape(str) {
   if (!str) {
       return ''
   }
   return encodeURIComponent(JSON.stringify(str))
}
export function renderer(node: ISigmaNode, userId, template) {
    // var nodeInEscapedJsonForm = encodeURIComponent(JSON.stringify(node))
    // switch (node.type) {
    //     case 'tree':
    const contentEscaped = escape(node.content)
    const contentUserDataEscaped = escape(node.contentUserData)
    const contentUserId = node && node.contentUserData && node.contentUserData.id
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
    // break;
    // }
    // var result = template // Mustache.render(template, node)
    return result

    // return result
}
export const tooltipsConfig = {
    node: [
        {
            show: 'rightClickNode',
            cssClass: 'sigma-tooltip',
            position: 'center',
            template: '',
            renderer
        }],
};
