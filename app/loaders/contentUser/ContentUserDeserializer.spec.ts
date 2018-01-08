import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {stringArrayToSet} from '../../core/newUtils';
import {SubscribableMutableField} from '../../objects/field/SubscribableMutableField';
import {
    IHash, IMutableSubscribableContentUser, IContentUser, IContentUserData,
} from '../../objects/interfaces';
import {SubscribableMutableStringSet} from '../../objects/set/SubscribableMutableStringSet';
import {MutableSubscribableContentUser} from '../../objects/contentUser/MutableSubscribableContentUser';
import {ContentUserDeserializer} from './ContentUserDeserializer';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';

test('ContentUserDeserializer::: deserialize Should deserialize properly', (t) => {
    const overdueVal = true
    const lastRecordedStrengthVal = 30
    const proficiencyVal = PROFICIENCIES.TWO
    const timerVal = 30

    const contentUserData: IContentUserData = {
        overdue: overdueVal,
        lastRecordedStrength: lastRecordedStrengthVal,
        proficiency: proficiencyVal,
        timer: timerVal
    }

    const overdue = new SubscribableMutableField<boolean>({field: overdueVal})
    const lastRecordedStrength = new SubscribableMutableField<number>({field: lastRecordedStrengthVal})
    const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: proficiencyVal})
    const timer = new SubscribableMutableField<number>({field: timerVal})
    const expectedContentUser: IMutableSubscribableContentUser = new MutableSubscribableContentUser(
        {updatesCallbacks: [], overdue, lastRecordedStrength, proficiency, timer}
    )
    const deserializedContentUser: IMutableSubscribableContentUser
        = ContentUserDeserializer.deserialize({contentUserData})
    expect(deserializedContentUser).to.deep.equal(expectedContentUser)
    t.pass()
})
