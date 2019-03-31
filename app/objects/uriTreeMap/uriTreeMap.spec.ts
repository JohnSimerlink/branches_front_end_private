import {injectFakeDom} from '../../testHelpers/injectFakeDom';
import test
	from 'ava'
import {expect} from 'chai'
import {GLOBAL_MAP_ROOT_TREE_ID} from '../../core/globals';
import {getTreeIdFromUri} from './uriTreeMap';

injectFakeDom();

test('uriTreeMap:::empty uri should return treeId GLOBAL_MAP_ROOT_TREE_ID', (t) => {
	expect(getTreeIdFromUri('')).to.equal(GLOBAL_MAP_ROOT_TREE_ID);
	t.pass();
});
