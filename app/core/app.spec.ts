import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../inversify.config';
import {
    IApp, IMutable,
    IMutableSubscribableGlobalStore, IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    IUI
} from '../objects/interfaces';
import {TYPES} from '../objects/types';
import {injectionWorks} from '../testHelpers/testHelpers';
import {App, AppArgs} from './app';

myContainerLoadAllModules()
test('App:::: DI Constructor works', (t) => {


    const injects = injectionWorks<AppArgs, IApp>({
        container: myContainer,
        argsType: TYPES.AppArgs,
        interfaceType: TYPES.IApp,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('App:::::Should subscribe the uis to the updates in the store (Non-DI for subcomponents)', (t) => {

    const UI1mock: IUI = {
        subscribe() {}
    }
    const UI2mock: IUI = {
        subscribe() {}
    }
    const UIs = [UI1mock, UI2mock]
    const UI1SubscribeSpy = sinon.spy(UI1mock, 'subscribe')
    const UI2SubscribeSpy = sinon.spy(UI2mock, 'subscribe')

    const store: IMutableSubscribableGlobalStore
        = myContainer.get<IMutableSubscribableGlobalStore>(TYPES.IMutableSubscribableGlobalStore)

    const app: IApp = new App({store, UIs})
    app.start()
    const UI1SubscribeSpyCalledWith = UI1SubscribeSpy.getCall(0).args[0]
    expect(UI1SubscribeSpyCalledWith).to.deep.equal(store)
    expect(UI1SubscribeSpy.callCount).to.deep.equal(1)

    const UI2SubscribeSpyCalledWith = UI2SubscribeSpy.getCall(0).args[0]
    expect(UI2SubscribeSpyCalledWith).to.deep.equal(store)
    expect(UI2SubscribeSpy.callCount).to.deep.equal(1)
    t.pass()
})
// test('Should subscribe the uis to the updates in the storeSource (DI for subcomponents)', (t) => {
//     // const UI1mock: IUI = {
//     //     subscribe() {}
//     // }
//     // const UI2mock: IUI = {
//     //     subscribe() {}
//     // }
//     // const UIs = [UI1mock, UI2mock]
//     // const storeSource: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore({contentUserStore})
//     // const app: IApp = new App()
// })
