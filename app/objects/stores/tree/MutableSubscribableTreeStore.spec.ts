// tslint:disable object-literal-sort-keys
import {expect} from 'chai'
import * as sinon from 'sinon'
import {CONTENT_ID2, TREE_ID} from '../../../testHelpers/testHelpers';
import {SubscribableMutableField} from '../../field/SubscribableMutableField';
import {
    FieldMutationTypes,
    IIdProppedDatedMutation, IMutableSubscribableTreeStore, IProppedDatedMutation, TreePropertyMutationTypes,
    TreePropertyNames
} from '../../interfaces';
import {SubscribableMutableStringSet} from '../../set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../../tree/MutableSubscribableTree';
import {MutableSubscribableTreeStore} from './MutableSubscribableTreeStore';

describe('MutableSubscribableTreeStore > addMutation', () => {
    it('addMutation to store should call addMutation on the appropriate item,' +
        ' and with a modified mutation argument that no longer has the id', () => {
        const contentIdVal = CONTENT_ID2
        const contentId = new SubscribableMutableField<string>({field: contentIdVal })
        const parentId = new SubscribableMutableField<string>({field: 'adf12356' })
        const children = new SubscribableMutableStringSet()
        const id = TREE_ID
        const tree = new MutableSubscribableTree({
            id, contentId, parentId, children, updatesCallbacks: [],
        })
        const store = {}
        store[TREE_ID] = tree
        const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore({
            store,
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
    })
    it('addMutation to store that doesn\'t contain the item (and I guess couldn\'t load it on the fly' +
        ' it either, should throw a RangeError', () => {

        const nonExistentId = 'abdf1295'
        const store = {}
        const treeStore: IMutableSubscribableTreeStore = new MutableSubscribableTreeStore({
            store,
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

    })
})
