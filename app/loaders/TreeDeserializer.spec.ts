import {expect} from 'chai'
import {stringArrayToSet} from '../core/newUtils';
import {SubscribableMutableField} from '../objects/field/SubscribableMutableField';
import {IHash, IMutableSubscribableTree, ITreeData, ITreeDataWithoutId} from '../objects/interfaces';
import {SubscribableMutableStringSet} from '../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../objects/tree/MutableSubscribableTree';
import {TreeDeserializer} from './TreeDeserializer';

describe('TreeDeserializer', () => {
    it('Should deserialize properly', () => {
        const contentIdVal = '1234'
        const parentIdVal = '041234'
        const childrenVal = ['041234', 'abd123']
        const treeData: ITreeDataWithoutId = {
            contentId: contentIdVal,
            parentId: parentIdVal,
            children: childrenVal,
        }
        const treeId = '092384'

        const contentId = new SubscribableMutableField<string>({field: contentIdVal})
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
         // TODO: figure out why DI puts in a bad updatesCallback!
        */
        const parentId = new SubscribableMutableField<string>({field: parentIdVal})
        const childrenSet: IHash<boolean> = stringArrayToSet(childrenVal)
        const children = new SubscribableMutableStringSet({set: childrenSet})
        const expectedTree: IMutableSubscribableTree = new MutableSubscribableTree(
            {updatesCallbacks: [], id: treeId, contentId, parentId, children}
        )
        const deserializedTree: IMutableSubscribableTree = TreeDeserializer.deserialize({treeData, treeId})
        expect(deserializedTree).to.deep.equal(expectedTree)
    })
})
