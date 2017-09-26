import Vuex from "vuex"
import Vue from "vue"
import {Trees} from '../objects/trees'
import Snack from '../../node_modules/snack.js/dist/snack'
import user from '../objects/user'
import {syncGraphWithNode} from "../components/knawledgeMap/knawledgeMap";
import ContentItems from "../objects/contentItems";
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
    openNodeId: null,
    nodeIdToSync: null,
    mobile: false
};

const getters = {
    studying: state => state.mode === MODES.STUDYING,
    currentStudyingCategoryTreeId: state => state.currentStudyingCategoryTreeId,
    settingsMenuOpen: state => state.settingsMenuOpen,
}
const serverMutations = {
    async itemStudied(state, contentId){
        console.log('itemStudied called mutation called inside of store', state, contentId, ...arguments)
        if (!getters.studying(state)){
            return
        }
        this.commit('closeNode')
        const tree = await Trees.get(state.currentStudyingCategoryTreeId)
        PubSub.publish('canvas.closeTooltip', tree.id)
        if (tree.areItemsToStudy()){
            const itemToStudy  = tree.getNextItemToStudy()
            console.log('next itemId to Study is', itemToStudy)
            state.currentStudyingContentItem = itemToStudy
        }
        // user.addMutation({type: 'itemStudied', data: contentId})
    },
}
const localMutations = {
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
    mobile(state, isMobile) {
        console.log("store.js mobile called",state.mobile, isMobile);
        state.mobile = isMobile;
    },
    toggleSettingsMenu(state){
        state.settingsMenuOpen = !state.settingsMenuOpen
    },
    closeSettingsMenu(state){
        state.settingsMenuOpen = false
    },
    clickNode(state, nodeId){
        console.log("store.js clickNode called",state.openNodeId, nodeId)
        this.commit('openNode', nodeId)
    },
    openNode(state, nodeId){
        state.openNodeId = nodeId
    },
    closeNode(state){
        state.openNodeId = null
    },
    clickStage(state){
        state.openNodeId = null
        if (getters.settingsMenuOpen(state)) {
            this.commit('closeSettingsMenu')
        }
    },
    syncGraphWithNode(state, nodeId){
        state.nodeIdToSync = nodeId
        // console.log('syncGraphWithNode', + Date.now())
    },
    async interaction(state, {data, addChangeToDB}){
        const interaction = data
        console.log('store.js interaction is', interaction, addChangeToDB)
        const contentId = interaction.contentId
        console.log('store.js contentId', interaction, contentId)
        const contentItem = await ContentItems.get(contentId)
        console.log('store.js contentItem', interaction, contentItem)
        contentItem.addInteraction(interaction, addChangeToDB)
    },
    async clearInteractions(state, {data, addChangeToDB}){
        const {contentId, timestamp } = data
        const contentItem = await ContentItems.get(contentId)
        contentItem.clearInteractions(addChangeToDB)
        user.clearInteractionsForItem(this.content.id, addChangeToDB)
    }

}
const mutations = {
    ...serverMutations,
    ...localMutations
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