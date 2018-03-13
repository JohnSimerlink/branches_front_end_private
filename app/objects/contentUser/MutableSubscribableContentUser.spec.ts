import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom();
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames,
    FieldMutationTypes, IContentUserData, IDatedMutation, IProppedDatedMutation, IMutableSubscribableField, timestamp,
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MutableSubscribableContentUser} from './MutableSubscribableContentUser';
import {myContainerLoadAllModules} from '../../../inversify.config';

myContainerLoadAllModules();
test('OverdueListener:::.val() should work after constructor', (t) => {
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
     // TODO: figure out why DI puts in a bad IUpdatesCallback!
    */

    const contentUserId = 'abc_123';
    const lastRecordedStrengthVal = 45;
    const overdueVal = true;
    const proficiencyVal = PROFICIENCIES.THREE;
    const timerVal = 1003;
    const lastInteractionTimeVal = Date.now();
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastRecordedStrength: IMutableSubscribableField<number>
        = new MutableSubscribableField<number>({field: lastRecordedStrengthVal});
    const overdue: IMutableSubscribableField<boolean>
        = new MutableSubscribableField<boolean>({field: overdueVal});
    const proficiency: IMutableSubscribableField<PROFICIENCIES>
        = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal});
    const timer: IMutableSubscribableField<number> = new MutableSubscribableField<number>({field: timerVal});
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});

    const contentUser = new MutableSubscribableContentUser({
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        lastInteractionTime,
        nextReviewTime,
        updatesCallbacks: [],
    });
    const expectedContentUserData: IContentUserData = {
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrengthVal,
        overdue: overdueVal,
        proficiency: proficiencyVal,
        timer: timerVal,
        lastInteractionTime: lastInteractionTimeVal,
        nextReviewTime: nextReviewTimeVal,
    };
    const contentUserData: IContentUserData = contentUser.val();
    expect(contentUserData).to.deep.equal(expectedContentUserData);
    t.pass()
});
test('OverdueListener:::.val() should give appropiate value ' +
    'after ADD MUTATION SET lastEstimatedStrength', (t) => {
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
    // TODO: figure out why DI puts in a bad IUpdatesCallback!
    */

    const contentUserId = 'abc_123';
    const lastRecordedStrengthVal = 45;
    const newRecordedStrengthVal = 48;
    const overdueVal = true;
    const proficiencyVal = PROFICIENCIES.THREE;
    const timerVal = 1003;
    const lastInteractionTimeVal = Date.now();
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastRecordedStrength: IMutableSubscribableField<number>
        = new MutableSubscribableField<number>({field: lastRecordedStrengthVal});
    const overdue: IMutableSubscribableField<boolean>
        = new MutableSubscribableField<boolean>({field: overdueVal});
    const proficiency: IMutableSubscribableField<PROFICIENCIES>
        = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal});
    const timer: IMutableSubscribableField<number> = new MutableSubscribableField<number>({field: timerVal});
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});

    const contentUser = new MutableSubscribableContentUser({
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        lastInteractionTime,
        nextReviewTime,
        updatesCallbacks: [],
    });
    const mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: newRecordedStrengthVal,
        propertyName: ContentUserPropertyNames.LAST_ESTIMATED_STRENGTH,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    };
    const expectedContentUserData: IContentUserData = {
        id: contentUserId,
        lastEstimatedStrength: newRecordedStrengthVal,
        overdue: overdueVal,
        proficiency: proficiencyVal,
        timer: timerVal,
        lastInteractionTime: lastInteractionTimeVal,
        nextReviewTime: nextReviewTimeVal,
    };
    contentUser.addMutation(mutation);
    const contentUserData: IContentUserData = contentUser.val();
    expect(contentUserData).to.deep.equal(expectedContentUserData);
    t.pass()
});

