import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {injectionWorks} from '../../testHelpers/testHelpers';
import {myContainer} from '../../../inversify.config';
import {TYPES} from '../types';
import {SigmaUpdater, SigmaUpdaterArgs} from './sigmaUpdater';
import {ISigmaUpdater} from '../interfaces';
import {expect} from 'chai'
import * as sinon from 'sinon'
import {error} from '../../core/log'
import BranchesStore, {MUTATION_NAMES} from '../../core/store2'
import {log} from '../../core/log'
// import Graph = SigmaJs.Graph;
// import Edge = SigmaJs.Edge;
// import {SigmaJs} from 'sigmajs';

test('DI constructor should work', (t) => {
    const injects = injectionWorks<SigmaUpdaterArgs, ISigmaUpdater>({
        container: myContainer,
        argsType: TYPES.SigmaUpdaterArgs,
        interfaceType: TYPES.ISigmaUpdater,
    })
    expect(injects).to.equal(true)
    t.pass()

})

test('AddNode should call store.commit with add node mutation', (t) => {
    const node /*: SigmaJs.Node */ = {id: '53234'} /* as SigmaJs.Node */
    // const store = new BranchesStore()
    const store = {
        commit(mutationName, arg) {
        }
    }
    const sigmaUpdater: ISigmaUpdater = new SigmaUpdater(
        {store}
        )
    const storeCommitSpy = sinon.spy(store, 'commit')
    sigmaUpdater.addNode(node)

    expect(storeCommitSpy.callCount).to.deep.equal(1)
    const mutationName = storeCommitSpy.getCall(0).args[0]
    const commitArg = storeCommitSpy.getCall(0).args[1]
    expect(mutationName).to.deep.equal(MUTATION_NAMES.ADD_NODE)
    expect(commitArg).to.deep.equal(node)
    t.pass()

})
