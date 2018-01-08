import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {stringArrayToSet} from '../../core/newUtils';
import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {
    IHash, IMutableSubscribableTreeUser, ITreeUser, ITreeUserData, ITreeUserDataFromFirebase,
    ITreeUserDataWithoutId
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableTreeUser} from '../../objects/treeUser/MutableSubscribableTreeUser';
import {TreeUserDeserializer} from './TreeUserDeserializer';

test('TreeUserDeserializer::: deserialize Should deserialize properly', (t) => {
    const contentIdVal = '1234'
    const parentIdVal = '041234'
    const childrenVal = ['041234', 'abd123']
    const childrenSet: IHash<boolean> = stringArrayToSet(childrenVal)

    const treeUserData: ITreeUserDataFromFirebase = {
        contentId: contentIdVal,
        parentId: parentIdVal,
        children: childrenSet,
    }
    const treeUserId = '092384'

    const contentId = new SubscribableMutableField<string>({field: contentIdVal})
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const parentId = new SubscribableMutableField<string>({field: parentIdVal})
    const children = new SubscribableMutableStringSet({set: childrenSet})
    const expectedTreeUser: IMutableSubscribableTreeUser = new MutableSubscribableTreeUser(
        {updatesCallbacks: [], id: treeUserId, contentId, parentId, children}
    )
    const deserializedTreeUser: IMutableSubscribableTreeUser = TreeUserDeserializer.deserialize({treeUserData, treeUserId})
    expect(deserializedTreeUser).to.deep.equal(expectedTreeUser)
    t.pass()
})
test('TreeUserDeserializer::: convert sets to arrays should work', (t) => {
    const contentIdVal = '1234'
    const parentIdVal = '041234'
    const childrenVal = ['041234', 'abd123']
    const childrenSet: IHash<boolean> = stringArrayToSet(childrenVal)

    const treeUserData: ITreeUserDataFromFirebase = {
        contentId: contentIdVal,
        parentId: parentIdVal,
        children: childrenSet,
    }
    const expectedConvertedTreeUserData: ITreeUserDataWithoutId = {
        contentId: contentIdVal,
        parentId: parentIdVal,
        children: childrenVal,
    }
    const convertedTreeUserData: ITreeUserDataWithoutId = TreeUserDeserializer.convertSetsToArrays({treeUserData})
    expect(convertedTreeUserData).to.deep.equal(expectedConvertedTreeUserData)
    t.pass()
})
