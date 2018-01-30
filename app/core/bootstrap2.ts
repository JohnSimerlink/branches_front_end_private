
import 'reflect-metadata'
// import {AppContainer} from './appContainer';
import Vue from 'vue';
// import AsyncComputed from 'vue-async-computed'
import VueRouter from 'vue-router'
// import KnawledgeMap, {KnawledgeMapCreator} from '../components/knawledgeMap/knawledgeMap2'
import './components2'
import {log} from './log'
// import './components.js'
import Vuex from 'vuex'
import {AppContainer} from './appContainer';
import {myContainer, myContainerLoadAllModules} from '../../inversify.config';
import {TYPES} from '../objects/types';

if (process.env.NODE_ENV === 'production') {
   log('NODE ENV IS PROD')
} else {
    log('NODE ENV IS ' + process.env.NODE_ENV)
}
myContainerLoadAllModules()
const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer)
// const appContainer = new AppContainer()
appContainer.start()
