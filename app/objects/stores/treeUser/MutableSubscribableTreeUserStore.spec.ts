// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import * as sinon from 'sinon'
import {CONTENT_ID2, TREE_ID} from '../../../testHelpers/testHelpers';
import {SubscribableMutableField} from '../../field/SubscribableMutableField';
import {
    FieldMutationTypes,
    IIdProppedDatedMutation, IMutableSubscribableTreeLocation, IMutableSubscribableTreeUser,
    IMutableSubscribableTreeUserStore, IProficiencyStats,
    IProppedDatedMutation,
    ISubscribableStoreSource,
    TreeUserPropertyMutationTypes,
    TreeUserPropertyNames
} from '../../interfaces';
import {MutableSubscribableTreeUser} from '../../treeUser/MutableSubscribableTreeUser';
import {MutableSubscribableTreeUserStore} from './MutableSubscribableTreeUserStore';
import {myContainer} from '../../../../inversify.config';
import {TYPES} from '../../types';

describe('MutableSubscribableTreeUserStore > addMutation', () => {
    it('addMutation to storeSource should call addMutation on the appropriate item,' +
        ' and with a modified mutation argument that no longer has the id', () => {
        const proficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 2,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const newProficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 6,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const aggregationTimerVal = 54
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
        const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})

        const storeSource: ISubscribableStoreSource<IMutableSubscribableTreeUser>
            = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeUser>>
        (TYPES.ISubscribableStoreSource)
        storeSource.set(TREE_ID, treeUser)

        const treeUserStore: IMutableSubscribableTreeUserStore = new MutableSubscribableTreeUserStore({
            storeSource,
            updatesCallbacks: []
        })
        const treeUserAddMutationSpy = sinon.spy(treeUser, 'addMutation')

        const id = TREE_ID
        const proppedMutation: IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
            data: newProficiencyStatsVal,
            propertyName: TreeUserPropertyNames.PROFICIENCY_STATS,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
        }

        const sampleMutation: IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
            ...proppedMutation,
            id, //
        }

        treeUserStore.addMutation(sampleMutation)

        expect(treeUserAddMutationSpy.callCount).to.equal(1)
        const calledWith = treeUserAddMutationSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(proppedMutation)
    })
    it('addMutation to storeSource that doesn\'t contain the item (and I guess couldn\'t load it on the fly' +
        ' it either, should throw a RangeError', () => {

        const nonExistentId = 'abdf1295'

        const storeSource: ISubscribableStoreSource<IMutableSubscribableTreeUser>
            = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeUser>>
        (TYPES.ISubscribableStoreSource)

        const treeUserStore: IMutableSubscribableTreeUserStore = new MutableSubscribableTreeUserStore({
            storeSource,
            updatesCallbacks: []
        })

        const proppedMutation: IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
            data: 1234,
            propertyName: TreeUserPropertyNames.AGGREGATION_TIMER,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
        }

        const sampleMutation: IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
            ...proppedMutation,
            id: nonExistentId,
        }

        expect(() => treeUserStore.addMutation(sampleMutation)).to.throw(RangeError)

    })
})
