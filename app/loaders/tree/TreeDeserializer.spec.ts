import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {stringArrayToSet} from '../../core/newUtils';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableTree, ITree, ITreeData, ITreeDataFromFirebase,
    ITreeDataWithoutId
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTree} from '../../objects/tree/MutableSubscribableTree';
import {TreeDeserializer} from './TreeDeserializer';

test('TreeDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
    const contentIdVal = '1234'
    const parentIdVal = '041234'
    const childrenVal = ['041234', 'abd123']
    const childrenSet: IHash<boolean> = stringArrayToSet(childrenVal)

    const treeData: ITreeDataFromFirebase = {
        contentId: {
            val: contentIdVal,
        } ,
        parentId: {
            val: parentIdVal,
        } ,
        children: {
            val: childrenSet
        }
    }
    const treeId = '092384'

    const contentId = new MutableSubscribableField<string>({field: contentIdVal})
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const parentId = new MutableSubscribableField<string>({field: parentIdVal})
    const children = new SubscribableMutableStringSet({set: childrenSet})
    const expectedTree: IMutableSubscribableTree = new MutableSubscribableTree(
        {updatesCallbacks: [], id: treeId, contentId, parentId, children}
    )
    const deserializedTree: IMutableSubscribableTree = TreeDeserializer.deserializeFromDB({treeData, treeId})
    expect(deserializedTree).to.deep.equal(expectedTree)
    t.pass()
})
test('TreeDeserializer::: convert sets to arrays should work', (t) => {
    const contentIdVal = '1234'
    const parentIdVal = '041234'
    const childrenVal = ['041234', 'abd123']
    const childrenSet: IHash<boolean> = stringArrayToSet(childrenVal)

    const treeData: ITreeDataFromFirebase = {
        contentId: {
            val: contentIdVal,
        } ,
        parentId: {
            val: parentIdVal,
        } ,
        children: {
            val: childrenSet
        }
    }
    const expectedConvertedTreeData: ITreeDataWithoutId = {
        contentId: contentIdVal,
        parentId: parentIdVal,
        children: childrenVal,
    }
    const convertedTreeData: ITreeDataWithoutId = TreeDeserializer.convertSetsToArrays({treeData})
    expect(convertedTreeData).to.deep.equal(expectedConvertedTreeData)
    t.pass()
})
