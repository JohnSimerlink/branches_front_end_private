import {expect} from 'chai'
import * as sinon from 'sinon'
import {myContainer} from '../../../inversify.config';
import {SubscribableMutableField} from '../field/SubscribableMutableField';
import {
    IProficiencyStats,
    ISubscribableMutableField,
    ISubscribableMutableStringSet,
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';
import {MutableSubscribableTreeUser} from './MutableSubscribableTreeUser';
import {SubscribableTreeUser} from './SubscribableTreeUser';

describe('SubscribableTreeUser', () => {
    it('constructor should set all the subscribable properties', () => {
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>()
        const aggregationTimer = new SubscribableMutableField<number>()
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})
        expect(treeUser.proficiencyStats).to.deep.equal(proficiencyStats)
        expect(treeUser.aggregationTimer).to.deep.equal(aggregationTimer)
    })
    it('.val() should display the value of the object', () => {
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>()
        const aggregationTimer = new SubscribableMutableField<number>()
        const TREE_ID = 'efa123'
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})

        const expectedVal = {
            proficiencyStats: proficiencyStats.val(),
            aggregationTimer: aggregationTimer.val(),
        }

        expect(treeUser.val()).to.deep.equal(expectedVal)
    })
    it('startPublishing() should call the onUpdate methods of all member Subscribable properties', () => {
        const proficiencyStats = new SubscribableMutableField<IProficiencyStats>()
        const aggregationTimer = new SubscribableMutableField<number>()
        const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer})

        const proficiencyStatsOnUpdateSpy = sinon.spy(proficiencyStats, 'onUpdate')
        const aggregationTimeOnUpdateSpy = sinon.spy(aggregationTimer, 'onUpdate')

        treeUser.startPublishing()
        expect(aggregationTimeOnUpdateSpy.callCount).to.deep.equal(1)
        expect(proficiencyStatsOnUpdateSpy.callCount).to.deep.equal(1)
    })
})
