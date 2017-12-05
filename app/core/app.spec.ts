import {expect} from 'chai'
import * as sinon from 'sinon'
import {
    IApp,
    IMutableSubscribableGlobalStore, IMutableSubscribableTreeStore, ISubscribableContentUserStore,
    IUI
} from '../objects/interfaces';
import {SubscribableContentUserStore} from '../objects/stores/contentUser/SubscribableContentUserStore';
import {MutableSubscribableGlobalStore} from '../objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from '../objects/stores/tree/MutableSubscribableTreeStore';
import {App} from './app';

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

        const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore( {
            store: {},
            updatesCallbacks: []
        })

        const contentUserStore: ISubscribableContentUserStore = new SubscribableContentUserStore({
            store: {},
            updatesCallbacks: []
        })

        const store: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore(
            {
                contentUserStore,
                treeStore,
                updatesCallbacks: [],
            }
        )

        const app: IApp = new App({store, UIs})
        app.start()
        const UI1SubscribeSpyCalledWith = UI1SubscribeSpy.getCall(0).args[0]
        expect(UI1SubscribeSpyCalledWith).to.deep.equal(store)
        expect(UI1SubscribeSpy.callCount).to.deep.equal(1)

        const UI2SubscribeSpyCalledWith = UI2SubscribeSpy.getCall(0).args[0]
        expect(UI2SubscribeSpyCalledWith).to.deep.equal(store)
        expect(UI2SubscribeSpy.callCount).to.deep.equal(1)

    })
    it('Should subscribe the uis to the updates in the store (DI for subcomponents)', () => {
        // const UI1mock: IUI = {
        //     subscribe() {}
        // }
        // const UI2mock: IUI = {
        //     subscribe() {}
        // }
        // const UIs = [UI1mock, UI2mock]
        // const store: IMutableSubscribableGlobalStore = new MutableSubscribableGlobalStore({contentUserStore})
        // const app: IApp = new App()
    })
})
