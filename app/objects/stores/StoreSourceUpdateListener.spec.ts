import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {injectionWorks} from '../../testHelpers/testHelpers';
import {IStoreSourceUpdateListener, ISubscribable, ITypeAndIdAndValUpdate} from '../interfaces';
import {TYPES} from '../types';
import {StoreSourceUpdateListenerArgs} from './StoreSourceUpdateListener';

injectFakeDom();

myContainerLoadAllModules({fakeSigma: true});
test('StoreSourceUpdateListener:::DI constructor should work', (t) => {
    const injects = injectionWorks<StoreSourceUpdateListenerArgs, IStoreSourceUpdateListener>({
        container: myContainer,
        argsType: TYPES.StoreSourceUpdateListenerArgs,
        interfaceType: TYPES.IStoreSourceUpdateListener,
    });
    expect(injects).to.equal(true);
    t.pass();
});
test('StoreSourceUpdateListener:::subscribe', (t) => {
    const subscribable: ISubscribable<ITypeAndIdAndValUpdate> = {
        onUpdate() {
        }
    };
    const subscribableUpdateSpy = sinon.spy(subscribable, 'onUpdate');
    const storeSourceUpdateListener: IStoreSourceUpdateListener =
        myContainer.get<IStoreSourceUpdateListener>(TYPES.IStoreSourceUpdateListener);

    expect(subscribableUpdateSpy.callCount).to.equal(0);
    storeSourceUpdateListener.subscribe(subscribable);
    expect(subscribableUpdateSpy.callCount).to.equal(1);
    t.pass();
});
