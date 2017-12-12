// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import * as sinon from 'sinon'
import {TREE_ID} from '../../../testHelpers/testHelpers';
import {
    IIdProppedDatedMutation, IMutableSubscribableTreeLocationStore, IProppedDatedMutation,
    IMutableSubscribablePoint, PointMutationTypes,
    TreeLocationPropertyMutationTypes,
    TreeLocationPropertyNames, ISubscribableStoreSource, IMutableSubscribableTreeLocation, IMutableSubscribableTreeStore
} from '../../interfaces';
import {MutableSubscribablePoint} from '../../point/MutableSubscribablePoint';
import {MutableSubscribableTreeLocation} from '../../treeLocation/MutableSubscribableTreeLocation';
import {MutableSubscribableTreeLocationStore} from './MutableSubscribableTreeLocationStore';
import {myContainer} from '../../../../inversify.config';
import {TYPES} from '../../types';
import {MutableSubscribableTreeStore} from '../tree/MutableSubscribableTreeStore';

describe('MutableSubscribableTreeLocationStore > addMutation', () => {
    it('addMutation to storeSource should call addMutation on the appropriate item,' +
        ' and with a modified mutation argument that no longer has the id', () => {

        const treeId = TREE_ID
        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const MUTATION_VALUE = {delta: {x: 3, y: 4}}
        const point: IMutableSubscribablePoint
            = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

        const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})

        const storeSource: ISubscribableStoreSource<IMutableSubscribableTreeLocation>
            = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>
        (TYPES.ISubscribableStoreSource)
        storeSource.set(TREE_ID, treeLocation)

        const treeLocationStore: IMutableSubscribableTreeLocationStore = new MutableSubscribableTreeLocationStore({
            storeSource,
            updatesCallbacks: []
        })

        const treeLocationAddMutationSpy = sinon.spy(treeLocation, 'addMutation')

        const id = TREE_ID
        const proppedMutation: IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
            data: MUTATION_VALUE,
            propertyName: TreeLocationPropertyNames.POINT,
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }

        const sampleMutation: IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
            ...proppedMutation,
            id, //
        }

        treeLocationStore.addMutation(sampleMutation)

        expect(treeLocationAddMutationSpy.callCount).to.equal(1)
        const calledWith = treeLocationAddMutationSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(proppedMutation)
    })
    it('addMutation to storeSource that doesn\'t contain the item (and I guess couldn\'t load it on the fly either' +
        ', should throw a RangeError', () => {

        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const MUTATION_VALUE = {delta: {x: 3, y: 4}}
        const point: IMutableSubscribablePoint
            = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

        const storeSource: ISubscribableStoreSource<IMutableSubscribableTreeLocation>
            = myContainer.get<ISubscribableStoreSource<IMutableSubscribableTreeLocation>>
        (TYPES.ISubscribableStoreSource)

        const treeLocationStore: IMutableSubscribableTreeLocationStore = new MutableSubscribableTreeLocationStore({
            storeSource,
            updatesCallbacks: []
        })

        const id = TREE_ID
        const proppedMutation: IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
            data: MUTATION_VALUE,
            propertyName: TreeLocationPropertyNames.POINT,
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }

        const sampleMutation: IIdProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
            ...proppedMutation,
            id, //
        }

        expect(() => treeLocationStore.addMutation(sampleMutation)).to.throw(RangeError)

    })
})
