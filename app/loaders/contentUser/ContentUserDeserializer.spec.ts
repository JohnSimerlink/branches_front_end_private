import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import {stringArrayToSet} from '../../core/newUtils';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
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
    const id = 'abcde_12345'

    const contentUserData: IContentUserData = {
        id,
        overdue: overdueVal,
        lastRecordedStrength: lastRecordedStrengthVal,
        proficiency: proficiencyVal,
        timer: timerVal
    }

    const overdue = new MutableSubscribableField<boolean>({field: overdueVal})
    const lastRecordedStrength = new MutableSubscribableField<number>({field: lastRecordedStrengthVal})
    const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal})
    const timer = new MutableSubscribableField<number>({field: timerVal})
    const expectedContentUser: IMutableSubscribableContentUser = new MutableSubscribableContentUser(
        {updatesCallbacks: [], id, overdue, lastRecordedStrength, proficiency, timer}
    )
    const deserializedContentUser: IMutableSubscribableContentUser
        = ContentUserDeserializer.deserialize({id, contentUserData})
    expect(deserializedContentUser).to.deep.equal(expectedContentUser)
    t.pass()
})