test('OverdueListener:::.val() should give appropiate value after ADD MUTATION SET overdueVal', (t) => {
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
    // TODO: figure out why DI puts in a bad IUpdatesCallback!
    */

    const lastRecordedStrengthVal = 45;
    const overdueVal = true;
    const newOverdueVal = false;
    const proficiencyVal = PROFICIENCIES.THREE;
    const timerVal = 1003;
    const lastInteractionTimeVal = Date.now();
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastRecordedStrength: IMutableSubscribableField<number>
        = new MutableSubscribableField<number>({field: lastRecordedStrengthVal});
    const overdue: IMutableSubscribableField<boolean>
        = new MutableSubscribableField<boolean>({field: overdueVal});
    const proficiency: IMutableSubscribableField<PROFICIENCIES>
        = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal});
    const timer: IMutableSubscribableField<number> = new MutableSubscribableField<number>({field: timerVal});
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});

    const contentUserId = 'abc_123';

    const contentUser = new MutableSubscribableContentUser({
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        lastInteractionTime,
        nextReviewTime,
        updatesCallbacks: [],
    });
    const mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: newOverdueVal,
        propertyName: ContentUserPropertyNames.OVERDUE,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    };
    const expectedContentUserData: IContentUserData = {
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrengthVal,
        overdue: newOverdueVal,
        proficiency: proficiencyVal,
        timer: timerVal,
        lastInteractionTime: lastInteractionTimeVal,
        nextReviewTime: nextReviewTimeVal,
    };
    contentUser.addMutation(mutation);
    const contentUserData: IContentUserData = contentUser.val();
    expect(contentUserData).to.deep.equal(expectedContentUserData);
    t.pass()
});

test('OverdueListener:::.val() should give appropiate value' +
    ' after ADD MUTATION SET sampleContentUser1Proficiency', (t) => {
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
    // TODO: figure out why DI puts in a bad IUpdatesCallback!
    */

    const contentUserId = 'abc_123';
    const lastRecordedStrengthVal = 45;
    const overdueVal = true;
    const proficiencyVal = PROFICIENCIES.THREE;
    const newProficiencyVal = PROFICIENCIES.TWO;
    const timerVal = 1003;
    const lastInteractionTimeVal = Date.now();
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastRecordedStrength: IMutableSubscribableField<number>
        = new MutableSubscribableField<number>({field: lastRecordedStrengthVal});
    const overdue: IMutableSubscribableField<boolean>
        = new MutableSubscribableField<boolean>({field: overdueVal});
    const proficiency: IMutableSubscribableField<PROFICIENCIES>
        = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal});
    const timer: IMutableSubscribableField<number> = new MutableSubscribableField<number>({field: timerVal});
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});

    const contentUser = new MutableSubscribableContentUser({
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        lastInteractionTime,
        nextReviewTime,
        updatesCallbacks: [],
    });
    const mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: newProficiencyVal,
        propertyName: ContentUserPropertyNames.PROFICIENCY,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    };
    const expectedContentUserData: IContentUserData = {
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrengthVal,
        overdue: overdueVal,
        proficiency: newProficiencyVal,
        timer: timerVal,
        lastInteractionTime: lastInteractionTimeVal,
        nextReviewTime: nextReviewTimeVal,
    };
    contentUser.addMutation(mutation);
    const contentUserData: IContentUserData = contentUser.val();
    expect(contentUserData).to.deep.equal(expectedContentUserData);
    t.pass()
});

test('OverdueListener:::.val() should give appropiate value after ADD MUTATION SET sampleContentUser1Timer', (t) => {
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
    // TODO: figure out why DI puts in a bad IUpdatesCallback!
    */
    const contentUserId = 'abc_123';
    const lastRecordedStrengthVal = 45;
    const overdueVal = true;
    const proficiencyVal = PROFICIENCIES.THREE;
    const timerVal = 1003;
    const newTimerVal = 1004;
    const lastInteractionTimeVal = Date.now();
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastRecordedStrength: IMutableSubscribableField<number>
        = new MutableSubscribableField<number>({field: lastRecordedStrengthVal});
    const overdue: IMutableSubscribableField<boolean>
        = new MutableSubscribableField<boolean>({field: overdueVal});
    const proficiency: IMutableSubscribableField<PROFICIENCIES>
        = new MutableSubscribableField<PROFICIENCIES>({field: proficiencyVal});
    const timer: IMutableSubscribableField<number> = new MutableSubscribableField<number>({field: timerVal});
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});

    const contentUser = new MutableSubscribableContentUser({
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        lastInteractionTime,
        nextReviewTime,
        updatesCallbacks: [],
    });
    const mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: newTimerVal,
        propertyName: ContentUserPropertyNames.TIMER,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    };
    const expectedContentUserData: IContentUserData = {
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrengthVal,
        overdue: overdueVal,
        proficiency: proficiencyVal,
        timer: newTimerVal,
        lastInteractionTime: lastInteractionTimeVal,
        nextReviewTime: nextReviewTimeVal,
    };
    contentUser.addMutation(mutation);
    const contentUserData: IContentUserData = contentUser.val();
    expect(contentUserData).to.deep.equal(expectedContentUserData);
    t.pass()
});

