import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import {
	getMockRef,
	mockFirebaseReferences,
	myContainer,
	myContainerLoadAllModulesExceptFirebaseRefs
} from '../../../inversify.config';
import {Store} from 'vuex';
import {MUTATION_NAMES} from './STORE_MUTATION_NAMES'
import {TYPES} from '../../objects/types';
import * as sinon
	from 'sinon';
import {ICreateTreeLocationMutationArgs} from '../../objects/interfaces';
import {AppContainer} from '../appContainer';
import {expect} from 'chai';
import test
	from 'ava';
import {
	sampleTreeLocationData1,
	sampleTreeLocationData1Level,
	sampleTreeLocationData1MapId,
	sampleTreeLocationData1x,
	sampleTreeLocationData1y
} from '../../objects/treeLocation/treeLocationTestHelpers';
import BranchesStore
	from './store';
import {FIREBASE_PATHS} from '../../loaders/paths';

injectFakeDom();

test('store create location should call correct firebaseRef', t => {
	/** Swap out actual firebase refs with Mock firebase refs.
	 *
	 */
	myContainer.load(mockFirebaseReferences);
	myContainerLoadAllModulesExceptFirebaseRefs({fakeSigma: true});
	/**
	 * Set up data
	 */
	const treeId = '123abcde3';
	const treeLocationData: ICreateTreeLocationMutationArgs = {
		x: sampleTreeLocationData1x,
		y: sampleTreeLocationData1y,
		level: sampleTreeLocationData1Level,
		treeId,
		mapId: sampleTreeLocationData1MapId,
	};
	/**
	 * Grab the store singleton with which we will create the action
	 * @type {Store<any>}
	 */
	const store: Store<any> = myContainer.get<BranchesStore>(TYPES.BranchesStore) as Store<any>;
	/**
	 * Set up spy - spy on the firebase ref.
	 * the action on the store should trigger a database update on this firebase ref
	 */
	const mockTreeLocationsRef = getMockRef(FIREBASE_PATHS.TREE_LOCATIONS)
	const treeLocationRef = mockTreeLocationsRef.child(treeId);
	const treeLocationRefUpdateSpy = sinon.spy(treeLocationRef, 'update');

	/**
	 * Start the app
	 */
	const appContainer = myContainer.get<AppContainer>(TYPES.AppContainer);
	appContainer.start();
	/**
	 * initialize sigma to avoid refresh on null error
	 */
	store.commit(MUTATION_NAMES.INITIALIZE_SIGMA_INSTANCE_IF_NOT_INITIALIZED);
	/**
	 * test the actual mutation we are testing
	 */
	store.commit(MUTATION_NAMES.CREATE_TREE_LOCATION, treeLocationData);

	expect(treeLocationRefUpdateSpy.callCount).to.deep.equal(1);
	const calledWith = treeLocationRefUpdateSpy.getCall(0).args[0];
	const expectedCalledWith = sampleTreeLocationData1;
	expect(calledWith).to.deep.equal(expectedCalledWith);

	t.pass();

});
