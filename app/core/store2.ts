import Vue from 'vue'
import Vuex from 'vuex'
import {ROOT_ID} from './globals';
Vue.use(Vuex)

const state = {
    uri: null,
    centeredTreeId: ROOT_ID
};

const getters = {
}
const mutations = {
}
const actions = {}

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
})
export default store
