import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {stringArrayToSet} from '../../core/newUtils';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
    IHash, IMutableSubscribableContentUser, IContentUser, IContentUserData, ISyncableMutableSubscribableContentUser,
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableContentUser} from '../../objects/contentUser/MutableSubscribableContentUser';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
import {SyncableMutableSubscribableContentUser} from '../../objects/contentUser/SyncableMutableSubscribableContentUser';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {
    sampleContentUser1, sampleContentUserData1,
    sampleContentUserId1
} from '../../objects/contentUser/ContentUserHelpers';

myContainerLoadAllModules()
test('ContentUserDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
    // const overdueVal = true
    // const lastRecordedStrengthVal = 30
    // const proficiencyVal = PROFICIENCIES.TWO
    // const timerVal = 30
    // const id = 'abcde_12345'
    //
    // const contentUserData: IContentUserData = {
    //     id,
    //     overdue: overdueVal,
    //     lastEstimatedStrength: lastRecordedStrengthVal,
    //     proficiency: proficiencyVal,
    //     timer: timerVal
    // }

    // const overdue = new MutableSubscribableField<boolean>({field: overdueVal})
    // const lastEstimatedStrength = new MutableSubscribableField<number>({field: lastRecordedStrengthVal})
    // const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal})
    // const timer = new MutableSubscribableField<number>({field: timerVal})
    // const expectedContentUser: ISyncableMutableSubscribableContentUser = new SyncableMutableSubscribableContentUser(
    //     {updatesCallbacks: [], id, overdue, lastEstimatedStrength, proficiency, timer}
    // )
    const deserializedContentUser: IMutableSubscribableContentUser
        = ContentUserDeserializer.deserialize({id: sampleContentUserId1, contentUserData: sampleContentUserData1})
    expect(deserializedContentUser).to.deep.equal(sampleContentUser1)
    t.pass()
})
