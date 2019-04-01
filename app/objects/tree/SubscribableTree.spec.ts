import test
	from 'ava';
import {expect} from 'chai';
import * as sinon
	from 'sinon';
import {SubscribableTree} from './SubscribableTree';
import {
	sampleTree1Children,
	sampleTree1ContentId,
	sampleTree1ParentId,
	sampleTreeData1
} from './treeTestHelpers';
import {TREE_ID} from '../../testHelpers/testHelpers';

test('SubscribableTree:::.val() should display the value of the tree', (t) => {

	const TREE_ID = 'efa123';
	const tree = new SubscribableTree({
		updatesCallbacks: [],
		id: TREE_ID,
		contentId: sampleTree1ContentId,
		parentId: sampleTree1ParentId,
		children: sampleTree1Children
	});
	expect(tree.val()).to.deep.equal(sampleTreeData1);
	t.pass();
});
test('SubscribableTree:::.getId() should display the id of the branchesMap', (t) => {

	const TREE_ID = 'efa123';
	const tree = new SubscribableTree({
		updatesCallbacks: [],
		id: TREE_ID,
		contentId: sampleTree1ContentId,
		parentId: sampleTree1ParentId,
		children: sampleTree1Children
	});
	expect(tree.val()).to.deep.equal(sampleTreeData1);
	expect(tree.getId()).to.deep.equal(TREE_ID);
	t.pass();
});
test('SubscribableTree:::startPublishing() should call the onUpdate' +
	' methods of all member Subscribable properties', (t) => {

	const tree = new SubscribableTree({
		updatesCallbacks: [],
		id: TREE_ID,
		contentId: sampleTree1ContentId,
		parentId: sampleTree1ParentId,
		children: sampleTree1Children
	});
	const contentIdOnUpdateSpy = sinon.spy(sampleTree1ContentId, 'onUpdate');
	const parentIdOnUpdateSpy = sinon.spy(sampleTree1ParentId, 'onUpdate');
	const childrenOnUpdateSpy = sinon.spy(sampleTree1Children, 'onUpdate');
	tree.startPublishing();
	expect(contentIdOnUpdateSpy.callCount).to.deep.equal(1);
	expect(parentIdOnUpdateSpy.callCount).to.deep.equal(1);
	expect(childrenOnUpdateSpy.callCount).to.deep.equal(1);
	t.pass();
});
