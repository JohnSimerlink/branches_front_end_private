import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {
    ISigmaNodeCreator, IStoreSourceUpdateListener, IStoreSourceUpdateListenerCore, ISubscribable,
    ITypeAndIdAndValUpdates
} from '../interfaces';
import {TYPES} from '../types';
import {StoreSourceUpdateListener, StoreSourceUpdateListenerArgs} from './StoreSourceUpdateListener';

describe('StoreSourceUpdateListener', () => {
    it('DI constructor should work', () => {
        const injects = injectionWorks<StoreSourceUpdateListenerArgs, IStoreSourceUpdateListener>({
            container: myContainer,
            argsType: TYPES.StoreSourceUpdateListenerArgs,
            classType: TYPES.IStoreSourceUpdateListener,
        })
        expect(injects).to.equal(true)
    })
    it('subscribe', () => {
        const subscribable: ISubscribable<ITypeAndIdAndValUpdates> = {
            onUpdate() {}
        }
        const subscribableUpdateSpy = sinon.spy(subscribable, 'onUpdate')
        const storeSourceUpdateListenerCore: IStoreSourceUpdateListenerCore
            = myContainer.get<IStoreSourceUpdateListenerCore>(TYPES.IStoreSourceUpdateListenerCore)
        const storeSourceUpdateListener: IStoreSourceUpdateListener =
            new StoreSourceUpdateListener({storeSourceUpdateListenerCore})
        const expectedCalledWith = storeSourceUpdateListenerCore.receiveUpdate

        expect(subscribableUpdateSpy.callCount).to.equal(0)
        storeSourceUpdateListener.subscribe(subscribable)
        expect(subscribableUpdateSpy.callCount).to.equal(1)
        const calledWith = subscribableUpdateSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(expectedCalledWith)
    })
})
