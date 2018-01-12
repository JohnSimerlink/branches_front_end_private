export const tooltipsConfig = {
    node: [
        {
            show: 'rightClickNode',
            cssClass: 'sigma-tooltip',
            position: 'center',
            template: '',
            renderer: (node, template) => {
                var nodeInEscapedJsonForm = encodeURIComponent(JSON.stringify(node))
                switch (node.type) {
                    case 'tree':
                        template = '<div id="vue"><tree id="' + node.id + '"></tree></div>';
                        break;
                }
                var result = template // Mustache.render(template, node)

                return result
            }
        }],
};
