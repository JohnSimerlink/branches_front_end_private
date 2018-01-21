// tslint:disable object-literal-sort-keys
import {injectFakeDom} from '../../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../../inversify.config';
import {CONTENT_ID2, TREE_ID} from '../../../testHelpers/testHelpers';
import {MutableSubscribableField} from '../../field/MutableSubscribableField';
import {
    FieldMutationTypes,
    IIdProppedDatedMutation, IMutableSubscribableTree, IMutableSubscribableTreeStore, IProppedDatedMutation,
    ISubscribableStoreSource, ISubscribableTreeStoreSource,
    TreePropertyMutationTypes,
    TreePropertyNames
} from '../../interfaces';
import {SubscribableMutableStringSet} from '../../set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../../tree/MutableSubscribableTree';
import {TYPES} from '../../types';
import {MutableSubscribableTreeStore} from './MutableSubscribableTreeStore';

test('MutableSubscribableTreeStore > addMutation::::addMutation to storeSource' +
    ' should call addMutation on the appropriate item,' +
    ' and with a modified mutation argument that no longer has the id', (t) => {
    const contentIdVal = CONTENT_ID2
    const contentId = new MutableSubscribableField<string>({field: contentIdVal })
    const parentId = new MutableSubscribableField<string>({field: 'adf12356' })
    const children = new SubscribableMutableStringSet()
    const id = TREE_ID
    const tree = new MutableSubscribableTree({
        id, contentId, parentId, children, updatesCallbacks: [],
    })

    const storeSource: ISubscribableTreeStoreSource
        = myContainer.get<ISubscribableTreeStoreSource>
    (TYPES.ISubscribableTreeStoreSource)
    storeSource.set(TREE_ID, tree)

    const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore({
        storeSource,
        updatesCallbacks: []
    })
    const treeAddMutationSpy = sinon.spy(tree, 'addMutation')

    const NEW_CONTENT_ID = CONTENT_ID2
    const proppedMutation: IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames> = {
        data: NEW_CONTENT_ID,
        propertyName: TreePropertyNames.CONTENT_ID,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }

    const sampleMutation: IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames> = {
        ...proppedMutation,
        id,
    }

    treeStore.addMutation(sampleMutation)

    expect(treeAddMutationSpy.callCount).to.equal(1)
    const calledWith = treeAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(proppedMutation)
    t.pass()
})
test('MutableSubscribableTreeStore > addMutation::::addMutation' +
    ' to storeSource that doesn\'t contain the item (and I guess couldn\'t load it on the fly' +
    ' it either, should throw a RangeError', (t) => {

    const nonExistentId = 'abdf1295'

    const storeSource: ISubscribableTreeStoreSource
        = myContainer.get<ISubscribableTreeStoreSource>
    (TYPES.ISubscribableTreeStoreSource)

    const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore({
        storeSource,
        updatesCallbacks: []
    })

    const NEW_CONTENT_ID = CONTENT_ID2
    const proppedMutation: IProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames> = {
        data: NEW_CONTENT_ID,
        propertyName: TreePropertyNames.CONTENT_ID,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }

    const sampleMutation: IIdProppedDatedMutation<TreePropertyMutationTypes, TreePropertyNames> = {
        ...proppedMutation,
        id: nonExistentId,
    }

    expect(() => treeStore.addMutation(sampleMutation)).to.throw(RangeError)
    t.pass()
})
