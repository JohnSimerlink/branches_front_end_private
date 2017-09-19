import Vuex from "vuex"
import Vue from "vue"
import {Trees} from '../objects/trees'
Vue.use(Vuex)

export const MODES = {
    EXPLORING: 1,
    STUDYING: 2,
}

const state = {
    mode: MODES.STUDYING,
    currentStudyingContentItem:'8904d53adfef7376627f4227ada47cd8',
    currentStudyingCategoryTreeId: '1',
    modes: {
        2: {
            contentId: 12345,
        }
    },
}
//
// function setCurrentStudyingContentId(state, contentId){
//     state.currentStudyingContentItem = contentId
//
// }
const getters = {
    studying: state => state.mode === MODES.STUDYING,
    currentStudyingCategoryTreeId: state => state.currentStudyingCategoryTreeId,
}
const mutations = {
    changeMode(state, mode){
        state.mode = mode
    },
    async setCurrentStudyingTree(state, treeId){
        state.currentStudyingCategoryTreeId = treeId
        const tree = await Trees.get(treeId)
        if (tree.areItemsToStudy()){
            const itemToStudy = tree.getNextItemToStudy()
            console.log('next itemId to Study is', itemToStudy)
            state.currentStudyingContentItem = itemToStudy
        }
    },
    itemStudied(state, contentId){
        console.log('itemStudied called', state, contentId, ...arguments)
        // if (getters.studying(state)){
        //     console.log('state being changed', state, contentId,)
        //     state.modes[MODES.STUDYING].contentId = contentId
        // } else {
        //     console.log('state not in reviewing mode')
        // }
        const item = ContentItems.get(contentId)
        item.getTreeIds().forEach(tree => {
            tree.sortLeavesByStudiedAndStrength()
        })
    }
}

const actions = {
    itemStudied: ({commit, contentId}) => {
        console.log('item studied action called', contentId)
        commit('itemStudied', contentId)
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})