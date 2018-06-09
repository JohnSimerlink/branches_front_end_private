import {MockFirebase} from 'firebase-mock';
import test from 'ava';
import {
	myContainer, myContainerLoadAllModules, myContainerLoadAllModulesExceptFirebaseRefs, myContainerLoadLoaders,
	myContainerLoadMockFirebaseReferences
} from '../../../inversify.config';
import {TYPES} from '../../objects/types';
import {IOneToManyMap, ITreeDataFromDB, ITreeLoader} from '../../objects/interfaces';
import {SpecialTreeLoader} from './specialTreeLoader';
import {FIREBASE_PATHS} from '../paths';
import {expect} from 'chai';
import {TreeLoader, TreeLoaderArgs} from './TreeLoader';
import {partialInject} from '../../testHelpers/partialInject';

myContainerLoadLoaders();
test('SpecialTreeLoader', async (t) => {
	const treeId = '1234';
	const sigmaId = treeId;
	const firebaseRef = new MockFirebase(FIREBASE_PATHS.TREES);
	const childFirebaseRef = firebaseRef.child(treeId);

	const contentId = '12345532';
	const sampleTreeData: ITreeDataFromDB = {
		contentId: {
			val: contentId
		},
		parentId: {
			val: '493284'
		},
		children: {
			val: {
				2948: true,
				2947: true,
			}
		}
	};
	const treeLoader: ITreeLoader = partialInject<TreeLoaderArgs>(
		{
			konstructor: TreeLoader,
			constructorArgsType: TYPES.TreeLoaderArgs,
			injections: {firebaseRef},
			container: myContainer,
		}); // myContainer.get<ITreeLoader>(TYPES.ITreeLoader)
	const contentIdSigmaIdsMap: IOneToManyMap<string> = myContainer.get<IOneToManyMap<string>>(TYPES.IOneToManyMap);
	contentIdSigmaIdsMap['id'] = Math.random()
	const specialTreeLoader: ITreeLoader =
		new SpecialTreeLoader({treeLoader, contentIdSigmaIdsMap});

	childFirebaseRef.fakeEvent('value', undefined, sampleTreeData);
	const treeDataPromise = specialTreeLoader.downloadData(treeId);
	childFirebaseRef.flush();
	setTimeout(() => {
	}, 0);
	await treeDataPromise;
	const sigmaIds = contentIdSigmaIdsMap.get(contentId)
	const inMap = sigmaIds && sigmaIds.includes(sigmaId);
	expect(inMap).to.equal(true);
	t.pass();
});
