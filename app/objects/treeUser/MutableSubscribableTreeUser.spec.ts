import {expect} from 'chai'
import * as sinon from 'sinon'
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    FieldMutationTypes,
    IDatedMutation, IProficiencyStats,
    IProppedDatedMutation, ISubscribableMutableField, ITreeUserData,
    TreeUserPropertyMutationTypes, TreeUserPropertyNames,
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MutableSubscribableTreeUser} from './MutableSubscribableTreeUser';

describe('MutableSubscribableTreeUser', () => {
    it('.val() should work after constructor', () => {
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
         // TODO: figure out why DI puts in a bad updatesCallback!
        */
        const proficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 2,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const aggregationTimerVal = 54
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
        const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})
        const expectedTreeUserData: ITreeUserData = {
            proficiencyStats: proficiencyStatsVal,
            aggregationTimer: aggregationTimerVal,
        }
        const treeUserData: ITreeUserData = treeUser.val()
        expect(treeUserData).to.deep.equal(expectedTreeUserData)
    })
    it('.val() should give appropiate value after ADD MUTATION SET proficiencyStats', () => {
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
        // TODO: figure out why DI puts in a bad updatesCallback!
        */
        const proficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 2,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const aggregationTimerVal = 54
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
        const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})
        const expectedTreeUserData: ITreeUserData = {
            proficiencyStats: proficiencyStatsVal,
            aggregationTimer: aggregationTimerVal,
        }
        const mutation: IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
            data: proficiencyStatsVal,
            propertyName: TreeUserPropertyNames.PROFICIENCY_STATS,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
        }
        treeUser.addMutation(mutation)
        const treeUserData: ITreeUserData = treeUser.val()
        expect(treeUserData).to.deep.equal(expectedTreeUserData)
    })

    it('.val() should give appropiate value after ADD MUTATION SET aggregationTimerVal', () => {
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
        // TODO: figure out why DI puts in a bad updatesCallback!
        */
        const proficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 2,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const aggregationTimerVal = 53
        const newAggregationTimerVal = 54
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
        const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})
        const mutation: IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
            data: newAggregationTimerVal,
            propertyName: TreeUserPropertyNames.AGGREGATION_TIMER,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
        }
        const expectedTreeUserData: ITreeUserData = {
            proficiencyStats: proficiencyStatsVal,
            aggregationTimer: newAggregationTimerVal,
        }
        let treeUserData: ITreeUserData = treeUser.val()
        expect(treeUserData).to.not.deep.equal(expectedTreeUserData)
        treeUser.addMutation(mutation)
        treeUserData = treeUser.val()
        expect(treeUserData).to.deep.equal(expectedTreeUserData)
    })
    it('a mutation in one of the subscribable properties' +
        ' should publish an update of the entire object\'s value '
        + ' after startPublishing has been called', () => {
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
         // TODO: figure out why DI puts in a bad updatesCallback!
        */
        const proficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 2,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const newProficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 6,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const aggregationTimerVal = 54
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
        const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})
        treeUser.startPublishing()

        const callback = sinon.spy()
        treeUser.onUpdate(callback)

        const sampleMutation: IDatedMutation<FieldMutationTypes> = {
            data: newProficiencyStatsVal,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
        }
        proficiencyStats.addMutation(sampleMutation)
        const newTreeDataValue = treeUser.val()
        const calledWith = callback.getCall(0).args[0]
        expect(callback.callCount).to.equal(1)
        expect(calledWith).to.deep.equal(newTreeDataValue)
    })

    it('a mutation in one of the subscribable properties' +
        ' should NOT publish an update of the entire object\'s value'
        + ' before startPublishing has been called', () => {

        const proficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 2,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const newProficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 6,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const aggregationTimerVal = 54
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
        const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})

        const callback = sinon.spy()
        treeUser.onUpdate(callback)

        const sampleMutation: IDatedMutation<FieldMutationTypes> = {
            data: PROFICIENCIES.THREE,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
        }
        proficiencyStats.addMutation(sampleMutation)
        expect(callback.callCount).to.equal(0)
    })
    it('addMutation ' +
        ' should call addMutation on the appropriate descendant property' +
        'and that mutation called on the descendant property should no longer have the propertyName on it', () => {
        const proficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 2,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const newProficiencyStatsVal: IProficiencyStats = {
            UNKNOWN: 3,
            ONE: 6,
            TWO: 3,
            THREE: 4,
            FOUR: 2,
        }
        const aggregationTimerVal = 54
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
        const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})

        const callback = sinon.spy()
        treeUser.onUpdate(callback)

        const mutationWithoutPropName: IDatedMutation<FieldMutationTypes> = {
            data: PROFICIENCIES.FOUR,
            timestamp: Date.now(),
            type: FieldMutationTypes.SET
        }
        const mutation: IProppedDatedMutation<FieldMutationTypes, TreeUserPropertyNames> = {
            ...mutationWithoutPropName,
            propertyName: TreeUserPropertyNames.PROFICIENCY_STATS,
        }
        const proficiencyStatsAddMutationSpy = sinon.spy(proficiencyStats, 'addMutation')
        treeUser.addMutation(mutation)
        expect(proficiencyStatsAddMutationSpy.callCount).to.equal(1)
        const calledWith = proficiencyStatsAddMutationSpy.getCall(0).args[0]
        expect(calledWith).to.deep.equal(mutationWithoutPropName)

    })
})
