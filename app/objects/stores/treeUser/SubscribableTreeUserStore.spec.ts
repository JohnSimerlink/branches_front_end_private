import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../../inversify.config';
import {SubscribableMutableField} from '../../field/SubscribableMutableField';
import {
    FieldMutationTypes, IProficiencyStats, IProppedDatedMutation, ISubscribableTreeUserCore, ISubscribableTreeUserStore,
    TreeUserPropertyNames
} from '../../interfaces';
import {PROFICIENCIES} from '../../proficiency/proficiencyEnum';
import {SubscribableMutableStringSet} from '../../set/SubscribableMutableStringSet';
import {MutableSubscribableTreeUser} from '../../treeUser/MutableSubscribableTreeUser';
import {TYPES} from '../../types';
import {SubscribableTreeUserStore} from './SubscribableTreeUserStore';

describe('SubscribableTreeUserStore > addAndSubscribeToItem', () => {
    it('An update in a member treeUser should be published to a subscriber of the treeUser data stores', () => {
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>()
        const aggregationTimer = new SubscribableMutableField<number>()
        const TREE_ID = 'efa123'
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})
        // const treeUser = myContainer.get<ISubscribableTreeUser>(TYPES.ISubscribableTreeUser)
        // <<< TODO: using this dependency injection causes this entire test to fail. WHY?
        const treeUserStore: ISubscribableTreeUserStore = new SubscribableTreeUserStore({
            store: {},
            updatesCallbacks: []
        })
        const callback1 = sinon.spy()
        const callback2 = sinon.spy()

        treeUserStore.onUpdate(callback2)
        treeUserStore.onUpdate(callback1)
        treeUserStore.startPublishing()
        treeUserStore.addAndSubscribeToItem( TREE_ID, treeUser)

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

    })
})
