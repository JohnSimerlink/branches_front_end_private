import Vuex from "vuex"
import Vue from "vue"
import {Trees} from '../objects/trees'
import Snack from '../../node_modules/snack.js/dist/snack'
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
    settingsMenuOpen: false,
    openNodeId: null
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
            PubSub.publish('canvas.closeTooltip', {oldNode: treeId})
        } else {
            var snack = new Snack({
                domParent: document.querySelector('.new-exercise')
            });
            // show a snack for 4s
            snack.show("No items to study for this tree!", 4000)
        }
    },
    async itemStudied(state, contentId){
        console.log('itemStudied called', state, contentId, ...arguments)
        if (!getters.studying(state)){
            return
        }
        const tree = await Trees.get(state.currentStudyingCategoryTreeId)
        PubSub.publish('canvas.closeTooltip', tree.id)
        if (tree.areItemsToStudy()){
            const itemToStudy  = tree.getNextItemToStudy()
            console.log('next itemId to Study is', itemToStudy)
            state.currentStudyingContentItem = itemToStudy
        }
    },
    toggleSettingsMenu(state){
        state.settingsMenuOpen = !state.settingsMenuOpen
    },
    closeSettingsMenu(state){
        state.settingsMenuOpen = false
    },
    clickNode(state, nodeId){
        console.log("store.js clickNode called",state.openNodeId, nodeId)
        state.openNodeId = nodeId
    },
    clickStage(state){
        state.openNodeId = null
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