test('OverdueListener:::a mutation in one of the subscribable properties' +
    ' should publish an update of the entire object\'s value '
    + ' after startPublishing has been called', (t) => {
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
     // TODO: figure out why DI puts in a bad IUpdatesCallback!
    */
    const contentUserId = 'abc_123';
    const lastInteractionTimeVal = Date.now();
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastRecordedStrength: IMutableSubscribableField<number>
        = new MutableSubscribableField<number>({field: 60});
    const overdue: IMutableSubscribableField<boolean> = new MutableSubscribableField<boolean>({field: false});
    const proficiency: IMutableSubscribableField<PROFICIENCIES>
        = new MutableSubscribableField<PROFICIENCIES>({field: PROFICIENCIES.TWO});
    const timer: IMutableSubscribableField<number> = new MutableSubscribableField<number>({field: 39});
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});

    const contentUser = new MutableSubscribableContentUser({
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        lastInteractionTime,
        nextReviewTime,
        updatesCallbacks: [],
    });
    contentUser.startPublishing();

    const callback = sinon.spy();
    contentUser.onUpdate(callback);

    const sampleMutation: IDatedMutation<FieldMutationTypes> = {
        data: PROFICIENCIES.THREE,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    };
    proficiency.addMutation(sampleMutation);
    const newTreeDataValue = contentUser.val();
    const calledWith = callback.getCall(0).args[0];
    expect(callback.callCount).to.equal(1);
    expect(calledWith).to.deep.equal(newTreeDataValue);
    t.pass()
});

test('OverdueListener:::a mutation in one of the subscribable properties' +
    ' should NOT publish an update of the entire branchesMap\'s value'
    + ' before startPublishing has been called', (t) => {
    const contentUserId = 'abc_123';
    const lastInteractionTimeVal = Date.now();
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastRecordedStrength: IMutableSubscribableField<number> = new MutableSubscribableField<number>();
    const overdue: IMutableSubscribableField<boolean> = new MutableSubscribableField<boolean>();
    const proficiency: IMutableSubscribableField<PROFICIENCIES> = new MutableSubscribableField<PROFICIENCIES>();
    const timer: IMutableSubscribableField<number> = new MutableSubscribableField<number>();
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});

    const contentUser = new MutableSubscribableContentUser({
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        lastInteractionTime,
        nextReviewTime,
        updatesCallbacks: [],
    });

    const callback = sinon.spy();
    contentUser.onUpdate(callback);

    const sampleMutation: IDatedMutation<FieldMutationTypes> = {
        data: PROFICIENCIES.THREE,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    };
    proficiency.addMutation(sampleMutation);
    expect(callback.callCount).to.equal(0);
    t.pass()
});
test('OverdueListener:::addMutation ' +
    ' should call addMutation on the appropriate descendant property' +
    'and that mutation called on the descendant property should no longer have the propertyName on it', (t) => {
    const contentUserId = 'abc_123';
    const lastInteractionTimeVal = Date.now();
    const nextReviewTimeVal = Date.now() + 1000 * 60;
    const lastRecordedStrength: IMutableSubscribableField<number> = new MutableSubscribableField<number>();
    const overdue: IMutableSubscribableField<boolean> = new MutableSubscribableField<boolean>();
    const proficiency: IMutableSubscribableField<PROFICIENCIES> = new MutableSubscribableField<PROFICIENCIES>();
    const timer: IMutableSubscribableField<number> = new MutableSubscribableField<number>();
    const lastInteractionTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: lastInteractionTimeVal});
    const nextReviewTime: IMutableSubscribableField<timestamp> = new MutableSubscribableField<timestamp>({field: nextReviewTimeVal});

    const contentUser = new MutableSubscribableContentUser({
        id: contentUserId,
        lastEstimatedStrength: lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        lastInteractionTime,
        nextReviewTime,
        updatesCallbacks: [],
    });

    const callback = sinon.spy();
    contentUser.onUpdate(callback);

    const mutationWithoutPropName: IDatedMutation<FieldMutationTypes> = {
        data: PROFICIENCIES.FOUR,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET
    };
    const mutation: IProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
        ...mutationWithoutPropName,
        propertyName: ContentUserPropertyNames.PROFICIENCY,
    };
    const proficiencyAddMutationSpy = sinon.spy(proficiency, 'addMutation');
    contentUser.addMutation(mutation);
    expect(proficiencyAddMutationSpy.callCount).to.equal(1);
    const calledWith = proficiencyAddMutationSpy.getCall(0).args[0];
    expect(calledWith).to.deep.equal(mutationWithoutPropName);
    t.pass()
    //
});
