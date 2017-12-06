import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    ISubscribableMutableField,
    ISubscribableMutableStringSet,
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';
import {SubscribableContentUser} from './SubscribableTreeUser';

describe('SubscribableContentUser', () => {
    it('constructor should set all the subscribable properties', () => {
        const overdue = new SubscribableMutableField<boolean>({field: false})
        const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
        const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
        const timer = new SubscribableMutableField<number>({field: 30})
        const contentUser = new SubscribableContentUser({
            lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
        })
        expect(contentUser.overdue).to.deep.equal(overdue)
        expect(contentUser.timer).to.deep.equal(timer)
        expect(contentUser.proficiency).to.deep.equal(proficiency)
        expect(contentUser.lastRecordedStrength).to.deep.equal(lastRecordedStrength)
    })
    it('.val() should display the value of the object', () => {
        const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
        const overdue = new SubscribableMutableField<boolean>({field: false})
        const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
        const timer = new SubscribableMutableField<number>({field: 30})
        const contentUser = new SubscribableContentUser({
            lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
        })

        const expectedVal = {
            lastRecordedStrength: lastRecordedStrength.val(),
            overdue: overdue.val(),
            proficiency: proficiency.val(),
            timer: timer.val(),
        }

        expect(contentUser.val()).to.deep.equal(expectedVal)
    })
    it('startPublishing() should call the onUpdate methods of all member Subscribable properties', () => {
        const lastRecordedStrength = new SubscribableMutableField<number>({field: 45})
        const overdue = new SubscribableMutableField<boolean>({field: false})
        const proficiency = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
        const timer = new SubscribableMutableField<number>({field: 30})
        const contentUser = new SubscribableContentUser({
            lastRecordedStrength, overdue, proficiency, timer, updatesCallbacks: [],
        })

        const lastRecordedStrengthOnUpdateSpy = sinon.spy(lastRecordedStrength, 'onUpdate')
        const overdueOnUpdateSpy = sinon.spy(overdue, 'onUpdate')
        const proficiencyOnUpdateSpy = sinon.spy(proficiency, 'onUpdate')
        const timerOnUpdateSpy = sinon.spy(timer, 'onUpdate')

        contentUser.startPublishing()
        expect(overdueOnUpdateSpy.callCount).to.deep.equal(1)
        expect(lastRecordedStrengthOnUpdateSpy.callCount).to.deep.equal(1)
        expect(timerOnUpdateSpy.callCount).to.deep.equal(1)
        expect(proficiencyOnUpdateSpy.callCount).to.deep.equal(1)
    })
})
