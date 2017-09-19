import Vuex from "vuex"
import Vue from "vue"
Vue.use(Vuex)

export const MODES = {
    EXPLORING: 1,
    STUDYING: 2,
}

const state = {
    mode: MODES.STUDYING,
    modes: {
        2: {
            contentId: 12345,
        }
    },
}
const getters = {
    reviewing: state => state.mode === MODES.STUDYING,
    currentReviewingItem: state => state.modes[MODES.STUDYING].contentId,
}
const mutations = {
    changeMode(state, mode){
        state.mode = mode
    },
    itemStudied(state, contentId){
        console.log('itemStudied called', state, contentId, ...arguments)
        if (getters.reviewing(state)){
            console.log('state being changed', state, contentId,)
            state.modes[MODES.STUDYING].contentId = contentId
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