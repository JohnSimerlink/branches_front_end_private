import {injectFakeDom} from '../testHelpers/injectFakeDom';
injectFakeDom()
import {injectionWorks} from '../testHelpers/testHelpers';
import BranchesStore, {BranchesStoreArgs} from './store2';
import {IVuexStore} from '../objects/interfaces';
import {myContainer} from '../../inversify.config';
import {TYPES} from '../objects/types';
import {expect} from 'chai'
import test from 'ava'
const globalAny: any = global
import {log} from './log'

// NOTE don't worry about the injection works for store2
test('IDBSubscriber > DBSubscriberToTreeLocation::::subscribe' +
    ' DI constructor should work', (t) => {
    // log('global window is', globalAny.window)
    const injects = injectionWorks<BranchesStoreArgs, BranchesStore>({
        container: myContainer,
        argsType: TYPES.BranchesStoreArgs,
        interfaceType: TYPES.BranchesStore,
    })
    expect(injects).to.equal(true)
    t.pass()
})
test('store test', t => t.pass())
