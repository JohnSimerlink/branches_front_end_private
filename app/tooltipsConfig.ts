import {log} from './core/log'
import {ISigmaNode} from './objects/interfaces';
import {encode} from 'punycode';
export const tooltipsConfig = {
    node: [
        {
            show: 'rightClickNode',
            cssClass: 'sigma-tooltip',
            position: 'center',
            template: '',
            renderer: (node: ISigmaNode, template) => {
                // var nodeInEscapedJsonForm = encodeURIComponent(JSON.stringify(node))
                // switch (node.type) {
                //     case 'tree':
                const contentEscaped = encodeURIComponent(JSON.stringify(node.content))
                log('tooltips config called', node, template, node.content, contentEscaped)
                const result: string =
                    `<div id="vue">
                        <tree
                            parentid='${node.parentId}'
                            contentid='${node.contentId}'
                            content-string='${contentEscaped}'
                            id='${node.id}'>
                        </tree>
                    </div>`;
                        // break;
                // }
                // var result = template // Mustache.render(template, node)
                return result

                // return result
            }
        }],
};
