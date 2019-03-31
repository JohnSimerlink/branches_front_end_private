import test
	from 'ava';
import {myContainerLoadRendering} from '../../../inversify.config';
import {SigmaUpdater} from './sigmaUpdater';
import {
	ISigmaNodeData,
	ISigmaUpdater
} from '../interfaces';
import {expect} from 'chai';
import * as sinon
	from 'sinon';
import {Store} from 'vuex';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';

myContainerLoadRendering();

test('AddNode should call store.commit with add node mutation', (t) => {
	const node /*: SigmaJs.Node */ = {id: '53234'} as ISigmaNodeData;
	/* as SigmaJs.Node */
	const store = {
		commit(mutationName, arg) {
		}
	} as Store<any>;
	const sigmaUpdater: ISigmaUpdater = new SigmaUpdater(
		{store}
	);
	const storeCommitSpy = sinon.spy(store, 'commit');
	sigmaUpdater.addNode(node);

	expect(storeCommitSpy.callCount).to.deep.equal(1);
	const mutationName = storeCommitSpy.getCall(0).args[0];
	const commitArg = storeCommitSpy.getCall(0).args[1];
	expect(mutationName).to.deep.equal(MUTATION_NAMES.ADD_NODE);
	expect(commitArg).to.deep.equal({node});
	t.pass();

});
