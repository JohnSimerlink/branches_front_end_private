import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames,
    FieldMutationTypes, IContentUserData, IDatedMutation, IProppedDatedMutation, ISubscribableMutableField,
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MutableSubscribableContentUser} from './MutableSubscribableContentUser';

test('MutableSubscribableContentUser:::.val() should work after constructor', (t) => {
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const lastRecordedStrengthVal = 45
    const overdueVal = true
    const proficiencyVal = PROFICIENCIES.THREE
    const timerVal = 1003
    const lastRecordedStrength: ISubscribableMutableField<number>
        = new SubscribableMutableField<number>({field: lastRecordedStrengthVal})
    const overdue: ISubscribableMutableField<boolean>
        = new SubscribableMutableField<boolean>({field: overdueVal})
    const proficiency: ISubscribableMutableField<PROFICIENCIES>
        = new SubscribableMutableField<PROFICIENCIES>({field: proficiencyVal})
    const timer: ISubscribableMutableField<number> = new SubscribableMutableField<number>({field: timerVal})

    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        updatesCallbacks: [],
    })
    const expectedContentUserData: IContentUserData = {
        id: 'abcd_12345',
        lastRecordedStrength: lastRecordedStrengthVal,
        overdue: overdueVal,
        proficiency: proficiencyVal,
        timer: timerVal,
    }
    const contentUserData: IContentUserData = contentUser.val()
    expect(contentUserData).to.deep.equal(expectedContentUserData)
    t.pass()
})
test('MutableSubscribableContentUser:::.val() should give appropiate value ' +
    'after ADD MUTATION SET lastRecordedStrength', (t) => {
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
    // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const lastRecordedStrengthVal = 45
    const newRecordedStrengthVal = 48
    const overdueVal = true
    const proficiencyVal = PROFICIENCIES.THREE
    const timerVal = 1003
    const lastRecordedStrength: ISubscribableMutableField<number>
        = new SubscribableMutableField<number>({field: lastRecordedStrengthVal})
    const overdue: ISubscribableMutableField<boolean>
        = new SubscribableMutableField<boolean>({field: overdueVal})
    const proficiency: ISubscribableMutableField<PROFICIENCIES>
        = new SubscribableMutableField<PROFICIENCIES>({field: proficiencyVal})
    const timer: ISubscribableMutableField<number> = new SubscribableMutableField<number>({field: timerVal})

    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        updatesCallbacks: [],
    })
    const mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: newRecordedStrengthVal,
        propertyName: ContentUserPropertyNames.LAST_RECORDED_STRENGTH,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }
    const expectedContentUserData: IContentUserData = {
        id: 'abcd_12345',
        lastRecordedStrength: newRecordedStrengthVal,
        overdue: overdueVal,
        proficiency: proficiencyVal,
        timer: timerVal,
    }
    contentUser.addMutation(mutation)
    const contentUserData: IContentUserData = contentUser.val()
    expect(contentUserData).to.deep.equal(expectedContentUserData)
    t.pass()
})

test('MutableSubscribableContentUser:::.val() should give appropiate value after ADD MUTATION SET overdueVal', (t) => {
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
    // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const lastRecordedStrengthVal = 45
    const overdueVal = true
    const newOverdueVal = false
    const proficiencyVal = PROFICIENCIES.THREE
    const timerVal = 1003
    const lastRecordedStrength: ISubscribableMutableField<number>
        = new SubscribableMutableField<number>({field: lastRecordedStrengthVal})
    const overdue: ISubscribableMutableField<boolean>
        = new SubscribableMutableField<boolean>({field: overdueVal})
    const proficiency: ISubscribableMutableField<PROFICIENCIES>
        = new SubscribableMutableField<PROFICIENCIES>({field: proficiencyVal})
    const timer: ISubscribableMutableField<number> = new SubscribableMutableField<number>({field: timerVal})

    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        updatesCallbacks: [],
    })
    const mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: newOverdueVal,
        propertyName: ContentUserPropertyNames.OVERDUE,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }
    const expectedContentUserData: IContentUserData = {
        id: 'abcd_12345',
        lastRecordedStrength: lastRecordedStrengthVal,
        overdue: newOverdueVal,
        proficiency: proficiencyVal,
        timer: timerVal,
    }
    contentUser.addMutation(mutation)
    const contentUserData: IContentUserData = contentUser.val()
    expect(contentUserData).to.deep.equal(expectedContentUserData)
    t.pass()
})

test('MutableSubscribableContentUser:::.val() should give appropiate value' +
    ' after ADD MUTATION SET proficiency', (t) => {
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
    // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const lastRecordedStrengthVal = 45
    const overdueVal = true
    const proficiencyVal = PROFICIENCIES.THREE
    const newProficiencyVal = PROFICIENCIES.TWO
    const timerVal = 1003
    const lastRecordedStrength: ISubscribableMutableField<number>
        = new SubscribableMutableField<number>({field: lastRecordedStrengthVal})
    const overdue: ISubscribableMutableField<boolean>
        = new SubscribableMutableField<boolean>({field: overdueVal})
    const proficiency: ISubscribableMutableField<PROFICIENCIES>
        = new SubscribableMutableField<PROFICIENCIES>({field: proficiencyVal})
    const timer: ISubscribableMutableField<number> = new SubscribableMutableField<number>({field: timerVal})

    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        updatesCallbacks: [],
    })
    const mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: newProficiencyVal,
        propertyName: ContentUserPropertyNames.PROFICIENCY,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }
    const expectedContentUserData: IContentUserData = {
        id: 'abcd_12345',
        lastRecordedStrength: lastRecordedStrengthVal,
        overdue: overdueVal,
        proficiency: newProficiencyVal,
        timer: timerVal,
    }
    contentUser.addMutation(mutation)
    const contentUserData: IContentUserData = contentUser.val()
    expect(contentUserData).to.deep.equal(expectedContentUserData)
    t.pass()
})

