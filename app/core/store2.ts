import Vuex, {Store} from 'vuex'
import {GRAPH_CONTAINER_ID, ROOT_ID} from './globals';
import {log} from './log'
import sigma from '../../other_imports/sigma/sigma.core.js'
import {ISigmaEventListener, ITooltipOpener} from '../objects/interfaces';
import {SigmaEventListener} from '../objects/sigmaEventListener/sigmaEventListener';
import {tooltipsConfig} from '../tooltipsConfig';
import {TooltipOpener} from '../tooltipOpener';
const sigmaAny: any = sigma

export const MUTATION_NAMES = {
    INITIALIZE_SIGMA_INSTANCE: 'initializeSigmaInstance',
    JUMP_TO: 'jump_to',
    REFRESH: 'refresh',
    ADD_NODE: 'add_node'
}
const state = {
    uri: null,
    centeredTreeId: ROOT_ID,
    sigmaInstance: null,
    graphData: {
        nodes: [],
        edges: [],
    },
    graph: null,
    sigmaInitialized: false,
};

const getters = {
}
const mutations = {
    initializeSigmaInstance() {

    }
}
mutations[MUTATION_NAMES.JUMP_TO] = (state, treeId) => {
    state.jumpToId = treeId
}
mutations[MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE] = state => {
    const sigmaInstance /*: Sigma*/ = new sigma({
        graph: state.graphData,
        container: GRAPH_CONTAINER_ID,
        glyphScale: 0.7,
        glyphFillColor: '#666',
        glyphTextColor: 'white',
        glyphStrokeColor: 'transparent',
        glyphFont: 'FontAwesome',
        glyphFontStyle: 'normal',
        glyphTextThreshold: 6,
        glyphThreshold: 3,
    } as any/* as SigmaConfigs*/) as any
    log('sigma truly just initialized')
    state.sigmaInstance = sigmaInstance
    state.graph = sigmaInstance.graph
    state.sigmaInitialized = true
    if (typeof window !== 'undefined') { // for debuggin only. NOT to be used by other classes
        const windowAny: any = window
        windowAny.sigmaInstance = sigmaInstance
    }

    /* TODO: it would be nice if I didn't have to do all this constructing
     inside of store2.ts and rather did it inside of appContainer or inversify.config.ts */
    const tooltips = sigmaAny.plugins.tooltips(sigmaInstance, sigmaInstance.renderers[0], tooltipsConfig)
    const tooltipOpener: ITooltipOpener = new TooltipOpener({tooltips, store: getters['getStore']})
    const sigmaEventListener: ISigmaEventListener = new SigmaEventListener({tooltipOpener, sigmaInstance})
    sigmaEventListener.startListening()
}
mutations[MUTATION_NAMES.REFRESH] = state => {
    log('store mutation refresh called', state)
    state.sigmaInstance.refresh()
}
mutations[MUTATION_NAMES.ADD_NODE] = (state, node) => {
    if (state.sigmaInitialized) {
        log('sigma was already intiialized initialized . .. adding node', node)
        state.graph.addNode(node)
        mutations[MUTATION_NAMES.REFRESH](state)
        log('STORE 2 TS ADD NODE. THIS STORE is ', getters['getStore']())
    } else {
        log('sigma not yet initialized . .. pushing node', node)
        state.graphData.nodes.push(node)
    }
}
const actions = {}

export default class BranchesStore {
    constructor() {
        const store = new Vuex.Store({
            state,
            mutations,
            actions,
            getters,
        } ) as Store<any>
        getters['getStore'] = () => store
        return store
    }
}
