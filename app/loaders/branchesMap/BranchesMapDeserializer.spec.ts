import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import {expect} from 'chai';
import 'reflect-metadata';
import test from 'ava';

injectFakeDom();
//
// myContainerLoadAllModules({fakeSigma: true})
test('BranchesMapDeserializer::: deserialize should deserialize properly', (t) => {
//     const timestampToday = Date.now()
//     const everBeenActivatedValue: boolean = false
//
//     const branchesMapData: IBranchesMapData = {
//     }
//
//     const membershipExpirationDate = new MutableSubscribableField<timestamp>({field: timestampToday})
//     const everActivatedMembership = new MutableSubscribableField<boolean>({field: everBeenActivatedValue})
//     const expectedBranchesMap: ISyncableMutableSubscribableBranchesMap = new SyncableMutableSubscribableBranchesMap(
//         {updatesCallbacks: [], membershipExpirationDate, everActivatedMembership}
//     )
//     const deserializedBranchesMap: IMutableSubscribableBranchesMap =
// BranchesMapDeserializer.deserialize({branchesMapData})
//     expect(deserializedBranchesMap).to.deep.equal(expectedBranchesMap)
//     t.pass()
// })
// test('BranchesMapDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
//     const timestampToday = Date.now()
//     const everBeenActivatedValue: boolean = false
//
//     const branchesMapDataFromDB: IBranchesMapDataFromDB = {
//         membershipExpirationDate: {
//             val: timestampToday
//         },
//         everActivatedMembership: {
//             val: everBeenActivatedValue
//         }
//     }
//
//     const membershipExpirationDate = new MutableSubscribableField<timestamp>({field: timestampToday})
//     const everActivatedMembership = new MutableSubscribableField<boolean>({field: everBeenActivatedValue})
//     const expectedBranchesMap: ISyncableMutableSubscribableBranchesMap = new SyncableMutableSubscribableBranchesMap(
//         {updatesCallbacks: [], membershipExpirationDate, everActivatedMembership}
//     )
//     const deserializedBranchesMap: IMutableSubscribableBranchesMap = BranchesMapDeserializer.deserializeFromDB({branchesMapDataFromDB})
//     expect(deserializedBranchesMap).to.deep.equal(expectedBranchesMap)
	t.pass()
})
