import test
	from 'ava';
import {MockFirebase} from 'firebase-mock';
import {FIREBASE_PATHS} from '../paths';
import {
	IMutableSubscribableTree,
	ISubscribableTreeStoreSource,
	ITreeDataFromDB
} from '../../objects/interfaces';
import {TreeDeserializer} from './TreeDeserializer';
import {
	myContainer,
	myContainerLoadLoaders,
} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {TAGS} from '../../objects/tags';
import {TreeLoader} from './TreeLoader';
import {expect} from 'chai';

myContainerLoadLoaders();
test('TreeLoader:::DownloadData should have the side effect of storing the data in the storeSource', async (t) => {
	const treeId = '1234';
	const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES);
	const childFirebaseRef = firebaseRef.child(treeId);

	const sampleTreeData: ITreeDataFromDB = {
		contentId: {
			val: '12345532',
		},
		parentId: {
			val: '493284',
		},
		children: {
			val: {
				2948: true,
				2947: true,
			}
		}
	};
	const sampleTree: IMutableSubscribableTree =
		TreeDeserializer.deserializeFromDB({
			treeId,
			treeDataFromDB: sampleTreeData
		});
	const storeSource: ISubscribableTreeStoreSource =
		myContainer.getTagged<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource, TAGS.MAIN_APP, true);
	const treeLoader = new TreeLoader({
		storeSource,
		firebaseRef
	});
	childFirebaseRef.fakeEvent('value', undefined, sampleTreeData);
	const treeLoadPromise = treeLoader.downloadData(treeId);
	childFirebaseRef.flush();

	await treeLoadPromise;
	expect(storeSource.get(treeId)).to.deep.equal(sampleTree);
	t.pass();
});
