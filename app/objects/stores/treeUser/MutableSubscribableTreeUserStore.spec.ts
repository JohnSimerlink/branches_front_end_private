// tslint:disable object-literal-sort-keys
import test from 'ava';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {myContainer, myContainerLoadAllModules, myContainerLoadCustomStores} from '../../../../inversify.config';
import {TREE_ID} from '../../../testHelpers/testHelpers';
import {MutableSubscribableField} from '../../field/MutableSubscribableField';
import {
	FieldMutationTypes,
	IIdProppedDatedMutation,
	IMutableSubscribableTreeUserStore,
	IProficiencyStats,
	IProppedDatedMutation,
	ISubscribableTreeUserStoreSource,
	TreeUserPropertyMutationTypes,
	TreeUserPropertyNames
} from '../../interfaces';
import {TYPES} from '../../types';
import {MutableSubscribableTreeUserStore} from './MutableSubscribableTreeUserStore';
import {SyncableMutableSubscribableTreeUser} from '../../treeUser/SyncableMutableSubscribableTreeUser';

myContainerLoadCustomStores();
test('MutableSubscribableTreeUserStore > addMutation::::' +
	'addMutation to storeSource should call addMutation on the appropriate item,' +
	' and with a modified mutation argument that no longer has the id', (t) => {
	const proficiencyStatsVal: IProficiencyStats = {
		UNKNOWN: 3,
		ONE: 2,
		TWO: 3,
		THREE: 4,
		FOUR: 2,
	};
	const newProficiencyStatsVal: IProficiencyStats = {
		UNKNOWN: 3,
		ONE: 6,
		TWO: 3,
		THREE: 4,
		FOUR: 2,
	};
	const aggregationTimerVal = 54;
	const proficiencyStats = new MutableSubscribableField<IProficiencyStats>({field: proficiencyStatsVal});
	const aggregationTimer = new MutableSubscribableField<number>({field: aggregationTimerVal});
	const treeUser =
		new SyncableMutableSubscribableTreeUser({updatesCallbacks: [], proficiencyStats, aggregationTimer});

	const storeSource: ISubscribableTreeUserStoreSource
		= myContainer.get<ISubscribableTreeUserStoreSource>
	(TYPES.ISubscribableTreeUserStoreSource);
	storeSource.set(TREE_ID, treeUser);

	const treeUserStore: IMutableSubscribableTreeUserStore = new MutableSubscribableTreeUserStore({
		storeSource,
		updatesCallbacks: []
	});
	const treeUserAddMutationSpy = sinon.spy(treeUser, 'addMutation');

	const id = TREE_ID;
	const proppedMutation: IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
		data: newProficiencyStatsVal,
		propertyName: TreeUserPropertyNames.PROFICIENCY_STATS,
		timestamp: Date.now(),
		type: FieldMutationTypes.SET,
	};

	const sampleMutation: IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
		...proppedMutation,
		id, //
	};

	treeUserStore.addMutation(sampleMutation);

	expect(treeUserAddMutationSpy.callCount).to.equal(1);
	const calledWith = treeUserAddMutationSpy.getCall(0).args[0];
	expect(calledWith).to.deep.equal(proppedMutation);
	t.pass();
});
test('MutableSubscribableTreeUserStore > addMutation::::' +
	'addMutation to storeSource that doesn\'t contain the item (and I guess couldn\'t load it on the fly' +
	' it either, should throw a RangeError', (t) => {

	const nonExistentId = 'abdf1295';

	const storeSource: ISubscribableTreeUserStoreSource
		= myContainer.get<ISubscribableTreeUserStoreSource>
	(TYPES.ISubscribableTreeUserStoreSource);

	const treeUserStore: IMutableSubscribableTreeUserStore = new MutableSubscribableTreeUserStore({
		storeSource,
		updatesCallbacks: []
	});

	const proppedMutation: IProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
		data: 1234,
		propertyName: TreeUserPropertyNames.AGGREGATION_TIMER,
		timestamp: Date.now(),
		type: FieldMutationTypes.SET,
	};

	const sampleMutation: IIdProppedDatedMutation<TreeUserPropertyMutationTypes, TreeUserPropertyNames> = {
		...proppedMutation,
		id: nonExistentId,
	};

	expect(() => treeUserStore.addMutation(sampleMutation)).to.throw(RangeError);
	t.pass();
});
