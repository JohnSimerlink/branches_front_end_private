import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {
    ISubscribable, ISubscribableGlobalStore,
    ITypeAndIdAndValUpdates
} from '../interfaces';
import {TYPES} from '../types';
import {CanvasUI} from './CanvasUI';

myContainerLoadAllModules();
test('CanvasUI:::should subscribe to the onUpdate method of a subscribable obj passed to it', (t) => {
    const canvasUI = myContainer.get<CanvasUI>(TYPES.CanvasUI);

    const subscribable: ISubscribable<ITypeAndIdAndValUpdates>
        = myContainer.get<ISubscribableGlobalStore>(TYPES.ISubscribableGlobalStore);

    const subscribableOnUpdateSpy = sinon.spy(subscribable, 'onUpdate');

    canvasUI.subscribe(subscribable);
    expect(subscribableOnUpdateSpy.callCount).to.equal(1);
    t.pass()
});
