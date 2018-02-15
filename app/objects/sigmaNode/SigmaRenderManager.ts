import {inject, injectable} from 'inversify'
import {id, IHash, ISigmaRenderUpdate, ISigmaRenderManager, RenderUpdateTypes, IOneToManyMap} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';
import {log} from '../../core/log'
import {getSourceId, getTargetId} from '../sigmaEdge/sigmaEdge';

@injectable()
export class SigmaRenderManager extends SubscribableCore<ISigmaRenderUpdate> implements ISigmaRenderManager {
    private treeDataLoadedIdsSet: IHash<boolean>
    private treeLocationDataLoadedIdsSet: IHash<boolean>
    private treeIdToBroadcast: id
    private edgeIdsToBroadcast: id[]
    private waitingEdgeIds: IHash<boolean>
    private treeIdEdgeIdsMap: IOneToManyMap<id>
    private renderUpdateType: RenderUpdateTypes
    constructor(
        @inject(TYPES.SigmaRenderManagerArgs) {
            treeDataLoadedIdsSet,
            treeLocationDataLoadedIdsSet,
            edgeIdsToBroadcast,
            waitingEdgeIds,
            treeIdEdgeIdsMap,
            updatesCallbacks
        }: SigmaRenderManagerArgs) {
        super({updatesCallbacks})
        this.treeDataLoadedIdsSet = treeDataLoadedIdsSet
        this.treeLocationDataLoadedIdsSet = treeLocationDataLoadedIdsSet
        this.edgeIdsToBroadcast = edgeIdsToBroadcast
        this.waitingEdgeIds = waitingEdgeIds
        this.treeIdEdgeIdsMap = treeIdEdgeIdsMap
    }

    public addWaitingEdge(edgeId: any) {
        this.waitingEdgeIds[edgeId] = true
        const sourceId = getSourceId({edgeId})
        const targetId = getTargetId({edgeId})
        log('this treeidEdgeIdsMap is', this.treeIdEdgeIdsMap)
        this.treeIdEdgeIdsMap.set(sourceId, edgeId) // TODO: what if same edgeId is added twice for one treeId?
        this.treeIdEdgeIdsMap.set(targetId, edgeId) // TODO: what if same edgeId is added twice for one treeId?
        // edge can be loaded when these two nodes are loaded
        // throw new Error('Method not implemented.')
        this.broadcastIfEdgesRenderable(edgeId)
    }

    protected callbackArguments(): ISigmaRenderUpdate {
        switch (this.renderUpdateType) {
            case RenderUpdateTypes.NEW_NODE:
                return {
                    type: this.renderUpdateType,
                    sigmaNodeIdToRender: this.treeIdToBroadcast,
                }
            case RenderUpdateTypes.NEW_EDGE:
                return {
                    type: this.renderUpdateType,
                    sigmaEdgeIdsToRender: this.edgeIdsToBroadcast,
                }
        }
    }

    public markTreeDataLoaded(treeId: id) {
        this.treeDataLoadedIdsSet[treeId] = true
        this.broadcastIfNodeRenderable(treeId)

    }

    public markTreeLocationDataLoaded(treeId: id) {
        this.treeLocationDataLoadedIdsSet[treeId] = true
        this.broadcastIfNodeRenderable(treeId)
    }

    private broadcastIfNodeRenderable(treeId: id) {
        if (!this.canRenderNode(treeId)) {
            return
        } else {
            log('node with id of ' + treeId + ' is renderable!', this.treeDataLoadedIdsSet, this.treeLocationDataLoadedIdsSet)
        }
        this.broadcastNewNodeUpdate(treeId)
        this.broadcastNewEdgesForEdgesWaitingOnNode(treeId)
        // whenever a node is renderable, we need to check if there were any edges
        // waiting on that node to be rendered, that should now be rendered
        // then we should broadcast those new Edges updates
        // and then we should remove those edge ids from the waiting list
    }
    private broadcastIfEdgesRenderable(edgeIds: id[]) {
        const edgeIdsToCreate = []
        for (const edgeId of edgeIds) {
            if (this.canRenderEdge(edgeId)) {
                edgeIdsToCreate.push(edgeId)
            }
        }
        log('renderable edges are ', edgeIdsToCreate)
        if (edgeIdsToCreate.length) {
            this.broadcastNewEdgesUpdate(edgeIdsToCreate)
        }
    }
    private broadcastNewEdgesForEdgesWaitingOnNode(treeId: id) {
        const edgesForTreeId: id[] = this.treeIdEdgeIdsMap.get(treeId)
        if (edgesForTreeId.length) {
            log('edges for treeId ', treeId, 'are ', edgesForTreeId)
            this.broadcastIfEdgesRenderable(edgesForTreeId)
        }
    }
    private canRenderNode(treeId: id) {
        return this.treeLocationDataLoadedIdsSet[treeId]  && this.treeDataLoadedIdsSet[treeId]
    }
    private canRenderEdge(edgeId: id) {
        const sourceId = getSourceId({edgeId})
        const targetId = getTargetId({edgeId})
        return this.canRenderNode(sourceId) && this.canRenderNode(targetId)
        // return this.treeLocationDataLoadedIdsSet[sourceId]  && this.treeDataLoadedIdsSet[treeId]
    }
    private broadcastNewNodeUpdate(treeId: id) {
        this.treeIdToBroadcast = treeId
        this.renderUpdateType = RenderUpdateTypes.NEW_NODE
        this.callCallbacks()
    }
    private broadcastNewEdgesUpdate(edgeIds: id[]) {
        this.edgeIdsToBroadcast = edgeIds
        this.renderUpdateType = RenderUpdateTypes.NEW_EDGE
        this.callCallbacks()
        this.edgeIdsToBroadcast = []
    }

}

@injectable()
export class SigmaRenderManagerArgs {
    @inject(TYPES.Object) public treeDataLoadedIdsSet: IHash<boolean>
    @inject(TYPES.Object) public treeLocationDataLoadedIdsSet: IHash<boolean>
    @inject(TYPES.Array) public edgeIdsToBroadcast: id[]
    @inject(TYPES.Object) public waitingEdgeIds: IHash<boolean>
    @inject(TYPES.IOneToManyMap) public treeIdEdgeIdsMap: IOneToManyMap<id>
    @inject(TYPES.Array) public updatesCallbacks: Function[]
}
