import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../../inversify.config';
import {MutableSubscribableField} from '../../field/MutableSubscribableField';
import {
    FieldMutationTypes, IProficiencyStats, IProppedDatedMutation, ISubscribableTreeUserStore,
    TreeUserPropertyNames
} from '../../interfaces';
import {PROFICIENCIES} from '../../proficiency/proficiencyEnum';
import {MutableSubscribableTreeUser} from '../../treeUser/MutableSubscribableTreeUser';
import {TYPES} from '../../types';

myContainerLoadAllModules()
test('SubscribableTreeUserStore > addAndSubscribeToItem:::' +
    'An update in a member treeUser should be published to a subscriber of the treeUser data stores', (t) => {
    const proficiencyStats = new MutableSubscribableField<IProficiencyStats>()
    const aggregationTimer = new MutableSubscribableField<number>()
    const TREE_ID = 'efa123'
    const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})
    // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
    const treeUserStore: ISubscribableTreeUserStore
        = myContainer.get<ISubscribableTreeUserStore>(TYPES.ISubscribableTreeUserStore)
    const callback1 = sinon.spy()
    const callback2 = sinon.spy()

    treeUserStore.onUpdate(callback2)
    treeUserStore.onUpdate(callback1)
    treeUserStore.startPublishing()
    treeUserStore.addAndSubscribeToItem(TREE_ID, treeUser)

    const sampleMutation: IProppedDatedMutation<FieldMutationTypes, TreeUserPropertyNames> = {
        data: PROFICIENCIES.TWO,
        propertyName: TreeUserPropertyNames.PROFICIENCY_STATS,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }

    treeUser.addMutation(sampleMutation)

    const treeUserNewVal = treeUser.val()
    expect(callback1.callCount).to.equal(1)
    expect(callback1.getCall(0).args[0].id).to.equal(TREE_ID)
    expect(callback1.getCall(0).args[0].val).to.deep.equal(treeUserNewVal)
    expect(callback2.callCount).to.equal(1)
    expect(callback2.getCall(0).args[0].id).to.equal(TREE_ID)
    expect(callback2.getCall(0).args[0].val).to.deep.equal(treeUserNewVal)
    t.pass()

})
