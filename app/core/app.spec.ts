import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {
    IApp, IMutable,
    IMutableSubscribableGlobalStore, IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    ISubscribableContentStore,
    ISubscribableContentUserStore,
    IUI
} from '../objects/interfaces';
import {SubscribableContentStore} from '../objects/stores/content/SubscribableContentStore';
import {SubscribableContentUserStore} from '../objects/stores/contentUser/SubscribableContentUserStore';
import {MutableSubscribableGlobalStore} from '../objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {MutableSubscribableTreeLocationStore} from '../objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {App} from './app';
import {myContainer} from '../../inversify.config';
import {TYPES} from '../objects/types';

describe('App', () => {
    it('Should subscribe the uis to the updates in the store (Non-DI for subcomponents)', () => {
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

    })
    it('Should subscribe the uis to the updates in the storeSource (DI for subcomponents)', () => {
        // const UI1mock: IUI = {
        //     subscribe() {}
        // }
        // const UI2mock: IUI = {
        //     subscribe() {}
        // }
        // const UIs = [UI1mock, UI2mock]
        // const storeSource: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore({contentUserStore})
        // const app: IApp = new App()
    })
})
