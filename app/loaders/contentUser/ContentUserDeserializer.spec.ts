import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import {IMutableSubscribableContentUser,} from '../../objects/interfaces';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {
    sampleContentUser1,
    sampleContentUser1Id,
    sampleContentUserData1
} from '../../objects/contentUser/ContentUserHelpers';

injectFakeDom();

myContainerLoadAllModules({fakeSigma: true});
test('ContentUserDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
    // const overdueVal = true
    // const lastRecordedStrengthVal = 30
    // const proficiencyVal = PROFICIENCIES.TWO
    // const timerVal = 30
    // const id = 'abcde_12345'
    //
    // const contentUserData: IContentUserData = {
    //     id,
    //     sampleContentUser1Overdue: overdueVal,
    //     lastEstimatedStrength: lastRecordedStrengthVal,
    //     sampleContentUser1Proficiency: proficiencyVal,
    //     sampleContentUser1Timer: timerVal
    // }

    // const sampleContentUser1Overdue = new MutableSubscribableField<boolean>({field: overdueVal})
    // const lastEstimatedStrength = new MutableSubscribableField<number>({field: lastRecordedStrengthVal})
    // const sampleContentUser1Proficiency = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal})
    // const sampleContentUser1Timer = new MutableSubscribableField<number>({field: timerVal})
    // const expectedContentUser: ISyncableMutableSubscribableContentUser = new SyncableMutableSubscribableContentUser(
    //     {updatesCallbacks: [], id, sampleContentUser1Overdue, lastEstimatedStrength, sampleContentUser1Proficiency, sampleContentUser1Timer}
    // )
    const deserializedContentUser: IMutableSubscribableContentUser
        = ContentUserDeserializer.deserialize({id: sampleContentUser1Id, contentUserData: sampleContentUserData1});
    expect(deserializedContentUser).to.deep.equal(sampleContentUser1);
    t.pass();
});
