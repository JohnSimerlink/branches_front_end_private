/**
 * Interfaces for the dynamically named mutations in store.ts
 * You can't natively type arguments on the mutations on our dynamically named functions in the MUTATIONS array
 * So we created separate interfaces for each of the argument objects for each of the methods.
 * What we do is 1) we create an argument object with the correct type for that dynamically named mutation.
 * 2) we pass in that argument object into the invocation for that mutation
 * e.g.
 *
 *  <pre>
 *      const setTreeMutationArgs = {
 *          treeId: '54',
 *          tree: someTreeObject
 *      }
 *      MUTATIONS[MUTATION_NAMES.SET_TREE](state, setTreeMutationArgs)
 *  </pre>
 *  NOTE How the above gets type safety, where as the below does not.
 *  <pre>
 *      MUTATIONS[MUTATION_NAMES.SET_TREE](state, {
 *          treeId: '54',
 *          tree: someTreeObject
 *      })
 *  </pre>
 */
import {
	CONTENT_TYPES,
	id, ISyncableMutableSubscribableContent, ISyncableMutableSubscribableContentUser, ISyncableMutableSubscribableTree,
	ISyncableMutableSubscribableTreeLocation,
	ISyncableMutableSubscribableTreeUser, timestamp, ITreeLocationData, ICoordinate, ITreeDataWithoutId, ITreeUserData,
	IContentData,
	IContentUserData,
} from '../../objects/interfaces';

export interface ISetTreeMutationArgs {
	treeId: id,
	tree: ISyncableMutableSubscribableTree
}

export interface ISetTreeLocationMutationArgs {
	treeId: id,
	treeLocation: ISyncableMutableSubscribableTreeLocation
}

export interface ISetTreeUserMutationArgs {
	treeId: id,
	treeUser: ISyncableMutableSubscribableTreeUser
}

export interface ISetContentMutationArgs {
	contentId: id,
	content: ISyncableMutableSubscribableContent
}

export interface ISetContentUserMutationArgs {
	contentUserId: id,
	contentUser: ISyncableMutableSubscribableContentUser
}

export interface IPlayTreeMutationArgs {
	treeId: id
}

export interface IJumpToMutationArgs {
	treeId: id
}

export interface INewChildTreeMutationArgs {
	parentTreeId: id,
	timestamp: timestamp,
	contentType: CONTENT_TYPES,
	question: string,
	answer: string,
	title: string,
	parentLocation: ITreeLocationData
}

export interface IHighlightFlashcardNodeArgs {
	nodeId: id
}
export interface IRemoveTreeMutationArgs {
	treeId: id 
}

export interface IMoveTreeCoordinateMutationArgs {
	treeId: id,
	point: ICoordinate,
}

export interface IMoveTreeCoordinateByDeltaMutationArgs {
    treeId: id,
    pointDelta: ICoordinate,
}

export interface ISetTreeDataMutationArgs {
	treeId: id,
	treeDataWithoutId: ITreeDataWithoutId
}

export interface ISetTreeLocationDataMutationArgs {
	treeId: id,
	treeLocationData: ITreeLocationData
}

export interface ISetTreeUserDataMutationArgs {
	treeId: id,
	treeUserData: ITreeUserData
}

export interface ISetContentDataMutationArgs {
	contentId: id,
	contentData: IContentData
}

export interface ISetContentUserDataMutationArgs {
	contentUserId: id,
	contentUserData: IContentUserData
}

export interface IAddChildToParentArgs {
	parentTreeId,
	childTreeId
}