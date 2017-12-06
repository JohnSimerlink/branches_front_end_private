// import {expect} from 'chai'
// import * as sinon from 'sinon'
// import {myContainer} from '../../../inversify.config';
// import {SubscribableMutableField} from '../field/SubscribableMutableField';
// import {
//     IProficiencyStats,
//     ISubscribableMutableField,
//     ISubscribableMutableStringSet,
// } from '../interfaces';
// import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
// import {TYPES} from '../types';
// import {MutableSubscribableTreeLocation} from './MutableSubscribableTreeLocation';
// import {SubscribableTreeLocation} from './SubscribableTreeLocation';
//
// describe('SubscribableTreeLocation', () => {
//     it('constructor should set all the subscribable properties', () => {
//         const proficiencyStats = new SubscribableMutableField<IProficiencyStats>()
//         const aggregationTimer = new SubscribableMutableField<number>()
//         const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], proficiencyStats, aggregationTimer})
//         expect(treeLocation.proficiencyStats).to.deep.equal(proficiencyStats)
//         expect(treeLocation.aggregationTimer).to.deep.equal(aggregationTimer)
//     })
//     it('.val() should display the value of the object', () => {
//         const proficiencyStats = new SubscribableMutableField<IProficiencyStats>()
//         const aggregationTimer = new SubscribableMutableField<number>()
//         const TREE_ID = 'efa123'
//         const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], proficiencyStats, aggregationTimer})
//
//         const expectedVal = {
//             proficiencyStats: proficiencyStats.val(),
//             aggregationTimer: aggregationTimer.val(),
//         }
//
//         expect(treeLocation.val()).to.deep.equal(expectedVal)
//     })
//     it('startPublishing() should call the onUpdate methods of all member Subscribable properties', () => {
//         const proficiencyStats = new SubscribableMutableField<IProficiencyStats>()
//         const aggregationTimer = new SubscribableMutableField<number>()
//         const treeLocation = new MutableSubscribableTreeLocation({updatesCallbacks: [], proficiencyStats, aggregationTimer})
//
//         const proficiencyStatsOnUpdateSpy = sinon.spy(proficiencyStats, 'onUpdate')
//         const aggregationTimeOnUpdateSpy = sinon.spy(aggregationTimer, 'onUpdate')
//
//         treeLocation.startPublishing()
//         expect(aggregationTimeOnUpdateSpy.callCount).to.deep.equal(1)
//         expect(proficiencyStatsOnUpdateSpy.callCount).to.deep.equal(1)
//     })
// })
