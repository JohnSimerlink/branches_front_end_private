import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableBranchesMap, IBranchesMap, IBranchesMapData,
    CONTENT_TYPES, ISyncableMutableSubscribableBranchesMap, timestamp, IBranchesMapDataFromDB
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableBranchesMap} from '../../objects/branchesMap/MutableSubscribableBranchesMap';
import {BranchesMapDeserializer} from './BranchesMapDeserializer';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {SyncableMutableSubscribableBranchesMap} from '../../objects/branchesMap/SyncableMutableSubscribableBranchesMap';
//
// myContainerLoadAllModules()
// test('BranchesMapDeserializer::: deserialize should deserialize properly', (t) => {
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
//     t.pass()
// })
