export function importSigma() {
    const sigma = require('./sigma/sigma.core.js').default || require('./sigma/sigma.core.js');
    require('./sigma/conrad.js');
    require( './sigma/utils/sigma.utils.js');
    require( './sigma/utils/sigma.utils.branches.js');
    require( './sigma/utils/sigma.polyfills.js'); // << didn't refactor
    require( './sigma/sigma.settings.js');
    require( './sigma/classes/sigma.classes.dispatcher.js');
    require( './sigma/classes/sigma.classes.configurable.js');
    require( './sigma/classes/sigma.classes.graph.js');
    require( './sigma/classes/sigma.classes.camera.js');
    require( './sigma/classes/sigma.classes.quad.js');
    require( './sigma/classes/sigma.classes.edgequad.js');
    require( './sigma/captors/sigma.captors.mouse.js');
    require( './sigma/captors/sigma.captors.touch.js');
    require( './sigma/renderers/sigma.renderers.canvas.js');
    require( './sigma/renderers/sigma.renderers.webgl.js');
    require( './sigma/renderers/sigma.renderers.svg.js');
    require( './sigma/renderers/sigma.renderers.def.js');
    require( './sigma/renderers/canvas/sigma.canvas.labels.def.ts');
    require( './sigma/renderers/canvas/sigma.canvas.hovers.def.ts');
    require( './sigma/renderers/canvas/sigma.canvas.nodes.def.ts');
    require( './sigma/renderers/canvas/sigma.canvas.edges.def.js');
    require( './sigma/renderers/canvas/sigma.canvas.edgehovers.def.js');
    require( './sigma/renderers/canvas/sigma.canvas.extremities.def.js');
    require( './sigma/middlewares/sigma.middlewares.rescale.js');
    require( './sigma/middlewares/sigma.middlewares.copy.js');
    require( './sigma/misc/sigma.misc.animation.js');
    require( './sigma/misc/sigma.misc.bindEvents.js');
    require( './sigma/misc/sigma.misc.bindDOMEvents.js');
    require( './sigma/misc/sigma.misc.drawHovers.js');
    require( './sigma/plugins/dragNode.js');
    require( './sigma/plugins/sigma.plugins.tooltips/sigma.plugins.tooltips.js');
    require('./canvasInput.js')
		//TODO: not sure if we need all the .js extensions
    const {configureSigma} = require( '../app/objects/sigmaNode/configureSigma');
    console.log('sigma inside of importSigma is ', sigma);
    configureSigma(sigma);
    return sigma;
}
