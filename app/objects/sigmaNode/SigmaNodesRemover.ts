import { ITreeDataWithoutId } from './../interfaces';
// map from treeId to sigmaNodeId
// sourceMap from contentId to sigmaNodeId
// in the class that creates an instance of CanvasUI
// subscribe to stores. on stores update parse object type and id
// and get the correct tree id from either those two properties or from the result of a sourceMap lookup

import {inject, injectable, tagged} from 'inversify';
import {log} from '../../core/log';
import {
	fGetSigmaIdsForContentId,
	IContentData,
	IContentUserData,
	IHash,
	ISigmaEdge,
	ISigmaEdges,
	ISigmaNode,
	ISigmaNodes,
	ISigmaNodesRemover,
	ISigmaRenderManager,
	ITypeAndIdAndValUpdate,
	ObjectDataDataTypes,
	CustomStoreDataTypes, id, FGetStore,
} from '../interfaces';
import {TYPES} from '../types';
import {getContentId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {SigmaNode, SigmaNodeArgs} from './SigmaNode';
import {Store} from 'vuex';
import {TAGS} from '../tags';
import {createEdgeId, createParentSigmaEdge} from '../sigmaEdge/sigmaEdge';
import {ProficiencyUtils} from '../proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {getTreeId} from '../treeUser/treeUserUtils';

@injectable()
export class SigmaNodesRemover implements ISigmaNodesRemover {
	private sigmaNodes: ISigmaNodes;
	private sigmaEdges: ISigmaEdges;
	private sigmaRenderManager: ISigmaRenderManager;

	constructor(@inject(TYPES.SigmaNodesRemoverArgs){
		sigmaNodes,
		sigmaEdges,
		sigmaRenderManager,
	
	}: SigmaNodesRemoverArgs) {
		this.sigmaNodes = sigmaNodes;
		this.sigmaEdges = sigmaEdges;
		this.sigmaRenderManager = sigmaRenderManager;
	}

	// Assumes the sigmaNodes that the update affects already exist
	// TODO: ensure that anything calling this has the sigmaNodes exist
	private handleTreeUpdate(update: ITypeAndIdAndValUpdate){
		const sigmaNode: ISigmaNode = this.sigmaNodes[update.id]
		const oldChildren: string[] = sigmaNode.children
		const newTreeValue: ITreeDataWithoutId = update.val
		const newChildren: string[] = newTreeValue.children
		oldChildren.forEach((childId: id) => {
			const childExistsInNewChildren = newChildren.includes(childId)
			const childRemoved = !childExistsInNewChildren
			if (childRemoved) {
				this.sigmaRenderManager.markTreeForRemoval(childId)
			}
		})
	}
	public handleUpdate(update: ITypeAndIdAndValUpdate) {
		if(update.type === CustomStoreDataTypes.TREE_DATA) {
			this.handleTreeUpdate(update)

		}
	}
}

@injectable()
export class SigmaNodesRemoverArgs {

	@inject(TYPES.ISigmaNodes) public sigmaNodes: ISigmaNodes;
	@inject(TYPES.ISigmaEdges) public sigmaEdges: ISigmaEdges;
	@inject(TYPES.ISigmaRenderManager)
	@tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
	public sigmaRenderManager: ISigmaRenderManager;
}
