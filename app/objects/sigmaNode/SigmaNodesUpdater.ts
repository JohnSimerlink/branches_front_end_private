// map from treeId to sigmaNodeId
// sourceMap from contentId to sigmaNodeId
// in the class that creates an instance of CanvasUI
// subscribe to stores. on stores update parse object type and id
// and get the correct tree id from either those two properties or from the result of a sourceMap lookup

import {inject, injectable, tagged} from 'inversify';
import {log} from '../../../app/core/log'
import {
    fGetSigmaIdsForContentId, IContentData, IContentUserData, IHash, ISigmaEdge, ISigmaEdgeData, ISigmaEdges,
    ISigmaEdgesUpdater,
    ISigmaEdgeUpdater, ISigmaNodes,
    ISigmaNodesUpdater,
    ISigmaRenderManager,
    ITypeAndIdAndValUpdates,
    ObjectDataDataTypes,
    ObjectDataTypes,
} from '../interfaces';
import {ISigmaNode} from '../interfaces';
import {TYPES} from '../types';
import {getContentId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import {SigmaNode, SigmaNodeArgs} from './SigmaNode';
import {MUTATION_NAMES} from '../../core/store';
import {Store} from 'vuex';
import {TAGS} from '../tags';
import {createEdgeId, createParentSigmaEdge} from '../sigmaEdge/sigmaEdge';
import {ProficiencyUtils} from '../proficiency/ProficiencyUtils';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';

@injectable()
export class SigmaNodesUpdater implements ISigmaNodesUpdater {
    private getSigmaIdsForContentId: fGetSigmaIdsForContentId
    private sigmaNodes: ISigmaNodes;
    private sigmaEdges: ISigmaEdges
    private sigmaRenderManager: ISigmaRenderManager
    private contentIdContentMap: IHash<IContentData>
    private contentIdContentUserMap: IHash<IContentUserData>
    private sigmaEdgesUpdater: ISigmaEdgesUpdater
    private store: Store<any>;

    constructor(@inject(TYPES.SigmaNodesUpdaterArgs){
        getSigmaIdsForContentId,
        sigmaNodes,
        sigmaEdges,
        sigmaRenderManager,
        contentIdContentMap,
        contentIdContentUserMap,
        sigmaEdgesUpdater,
        store
    }: SigmaNodesUpdaterArgs ) {
        this.sigmaNodes = sigmaNodes
        this.sigmaEdges = sigmaEdges
        this.getSigmaIdsForContentId = getSigmaIdsForContentId
        this.sigmaRenderManager = sigmaRenderManager
        this.contentIdContentMap = contentIdContentMap
        this.contentIdContentUserMap = contentIdContentUserMap
        this.store = store
        this.sigmaEdgesUpdater = sigmaEdgesUpdater
        // log('the contentIdSigmaIdMapSingletonGet id from inversify.config is ', this.getSigmaIdsForContentId['_id'])

    }

    private getSigmaNodeIdsOrCacheContentData(update: ITypeAndIdAndValUpdates) {
        let sigmaIds = []
        const type: ObjectDataTypes = update.type
        switch (type) {
            case ObjectDataTypes.TREE_DATA:
            case ObjectDataTypes.TREE_LOCATION_DATA:
            case ObjectDataTypes.TREE_USER_DATA:
                const treeId = update.id
                sigmaIds = [treeId]
                break
            case ObjectDataTypes.CONTENT_DATA: {
                const contentId = update.id
                sigmaIds = this.getSigmaIdsForContentId(contentId)
                /* cache the content data because the treeData for this contentItem may not be loaded yet,
                 so no sigmaIds may be returned,
                  meaning once the treeData is loaded we need to be able to load the contentData that was cached here
                 */
                const contentData: IContentData = update.val
                this.contentIdContentMap[contentId] = contentData
                break
            }
            case ObjectDataTypes.CONTENT_USER_DATA: {
                const contentUserId = update.id
                const contentId = getContentId({contentUserId})
                const contentUserData: IContentUserData = update.val
                /* cache the content user data because the treeData for this contentuserItem may not be loaded yet,
                 so no sigmaIds may be returned,
                  meaning once the treeData is loaded
                   we need to be able to load the contentUserData that was cached here
                 */
                this.contentIdContentUserMap[contentId] = contentUserData
                // TODO: Cache ContentUserData like we do with CONTENT_DATA
                sigmaIds = this.getSigmaIdsForContentId(contentId)
                break;
            }
        }
        return sigmaIds
    }
    // Assumes the sigmaNodes that the update affects already exist
    // TODO: ensure that anything calling this has the sigmaNodes exist
    public handleUpdate(update: ITypeAndIdAndValUpdates) {
        const sigmaIds: string[] = this.getSigmaNodeIdsOrCacheContentData(update)
        const me = this
        sigmaIds.forEach(sigmaId => {
            let sigmaNode: ISigmaNode = me.sigmaNodes[sigmaId]
            if (!sigmaNode) {
                sigmaNode = new SigmaNode({id: sigmaId} as SigmaNodeArgs)
                me.sigmaNodes[sigmaId] = sigmaNode
            }
            this.updateSigmaNode({sigmaNode, updateType: update.type, data: update.val, sigmaId})
        })
    }
    private updateSigmaNode(
        {
            sigmaNode, updateType, data, sigmaId,
        }: {
            sigmaNode: ISigmaNode, updateType: ObjectDataTypes, data: ObjectDataDataTypes, sigmaId: string
        }) {
        switch (updateType) {
            case ObjectDataTypes.TREE_DATA:
                sigmaNode.receiveNewTreeData(data)
                /* check if there is the contentData already downloaded for this sigmaId,
                 * and if so apply its data to the sigmaNode.
                 * Because the contentData may have been downloaded/cached before the treeData
                 */
                const contentData: IContentData = this.contentIdContentMap[data.contentId]
                if (contentData) {
                    sigmaNode.receiveNewContentData(contentData)
                }
                /* check if there is the contentUserData already downloaded for this sigmaId,
                 * and if so apply its data to the sigmaNode.
                 * Because the contentUserData may have been downloaded/cached before the treeData
                 */
                const contentUserData: IContentUserData = this.contentIdContentUserMap[data.contentId]
                if (contentUserData) {
                    sigmaNode.receiveNewContentUserData(contentUserData)
                }
                /**
                 * Create sigma Edge
                 */
                const treeId = sigmaId
                const parentId = data.parentId
                const edgeId = createEdgeId({treeId, parentId})
                let edge: ISigmaEdge = this.sigmaEdges[edgeId]
                if (!edge) {
                    const color = ProficiencyUtils.getColor(PROFICIENCIES.UNKNOWN)
                    edge = createParentSigmaEdge({parentId, treeId, color})
                    this.sigmaEdges[edgeId] = edge
                    this.sigmaRenderManager.addWaitingEdge(edgeId)
                    // this.sigmaEdgeRenderManager.markNodeL

                }

                this.sigmaRenderManager.markTreeDataLoaded(sigmaId)
                // ^ the above method will also search for any edges that now can be loaded now
                // that that treeData is loaded . . . and publishes an update for that edge to be added.
                break
            case ObjectDataTypes.TREE_LOCATION_DATA:
                sigmaNode.receiveNewTreeLocationData(data)
                this.sigmaRenderManager.markTreeLocationDataLoaded(sigmaId)
                break
            case ObjectDataTypes.TREE_USER_DATA:
                sigmaNode.receiveNewTreeUserData(data)
                break
            case ObjectDataTypes.CONTENT_DATA:
                sigmaNode.receiveNewContentData(data)
                break;
            case ObjectDataTypes.CONTENT_USER_DATA:
                sigmaNode.receiveNewContentUserData(data)
                // this.sigmaEdgesUpdater.updateParentEdgeColorLeaf({
                //     treeId: sigmaId,
                //     contentUserProficiency: data.proficiency
                // })
                break;
            default:
                throw new RangeError(updateType + ' not a valid type in ' + JSON.stringify(ObjectDataTypes))
        }
        this.store.commit(MUTATION_NAMES.REFRESH)
    }
}
@injectable()
export class SigmaNodesUpdaterArgs {
    @inject(TYPES.fGetSigmaIdsForContentId)
    @tagged(TAGS.CONTENT_ID_SIGMA_IDS_MAP, true)
        public getSigmaIdsForContentId: fGetSigmaIdsForContentId;
    @inject(TYPES.ISigmaNodes) public sigmaNodes: ISigmaNodes;
    @inject(TYPES.ISigmaEdges) public sigmaEdges: ISigmaEdges;
    @inject(TYPES.ISigmaRenderManager)
    @tagged(TAGS.MAIN_SIGMA_INSTANCE, true)
        public sigmaRenderManager: ISigmaRenderManager;
    @inject(TYPES.Object) public contentIdContentMap: IHash<IContentData>;
    @inject(TYPES.Object) public contentIdContentUserMap: IHash<IContentUserData>;
    @inject(TYPES.BranchesStore) public store: Store<any>;
    @inject(TYPES.ISigmaEdgesUpdater) public sigmaEdgesUpdater: ISigmaEdgesUpdater
}
