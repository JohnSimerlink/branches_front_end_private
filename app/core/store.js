import Vuex from "vuex"
import Vue from "vue"
import {Trees} from '../objects/trees'
import Snack from '../../node_modules/snack.js/dist/snack'
import user from '../objects/user'
import {syncGraphWithNode} from "../components/knawledgeMap/knawledgeMap";
import message from '../message'
import ContentItems from "../objects/contentItems";
Vue.use(Vuex)

export const MODES = {
    EXPLORING: 1,
    STUDYING: 2,
}

const state = {
    mode: MODES.EXPLORING,
    currentStudyingCategoryTreeId: 1,//user.getCurrentStudyingCategoryTreeId(),
    modes: {
        2: {
            contentId: 12345,
        }
    },
    settingsMenuOpen: false,
    openNodeId: null,
    nodeIdToSync: null,
    hoverOverItemId: null,
    itemHovered: Math.random(),
    mobile: false,
    points: 0,
};

const getters = {
    studying: state => state.mode === MODES.STUDYING,
    currentStudyingCategoryTreeId: state => state.currentStudyingCategoryTreeId,
    settingsMenuOpen: state => state.settingsMenuOpen,
}
const serverMutations = {
    async itemStudied(state, contentId){
        this.commit('closeNode')
        if (!getters.studying(state)){
            return
        }
        const tree = await Trees.get(state.currentStudyingCategoryTreeId)
        // console.log(" STORE JS tree leaf values before sorting are ",
        //     JSON.stringify(tree.leaves.map(leaf =>
        //         {
        //             return {id: leaf.id, strength: leaf.lastRecordedStrength.value}
        //         }
        //     )),
        // )
        await tree.sortLeavesByStudiedAndStrength()
        // console.log(" STORE JS tree leaf values after sorting are ",
        //     JSON.stringify(tree.leaves.map(leaf =>
        //     {
        //         return {id: leaf.id, strength: leaf.lastRecordedStrength.value}
        //     }
        //     ))
        // )
        if (tree.areNewOrOverdueItems()){
            const itemIdToStudy  = tree.getNextItemIdToStudy()
            console.log(' STORE JS next itemId to Study is', itemIdToStudy)
            this.commit('hoverOverItemId', itemIdToStudy)
        } else {
            const contentItem = await tree.getContentItem()
            // const label = contentItem.getLabel()
            // message(
            //     {
            //         text: 'No new or overdue items for ' + label + "! Study something else :)",
            //     }
            // )
            this.commit('hoverOverItemId', contentItem.id)
            this.commit('enterExploringMode', {reason: "No more new or overdue items!"})
        }
    },
}
const localMutations = {
    changeMode(state, mode){
        state.mode = mode
    },
    async setCurrentStudyingTree(state, treeId){
        state.currentStudyingCategoryTreeId = treeId
        user.setCurrentStudyingCategoryTreeId(treeId)
        this.commit('enterStudyingMode')
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
        console.log("hoverOverItemId called START ",state.hoverOverItemId, itemId)
        state.hoverOverItemId = itemId
        state.itemHovered = Math.random()
        console.log("hoverOverItemId called END ",state.hoverOverItemId, itemId)
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
    //triggered by other mutations - shouldn't be triggered on its own, and thus shouldn't be recorded in the mutation list in the db
    addPoints(state, delta){
        console.log("store commit add points delta is ", delta)
        state.points += +delta
        user.setPoints(state.points)
    },
    async enterExploringMode(state, data){
        state.mode = MODES.EXPLORING
        const tree = await Trees.get(state.currentStudyingCategoryTreeId)
        const contentItem = await tree.getContentItem()
        const reason = data && data.reason || ""
        let text = ""
        let middle = "Stopped Auto-Study for " + contentItem.getLastNBreadcrumbsString(4) + "."
        if (reason){
            text = reason + " " + middle + " Study something else :)"
        } else {
            text = middle
        }
        message({text, duration: 15000})
    },
    async enterStudyingMode(state, data){
        const tree = await Trees.get(state.currentStudyingCategoryTreeId)
        const contentItem = await tree.getContentItem()
        await tree.sortLeavesByStudiedAndStrength()
        if (tree.areNewOrOverdueItems()){
            state.mode = MODES.STUDYING
            const itemIdToStudy = tree.getNextItemIdToStudy()
            message({text: "Started Auto-Study for " + contentItem.getLastNBreadcrumbsString(4)})
            console.log('next itemId to Study is', itemIdToStudy)
            this.commit('hoverOverItemId', itemIdToStudy)
            this.commit('closeNode')
            // PubSub.publish('canvas.closeTooltip', {oldNode: treeId})
        } else {
            // this.commit('enterExploringMode', {reason: "No Items to study for this tree" })
            message({text: "No new / overdue items to study for this tree!"})
        }
    },
    async openReview(state, itemId){
        const me = this
        const contentItem = await ContentItems.get(itemId)
        if (!contentItem) {return}
        if (state.mobile){
            this.commit('openNode', contentItem.getTreeId())
            return
        } else {
            this.commit('hoverOverItemId', itemId)
            setTimeout(function(){
                me.commit('openNode', contentItem.getTreeId())
            }, 0)
            return
        }

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

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
export default store

PubSub.subscribe('dataLoaded', function(){
    state.points = user.getPoints()
})
