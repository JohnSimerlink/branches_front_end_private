// import {expect} from 'chai'
import {injectFakeDom} from '../../testHelpers/injectFakeDom';
injectFakeDom()
import test from 'ava'
import {expect} from 'chai'
import 'reflect-metadata'
import * as sinon from 'sinon'
import {
    id,
    IDatedMutation, IMutableSubscribableField, IMutableSubscribablePoint,
    IProppedDatedMutation, ITreeLocationData,
    PointMutationTypes,
    TreeLocationPropertyMutationTypes, TreeLocationPropertyNames,
} from '../interfaces';
import {MutableSubscribablePoint} from '../point/MutableSubscribablePoint';
import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';
import {myContainerLoadAllModules} from '../../../inversify.config';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {
    getASampleTreeLocation1, sampleTreeLocationData1, sampleTreeLocationData1y, sampleTreeLocationData1x,
    sampleTreeLocationData1Level, sampleTreeLocationData1MapId, sampleTreeLocationData1Point
} from './treeLocationTestHelpers';

myContainerLoadAllModules({fakeSigma: true})
test('MutableSubscribableTreeLocation::::.val() should work after constructor', (t) => {
    expect(getASampleTreeLocation1().val()).to.deep.equal(sampleTreeLocationData1)
    t.pass()
})
test('MutableSubscribableTreeLocation::::.val() should give appropriate value after ADD MUTATION SHIFT', (t) => {
    const MUTATION_VALUE = {x: 3, y: 4}
    const treeLocation = getASampleTreeLocation1()

    const expectedTreeLocationData: ITreeLocationData = {
        ...sampleTreeLocationData1
    }
    expectedTreeLocationData.point = {
        x: sampleTreeLocationData1x + MUTATION_VALUE.x,
        y: sampleTreeLocationData1y + MUTATION_VALUE.y
    }
    const mutation: IProppedDatedMutation<TreeLocationPropertyMutationTypes, TreeLocationPropertyNames> = {
        data: {delta: MUTATION_VALUE},
        propertyName: TreeLocationPropertyNames.POINT,
        timestamp: Date.now(),
        type: PointMutationTypes.SHIFT,
    }
    treeLocation.addMutation(mutation)
    const treeLocationData: ITreeLocationData = treeLocation.val()
    expect(treeLocationData).to.deep.equal(expectedTreeLocationData)
    t.pass()
})
test('MutableSubscribableTreeLocation::::a mutation in one of the subscribable properties' +
    ' should publish an update of the entire branchesMap\'s value '
    + ' after startPublishing has been called', (t) => {
    /* = myContainer.get<IMutableSubscribableField>(TYPES.IMutableSubscribableField)
     // TODO: figure out why DI puts in a bad updatesCallback!
    */

    
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const MUTATION_VALUE = {x: 3, y: 4}
    const SECOND_POINT_VALUE = {
        x: FIRST_POINT_VALUE.x + MUTATION_VALUE.x,
        y: FIRST_POINT_VALUE.y + MUTATION_VALUE.y
    }
    const levelVal = 2
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})
    const level: IMutableSubscribableField<number>
        = new MutableSubscribableField({updatesCallbacks: [], field: levelVal})
    const mapId: IMutableSubscribableField<id>
        = new MutableSubscribableField({updatesCallbacks: [], field: sampleTreeLocationData1MapId})
    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point, level, mapId})

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
    t.pass()
})

test('MutableSubscribableTreeLocation::::a mutation in one of the subscribable properties' +
    ' should NOT publish an update of the entire branchesMap\'s value'
    + ' before startPublishing has been called', (t) => {

    
    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const MUTATION_VALUE = {x: 3, y: 4}
    const levelVal = 2
    const SECOND_POINT_VALUE = {
        x: FIRST_POINT_VALUE.x + MUTATION_VALUE.x,
        y: FIRST_POINT_VALUE.y + MUTATION_VALUE.y
    }
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})
    const level: IMutableSubscribableField<number>
        = new MutableSubscribableField({updatesCallbacks: [], field: levelVal})
    const mapId: IMutableSubscribableField<id>
        = new MutableSubscribableField({updatesCallbacks: [], field: sampleTreeLocationData1MapId})
    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point, level, mapId})
    const callback = sinon.spy()
    treeLocation.onUpdate(callback)

    const sampleMutation: IDatedMutation<PointMutationTypes> = {
        data: {delta: MUTATION_VALUE},
        timestamp: Date.now(),
        type: PointMutationTypes.SHIFT,
    }
    point.addMutation(sampleMutation)
    expect(callback.callCount).to.equal(0)
    t.pass()
})
test('MutableSubscribableTreeLocation::::addMutation ' +
    ' should call addMutation on the appropriate descendant property' +
    'and that mutation called on the descendant property should no longer have the propertyName on it', (t) => {

    const FIRST_POINT_VALUE = {x: 5, y: 7}
    const MUTATION_VALUE = {delta: {x: 3, y: 4}}
    const levelVal = 2
    const point: IMutableSubscribablePoint
        = new MutableSubscribablePoint({updatesCallbacks: [], ...FIRST_POINT_VALUE})

    const level: IMutableSubscribableField<number>
        = new MutableSubscribableField({updatesCallbacks: [], field: levelVal})
    const mapId: IMutableSubscribableField<id>
        = new MutableSubscribableField({updatesCallbacks: [], field: sampleTreeLocationData1MapId})
    const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], point, level, mapId})

    const callback = sinon.spy()
    treeLocation.onUpdate(callback)

    const mutationWithoutPropName: IDatedMutation<PointMutationTypes> = {
        data: MUTATION_VALUE,
        timestamp: Date.now(),
        type: PointMutationTypes.SHIFT
    }
    const mutation: IProppedDatedMutation<PointMutationTypes, TreeLocationPropertyNames> = {
        ...mutationWithoutPropName,
        propertyName: TreeLocationPropertyNames.POINT,
    }
    const pointAddMutationSpy = sinon.spy(point, 'addMutation')
    treeLocation.addMutation(mutation)
    expect(pointAddMutationSpy.callCount).to.equal(1)
    const calledWith = pointAddMutationSpy.getCall(0).args[0]
    expect(calledWith).to.deep.equal(mutationWithoutPropName)
    t.pass()
})