test('MutableSubscribableContentUser:::.val() should give appropiate value after ADD MUTATION SET timer', (t) => {
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
    // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const lastRecordedStrengthVal = 45
    const overdueVal = true
    const proficiencyVal = PROFICIENCIES.THREE
    const timerVal = 1003
    const newTimerVal = 1004
    const lastRecordedStrength: ISubscribableMutableField<number>
        = new SubscribableMutableField<number>({field: lastRecordedStrengthVal})
    const overdue: ISubscribableMutableField<boolean>
        = new SubscribableMutableField<boolean>({field: overdueVal})
    const proficiency: ISubscribableMutableField<PROFICIENCIES>
        = new SubscribableMutableField<PROFICIENCIES>({field: proficiencyVal})
    const timer: ISubscribableMutableField<number> = new SubscribableMutableField<number>({field: timerVal})

    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        updatesCallbacks: [],
    })
    const mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
        data: newTimerVal,
        propertyName: ContentUserPropertyNames.TIMER,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }
    const expectedContentUserData: IContentUserData = {
        id: 'abcd_12345',
        lastRecordedStrength: lastRecordedStrengthVal,
        overdue: overdueVal,
        proficiency: proficiencyVal,
        timer: newTimerVal,
    }
    contentUser.addMutation(mutation)
    const contentUserData: IContentUserData = contentUser.val()
    expect(contentUserData).to.deep.equal(expectedContentUserData)
    t.pass()
})

test('MutableSubscribableContentUser:::a mutation in one of the subscribable properties' +
    ' should publish an update of the entire object\'s value '
    + ' after startPublishing has been called', (t) => {
    /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */
    const lastRecordedStrength: ISubscribableMutableField<number>
        = new SubscribableMutableField<number>({field: 60})
    const overdue: ISubscribableMutableField<boolean> = new SubscribableMutableField<boolean>({field: false})
    const proficiency: ISubscribableMutableField<PROFICIENCIES>
        = new SubscribableMutableField<PROFICIENCIES>({field: PROFICIENCIES.TWO})
    const timer: ISubscribableMutableField<number> = new SubscribableMutableField<number>({field: 39})

    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        updatesCallbacks: [],
    })
    contentUser.startPublishing()

    const callback = sinon.spy()
    contentUser.onUpdate(callback)

    const sampleMutation: IDatedMutation<FieldMutationTypes> = {
        data: PROFICIENCIES.THREE,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }
    proficiency.addMutation(sampleMutation)
    const newTreeDataValue = contentUser.val()
    const calledWith = callback.getCall(0).args[0]
    expect(callback.callCount).to.equal(1)
    expect(calledWith).to.deep.equal(newTreeDataValue)
    t.pass()
})

test('MutableSubscribableContentUser:::a mutation in one of the subscribable properties' +
    ' should NOT publish an update of the entire object\'s value'
    + ' before startPublishing has been called', (t) => {
    const lastRecordedStrength: ISubscribableMutableField<number> = new SubscribableMutableField<number>()
    const overdue: ISubscribableMutableField<boolean> = new SubscribableMutableField<boolean>()
    const proficiency: ISubscribableMutableField<PROFICIENCIES> = new SubscribableMutableField<PROFICIENCIES>()
    const timer: ISubscribableMutableField<number> = new SubscribableMutableField<number>()

    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        updatesCallbacks: [],
    })

    const callback = sinon.spy()
    contentUser.onUpdate(callback)

    const sampleMutation: IDatedMutation<FieldMutationTypes> = {
        data: PROFICIENCIES.THREE,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    }
    proficiency.addMutation(sampleMutation)
    expect(callback.callCount).to.equal(0)
    t.pass()
})
test('MutableSubscribableContentUser:::addMutation ' +
    ' should call addMutation on the appropriate descendant property' +
    'and that mutation called on the descendant property should no longer have the propertyName on it', (t) => {
    const lastRecordedStrength: ISubscribableMutableField<number> = new SubscribableMutableField<number>()
    const overdue: ISubscribableMutableField<boolean> = new SubscribableMutableField<boolean>()
    const proficiency: ISubscribableMutableField<PROFICIENCIES> = new SubscribableMutableField<PROFICIENCIES>()
    const timer: ISubscribableMutableField<number> = new SubscribableMutableField<number>()

    const contentUser = new MutableSubscribableContentUser({
        lastRecordedStrength,
        overdue,
        proficiency,
        timer,
        updatesCallbacks: [],
    })

    const callback = sinon.spy()
    contentUser.onUpdate(callback)

    const mutationWithoutPropName: IDatedMutation<FieldMutationTypes> = {
        data: PROFICIENCIES.FOUR,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET
    }
    const mutation: IProppedDatedMutation<FieldMutationTypes, ContentUserPropertyNames> = {
        ...mutationWithoutPropName,
        propertyName: ContentUserPropertyNames.PROFICIENCY,
    }
    const proficiencyAddMutationSpy = sinon.spy(proficiency, 'addMutation')
    contentUser.addMutation(mutation)
    expect(proficiencyAddMutationSpy.callCount).to.equal(1)
    const calledWith = proficiencyAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(mutationWithoutPropName)
    t.pass()
    //
})
