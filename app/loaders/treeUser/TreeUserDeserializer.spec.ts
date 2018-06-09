import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {IMutableSubscribableTreeUser, IProficiencyStats, ITreeUserData,} from '../../objects/interfaces';
import {TreeUserDeserializer} from './TreeUserDeserializer';
import {myContainerLoadAllModules, myContainerLoadLoaders} from '../../../inversify.config';
import {SyncableMutableSubscribableTreeUser} from '../../objects/treeUser/SyncableMutableSubscribableTreeUser';

myContainerLoadLoaders();
test('TreeUserDeserializer::: deserializeFromDB Should deserializeFromDB properly', (t) => {
	const proficiencyStatsVal = {
		ONE: 3,
	} as IProficiencyStats;
	const aggregationTimerVal = 87;

	const treeUserData: ITreeUserData = {
		proficiencyStats: proficiencyStatsVal,
		aggregationTimer: aggregationTimerVal,
	};
	const treeUserId = '092384';

	const proficiencyStats = new MutableSubscribableField<IProficiencyStats>({field: proficiencyStatsVal});
	const aggregationTimer = new MutableSubscribableField<number>({field: aggregationTimerVal});
	const expectedTreeUser: IMutableSubscribableTreeUser = new SyncableMutableSubscribableTreeUser(
		{updatesCallbacks: [], proficiencyStats, aggregationTimer}
	);
	const deserializedTreeUser: IMutableSubscribableTreeUser
		= TreeUserDeserializer.deserialize({treeUserData, treeUserId});
	expect(deserializedTreeUser).to.deep.equal(expectedTreeUser);
	t.pass();
});
