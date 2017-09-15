import Vuex from "vuex"
import Vue from "vue"
Vue.use(Vuex)

export const MODES = {
    EXPLORING: 1,
    REVIEWING: 2,
}

const state = {
    mode: MODES.REVIEWING,
    modes: {
        2: {
            contentId: 12345,
        }
    },
}
const getters = {
    reviewing: state => state.mode === MODES.REVIEWING,
    currentReviewingItem: state => state.modes[MODES.REVIEWING].contentId,
}
const mutations = {
    changeMode(state, mode){
        state.mode = mode
    },
    itemStudied(state, contentId){
        console.log('itemStudied called', state, contentId, ...arguments)
        if (getters.reviewing(state)){
            console.log('state being changed', state, contentId,)
            state.modes[MODES.REVIEWING].contentId = contentId
        } else {
            console.log('state not in reviewing mode')
        }

        // if (this.reviewing()){
        // }
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