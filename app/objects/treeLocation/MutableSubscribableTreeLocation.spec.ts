// import {expect} from 'chai'
import {expect} from 'chai'
import * as sinon from 'sinon'
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    FieldMutationTypes,
    IDatedMutation, IProficiencyStats,
    IProppedDatedMutation, ISubscribableMutableField, ISubscribableUndoableMutablePoint, ITreeLocationData,
    PointMutationTypes,
    TreeLocationPropertyMutationTypes, TreeLocationPropertyNames,
} from '../interfaces';
import {SubscribableMutablePoint} from '../point/SubscribableMutablePoint';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';

describe('MutableSubscribableTreeLocation', () => {
    it('.val() should work after constructor', () => {
        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const point: ISubscribableUndoableMutablePoint
            = new SubscribableMutablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

        const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})

        const expectedTreeLocationData: ITreeLocationData = {
            point: FIRST_POINT_VALUE
        }
        const treeLocationData: ITreeLocationData = treeLocation.val()
        expect(treeLocationData).to.deep.equal(expectedTreeLocationData)
    })
    it('.val() should give appropriate value after ADD MUTATION SHIFT', () => {
        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const MUTATION_VALUE = {x: 3, y: 4}
        const SECOND_POINT_VALUE = {
            x: FIRST_POINT_VALUE.x + MUTATION_VALUE.x,
            y: FIRST_POINT_VALUE.y + MUTATION_VALUE.y
        }
        const point: ISubscribableUndoableMutablePoint
            = new SubscribableMutablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

        const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})
        const expectedTreeLocationData: ITreeLocationData = {
            point: SECOND_POINT_VALUE
        }
        const mutation: IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
            data: { delta: MUTATION_VALUE},
            propertyName: TreeLocationPropertyNames.POINT,
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }
        treeLocation.addMutation(mutation)
        const treeLocationData: ITreeLocationData = treeLocation.val()
        expect(treeLocationData).to.deep.equal(expectedTreeLocationData)
    })
    it('a mutation in one of the subscribable properties' +
        ' should publish an update of the entire object\'s value '
        + ' after startPublishing has been called', () => {
        /* = myContainer.get<ISubscribableMutableField>(TYPES.ISubscribableMutableField)
         // TODO: figure out why DI puts in a bad updatesCallback!
        */

        const FIRST_POINT_VALUE = {x: 5, y: 7}
        const MUTATION_VALUE = {x: 3, y: 4}
        const SECOND_POINT_VALUE = {
            x: FIRST_POINT_VALUE.x + MUTATION_VALUE.x,
            y: FIRST_POINT_VALUE.y + MUTATION_VALUE.y
        }
        const point: ISubscribableUndoableMutablePoint
            = new SubscribableMutablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

        const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point})

        treeLocation.startPublishing()

        const callback = sinon.spy()
        treeLocation.onUpdate(callback)

        const sampleMutation: IDatedMutation<PointMutationTypes> = {
            data: {delta: MUTATION_VALUE},
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }
        point.addMutation(sampleMutation)
        const newTreeLocationDataValue = treeLocation.val()
        const calledWith = callback.getCall(0).args[0]
        expect(callback.callCount).to.equal(1)
        expect(calledWith).to.deep.equal(newTreeLocationDataValue)
    })

    // it('a mutation in one of the subscribable properties' +
    //     ' should NOT publish an update of the entire object\'s value'
    //     + ' before startPublishing has been called', () => {
    //
    //     const proficiencyStatsVal: IProficiencyStats = {
    //         UNKNOWN: 3,
    //         ONE: 2,
    //         TWO: 3,
    //         THREE: 4,
    //         FOUR: 2,
    //     }
    //     const newProficiencyStatsVal: IProficiencyStats = {
    //         UNKNOWN: 3,
    //         ONE: 6,
    //         TWO: 3,
    //         THREE: 4,
    //         FOUR: 2,
    //     }
    //     const aggregationTimerVal = 54
    //     const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
    //     const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
    //     const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], proficiencyStats, aggregationTimer})
    //
    //     const callback = sinon.spy()
    //     treeLocation.onUpdate(callback)
    //
    //     const sampleMutation: IDatedMutation<FieldMutationTypes> = {
    //         data: PROFICIENCIES.THREE,
    //         timestamp: Date.now(),
    //         type: FieldMutationTypes.SET,
    //     }
    //     proficiencyStats.addMutation(sampleMutation)
    //     expect(callback.callCount).to.equal(0)
    // })
    // it('addMutation ' +
    //     ' should call addMutation on the appropriate descendant property' +
    //     'and that mutation called on the descendant property should no longer have the propertyName on it', () => {
    //     const proficiencyStatsVal: IProficiencyStats = {
    //         UNKNOWN: 3,
    //         ONE: 2,
    //         TWO: 3,
    //         THREE: 4,
    //         FOUR: 2,
    //     }
    //     const newProficiencyStatsVal: IProficiencyStats = {
    //         UNKNOWN: 3,
    //         ONE: 6,
    //         TWO: 3,
    //         THREE: 4,
    //         FOUR: 2,
    //     }
    //     const aggregationTimerVal = 54
    //     const proficiencyStats = new SubscribableMutableField<IProficiencyStats>({field: proficiencyStatsVal})
    //     const aggregationTimer = new SubscribableMutableField<number>({field: aggregationTimerVal})
    //     const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], proficiencyStats, aggregationTimer})
    //
    //     const callback = sinon.spy()
    //     treeLocation.onUpdate(callback)
    //
    //     const mutationWithoutPropName: IDatedMutation<FieldMutationTypes> = {
    //         data: PROFICIENCIES.FOUR,
    //         timestamp: Date.now(),
    //         type: FieldMutationTypes.SET
    //     }
    //     const mutation: IProppedDatedMutation<FieldMutationTypes, TreeLocationPropertyNames> = {
    //         ...mutationWithoutPropName,
    //         propertyName: TreeLocationPropertyNames.PROFICIENCY_STATS,
    //     }
    //     const proficiencyStatsAddMutationSpy = sinon.spy(proficiencyStats, 'addMutation')
    //     treeLocation.addMutation(mutation)
    //     expect(proficiencyStatsAddMutationSpy.callCount).to.equal(1)
    //     const calledWith = proficiencyStatsAddMutationSpy.getCall(0).args[0]
    //     expect(calledWith).to.deep.equal(mutationWithoutPropName)
    //
    // })
    //
})
