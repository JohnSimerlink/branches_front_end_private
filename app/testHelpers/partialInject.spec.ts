import {injectFakeDom} from './injectFakeDom';
import {ISubscribableContentStoreSource} from '../objects/interfaces';
import {myContainer} from '../../inversify.config';
import {TYPES} from '../objects/types';
import test
	from 'ava';
import {partialInject} from './partialInject';
import {expect} from 'chai';
import {
	ContentLoader,
	ContentLoaderArgs
} from '../loaders/content/ContentLoader';
import {MockFirebase} from 'firebase-mock';

injectFakeDom();
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;

test('partial inject on ContentLoader', (t) => {
	const expectedContentLoader = (() => {
		const storeSource: ISubscribableContentStoreSource =
			myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);

		const firebaseRef: Reference = new MockFirebase();
		const contentLoader = new ContentLoader({
			storeSource,
			firebaseRef
		});
		return contentLoader;
	})();

	const partiallyInjectedContentLoader = (() => {
		const firebaseRef: Reference = new MockFirebase();
		const contentLoader = partialInject<ContentLoaderArgs>(
			{
				konstructor: ContentLoader,
				constructorArgsType: TYPES.ContentLoaderArgs,
				injections: {
					firebaseRef,
				},
				container: myContainer,
			}
		);
		return contentLoader;
	})();

	expect(expectedContentLoader).to.deep.equal(partiallyInjectedContentLoader);
	t.pass();
});
test('partial inject on ContentLoader FAIL', (t) => {
	const expectedContentLoader = (() => {
		const storeSource: ISubscribableContentStoreSource =
			myContainer.get<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource);

		const firebaseRef: Reference = new MockFirebase();
		firebaseRef.update = (updates: object) => void 1;
		const contentLoader = new ContentLoader({
			storeSource,
			firebaseRef
		});
		return contentLoader;
	})();

	const partiallyInjectedContentLoader = (() => {
		const firebaseRef: Reference = new MockFirebase();
		const contentLoader = partialInject<ContentLoaderArgs>(
			{
				konstructor: ContentLoader,
				constructorArgsType: TYPES.ContentLoaderArgs,
				injections: {
					firebaseRef,
				},
				container: myContainer,
			}
		);
		return contentLoader;
	})();

	expect(expectedContentLoader).to.not.deep.equal(partiallyInjectedContentLoader);
	t.pass();
});
// test('partial injection on BranchesStore', t => {
//     const expectedStore = (() => {
//         const stateClone = clonedeep(state)
//         const globalDataStore: IMutableSubscribableGlobalStore
//             = myContainer.get<IMutableSubscribableGlobalStore>
//         (TYPES.IMutableSubscribableGlobalStore) // TODO: WRITE the partial DEPENDENCY INJECTION THING RIGHT NOW
//         const store = new BranchesStore({globalDataStore, state: stateClone})
//         return store
//     })()
//
//     const partiallyInjectedStore = (() => {
//         const stateClone = clonedeep(state)
//         const store = partialInject<BranchesStoreArgs>(
//             {
//                 konstructor: BranchesStore,
//                 constructorArgsType: TYPES.BranchesStoreArgs,
//                 injections: {state: stateClone},
//                 container: myContainer
//             })
//         return store
//     })()
//     expect(partiallyInjectedStore).to.deep.equal(expectedStore)
// })
