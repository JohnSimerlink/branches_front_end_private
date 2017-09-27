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
    currentStudyingCategoryTreeId: '1',
    modes: {
        2: {
            contentId: 12345,
        }
    },
    settingsMenuOpen: false,
    openNodeId: null,
    nodeIdToSync: null,
    hoverOverItemId: null,
    mobile: false,
    points: 34,
};

const getters = {
    studying: state => state.mode === MODES.STUDYING,
    currentStudyingCategoryTreeId: state => state.currentStudyingCategoryTreeId,
    settingsMenuOpen: state => state.settingsMenuOpen,
}
const serverMutations = {
    async itemStudied(state, contentId){
        console.log('STORE JSitemStudied called mutation called inside of store', state, contentId, ...arguments)
        this.commit('closeNode')
        if (!getters.studying(state)){
            return
        }
        const tree = await Trees.get(state.currentStudyingCategoryTreeId)
        console.log(" STORE JS tree leaf values before sorting are ",
            JSON.stringify(tree.leaves.map(leaf =>
                {
                    return {id: leaf.id, strength: leaf.lastRecordedStrength.value}
                }
            )),
        )
        await tree.sortLeavesByStudiedAndStrength()
        console.log(" STORE JS tree leaf values after sorting are ",
            JSON.stringify(tree.leaves.map(leaf =>
            {
                return {id: leaf.id, strength: leaf.lastRecordedStrength.value}
            }
            )),
        )
        if (tree.areItemsToStudy()){
            const itemIdToStudy  = tree.getNextItemIdToStudy()
            console.log(' STORE JS next itemId to Study is', itemIdToStudy)
            this.commit('hoverOverItemId', itemIdToStudy)
        } else {
            console.log(" STORE JS no items to study in tree")
        }
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
            const itemIdToStudy = tree.getNextItemIdToStudy()
            console.log('next itemId to Study is', itemIdToStudy)
            this.commit('hoverOverItemId', itemIdToStudy)
            this.commit('closeNode')
            // PubSub.publish('canvas.closeTooltip', {oldNode: treeId})
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
    hoverOverItemId(state, itemId){
        state.hoverOverItemId = itemId
    },
    clickNode(state, nodeId){
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
        const contentId = interaction.contentId
        const contentItem = await ContentItems.get(contentId)
        contentItem.addInteraction(interaction, addChangeToDB)
    },
    async clearInteractions(state, {data, addChangeToDB}){
        const {contentId, timestamp } = data
        const contentItem = await ContentItems.get(contentId)
        contentItem.clearInteractions(addChangeToDB)
        user.clearInteractionsForItem(contentItem.id, addChangeToDB)
        this.commit('syncGraphWithNode',contentItem.getTreeId())
    },
    addPoints(state, delta){
        console.log("store commit add points delta is ", delta)
        state.points += +delta
    }

}
const mutations = {
    ...serverMutations,
    ...localMutations
}

const actions = {
    itemStudied: ({commit, contentId}) => {
        commit('itemStudied', contentId)
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})