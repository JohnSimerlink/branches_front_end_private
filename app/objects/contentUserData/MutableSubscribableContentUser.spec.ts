import {expect} from 'chai'
import * as sinon from 'sinon'
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    ContentUserPropertyNames,
    FieldMutationTypes, IDatedMutation, IProppedDatedMutation, ISubscribableMutableField,
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MutableSubscribableContentUser} from './MutableSubscribableContentUser';

describe('MutableSubscribableContentUser', () => {
    it('a mutation in one of the subscribable properties' +
        ' should publish an update of the entire object\'s value '
        + ' after startPublishing has been called', () => {
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
         // TODO: figure out why DI puts in a bad updatesCallback!
        */
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
    })

    it('a mutation in one of the subscribable properties' +
        ' should NOT publish an update of the entire object\'s value'
        + ' before startPublishing has been called', () => {
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
    })
    it('addMutation ' +
        ' should call addMutation on the appropriate descendant property' +
        'and that mutation called on the descendant property should no longer have the propertyName on it', () => {
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
    //
    })
})
