import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import * as sinon from 'sinon';
import {MutableSubscribableField} from '../field/MutableSubscribableField';
import {IProficiencyStats} from '../interfaces';
import {MutableSubscribableTreeUser} from './MutableSubscribableTreeUser';
test('SubscribableTreeUser:::.val() should display the value of the object', (t) => {
    const proficiencyStats = new MutableSubscribableField<IProficiencyStats>();
    const aggregationTimer = new MutableSubscribableField<number>();
    const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer});

    const expectedVal = {
        proficiencyStats: proficiencyStats.val(),
        aggregationTimer: aggregationTimer.val(),
    };

    expect(treeUser.val()).to.deep.equal(expectedVal);
    t.pass();
});
test('SubscribableTreeUser:::startPublishing() should call the onUpdate methods' +
    ' of all member Subscribable properties', (t) => {
    const proficiencyStats = new MutableSubscribableField<IProficiencyStats>();
    const aggregationTimer = new MutableSubscribableField<number>();
    const treeUser = new MutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer});

    const proficiencyStatsOnUpdateSpy = sinon.spy(proficiencyStats, 'onUpdate');
    const aggregationTimeOnUpdateSpy = sinon.spy(aggregationTimer, 'onUpdate');

    treeUser.startPublishing();
    expect(aggregationTimeOnUpdateSpy.callCount).to.deep.equal(1);
    expect(proficiencyStatsOnUpdateSpy.callCount).to.deep.equal(1);
    t.pass();
});
