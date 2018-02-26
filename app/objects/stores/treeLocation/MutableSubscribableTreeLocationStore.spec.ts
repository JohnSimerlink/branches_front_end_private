// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../../inversify.config';
import {log} from '../../../core/log'
import {TREE_ID} from '../../../testHelpers/testHelpers';
import {
    IIdProppedDatedMutation, IMutableSubscribablePoint, IMutableSubscribableTreeLocation,
    IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    IProppedDatedMutation,
    ISubscribableStoreSource, ISubscribableTreeLocationStoreSource, PointMutationTypes,
    TreeLocationPropertyMutationTypes, TreeLocationPropertyNames
} from '../../interfaces';
import {MutableSubscribablePoint} from '../../point/MutableSubscribablePoint';
import {MutableSubscribableTreeLocation} from '../../treeLocation/MutableSubscribableTreeLocation';
import {TYPES} from '../../types';
import {MutableSubscribableTreeLocationStore} from './MutableSubscribableTreeLocationStore';
import {SyncableMutableSubscribableTreeLocation} from '../../treeLocation/SyncableMutableSubscribableTreeLocation';
import {getASampleTreeLocation1} from "../../treeLocation/treeLocationTestHelpers";

myContainerLoadAllModules()
test('MutableSubscribableTreeLocationStore > addMutation::::' +
    'addMutation to storeSource should call addMutation on the appropriate item,' +
    ' and with a modified mutation argument that no longer has the id', (t) => {
    const MUTATION_VALUE = {delta: {x: 3, y: 4}}

    const treeLocation = getASampleTreeLocation1()
        // new SyncableMutableSubscribableTreeLocation({updatesCallbacks: [], point})

    const storeSource: ISubscribableTreeLocationStoreSource
        = myContainer.get<ISubscribableTreeLocationStoreSource>
    (TYPES.ISubscribableTreeLocationStoreSource)
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
    t.pass()
})
test('MutableSubscribableTreeLocationStore > addMutation::::' +
    'addMutation to storeSource that doesn\'t contain the item (and I guess couldn\'t load it on the fly either' +
    ', should throw a RangeError', (t) => {

    const MUTATION_VALUE = {delta: {x: 3, y: 4}}

    const storeSource: ISubscribableTreeLocationStoreSource
        = myContainer.get<ISubscribableTreeLocationStoreSource>
    (TYPES.ISubscribableTreeLocationStoreSource)

    const treeLocationStore: IMutableSubscribableTreeLocationStore = new MutableSubscribableTreeLocationStore({
        storeSource,
        updatesCallbacks: []
    })

    const id = '90843204987432'
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
    t.pass()

})
