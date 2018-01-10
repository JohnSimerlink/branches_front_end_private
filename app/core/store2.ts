import Vuex, {Store} from 'vuex'
import {GRAPH_CONTAINER_ID, ROOT_ID} from './globals';
import {log} from './log'
import sigma from '../../other_imports/sigma/sigma.core.js'

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
    graph: null
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
    const graph = {
        nodes: [],
        edges: [],
    }
    const sigmaInstance /*: Sigma*/ = new sigma({
        graph,
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
    state.sigmaInstance = sigmaInstance
    state.graph = sigmaInstance.graph
}
mutations[MUTATION_NAMES.REFRESH] = state => {
    state.sigmaInstance.refresh()
}
mutations[MUTATION_NAMES.ADD_NODE] = (state, node) => {
    state.graph.addNode(node)
    mutations[MUTATION_NAMES.REFRESH]()
}
const actions = {}

export default class BranchesStore {
    constructor() {
        return new Vuex.Store({
            state,
            mutations,
            actions,
            getters,
        } ) as Store<any>
    }
}
