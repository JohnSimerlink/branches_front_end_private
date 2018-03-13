import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {myContainer, myContainerLoadAllModules} from '../../../inversify.config';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
    IContentUserData,
    ISubscribableContentUser,
    IMutableSubscribableField,
    ISubscribableMutableStringSet, timestamp,
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';
import {SubscribableContentUser} from './SubscribableContentUser';

myContainerLoadAllModules();
test('SubscribableContentUser:::constructor should set all the subscribable properties', (t) => {
    const contentUserId = 'abcde12345_defgh1234567';
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastInteractionTimeVal = Date.now();
    const overdue = new MutableSubscribableField<boolean>({field: false});
    const lastRecordedStrength = new MutableSubscribableField<number>({field: 45});
    const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO});
    const timer = new MutableSubscribableField<number>({field: 30});
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});
    const contentUser: ISubscribableContentUser = new SubscribableContentUser({
        id: contentUserId, lastEstimatedStrength: lastRecordedStrength, overdue, proficiency, timer,
        lastInteractionTime, nextReviewTime, updatesCallbacks: [],
    });
    expect(contentUser.overdue).to.deep.equal(overdue);
    expect(contentUser.timer).to.deep.equal(timer);
    expect(contentUser.proficiency).to.deep.equal(proficiency);
    expect(contentUser.lastEstimatedStrength).to.deep.equal(lastRecordedStrength);
    expect(contentUser.lastInteractionTime).to.deep.equal(proficiency);
    expect(contentUser.lastEstimatedStrength).to.deep.equal(lastRecordedStrength);
    t.pass()
});
test('SubscribableContentUser:::.val() should display the value of the object', (t) => {
    const contentUserId = 'abcde12345_defgh1234567';
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastInteractionTimeVal = Date.now();
    const lastRecordedStrength = new MutableSubscribableField<number>({field: 45});
    const overdue = new MutableSubscribableField<boolean>({field: false});
    const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO});
    const timer = new MutableSubscribableField<number>({field: 30});
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});
    const contentUser = new SubscribableContentUser({
        id: contentUserId, lastEstimatedStrength: lastRecordedStrength, overdue, proficiency, timer,
        lastInteractionTime, nextReviewTime, updatesCallbacks: [],
    });

    const expectedVal: IContentUserData = {
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrength.val(),
        overdue: overdue.val(),
        proficiency: proficiency.val(),
        timer: timer.val(),
        lastInteractionTime: lastInteractionTime.val(),
        nextReviewTime: nextReviewTime.val(),
    };

    expect(contentUser.val()).to.deep.equal(expectedVal);
    t.pass()
});
test('SubscribableContentUser:::startPublishing() should call the onUpdate methods' +
    ' of all member Subscribable properties', (t) => {
    const contentUserId = 'abcde12345_defgh1234567';
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastInteractionTimeVal = Date.now();
    const lastRecordedStrength = new MutableSubscribableField<number>({field: 45});
    const overdue = new MutableSubscribableField<boolean>({field: false});
    const proficiency = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO});
    const timer = new MutableSubscribableField<number>({field: 30});
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});
    const contentUser = new SubscribableContentUser({
        id: contentUserId, lastEstimatedStrength: lastRecordedStrength, overdue, proficiency, timer,
        lastInteractionTime, nextReviewTime, updatesCallbacks: [],
    });

    const lastRecordedStrengthOnUpdateSpy = sinon.spy(lastRecordedStrength, 'onUpdate');
    const overdueOnUpdateSpy = sinon.spy(overdue, 'onUpdate');
    const proficiencyOnUpdateSpy = sinon.spy(proficiency, 'onUpdate');
    const timerOnUpdateSpy = sinon.spy(timer, 'onUpdate');

    contentUser.startPublishing();
    expect(overdueOnUpdateSpy.callCount).to.deep.equal(1);
    expect(lastRecordedStrengthOnUpdateSpy.callCount).to.deep.equal(1);
    expect(timerOnUpdateSpy.callCount).to.deep.equal(1);
    expect(proficiencyOnUpdateSpy.callCount).to.deep.equal(1);
    t.pass()
});
