import {inject, injectable} from 'inversify'
import {ISigmaIdToRender, ISigmaRenderManager} from '../interfaces';
import {TYPES} from '../types';
import {SubscribableCore} from '../subscribable/SubscribableCore';

@injectable()
class SigmaRenderManager extends SubscribableCore<ISigmaIdToRender> implements ISigmaRenderManager {
    protected callbackArguments(): ISigmaIdToRender {
        return {sigmaIdToRender: this.treeIdToBroadcast}
    }

    public markTreeDataLoaded(treeId) {
        this.treeDataLoadedIdsSet[treeId] = true
        this.broadcastIfRenderable(treeId)
    }

    public markTreeLocationDataLoaded(treeId) {
        this.treeLocationDataLoadedIdsSet[treeId] = true
        this.broadcastIfRenderable(treeId)
    }

    private broadcastIfRenderable(treeId) {
        if (this.canRender(treeId)) {
            this.broadcastUpdate(treeId)
        }
    }
    private canRender(treeId) {
        return this.treeLocationDataLoadedIdsSet[treeId]  && this.treeDataLoadedIdsSet[treeId]
    }
    private broadcastUpdate(treeId) {
        this.treeIdToBroadcast = treeId
        this.callCallbacks()
    }

    private treeDataLoadedIdsSet
    private treeLocationDataLoadedIdsSet
    private treeIdToBroadcast
    constructor(@inject(TYPES.SigmaRenderManagerArgs) {treeDataLoadedIdsSet,
        treeLocationDataLoadedIdsSet, updatesCallbacks}) {
        super({updatesCallbacks})
        this.treeDataLoadedIdsSet = treeDataLoadedIdsSet
        this.treeLocationDataLoadedIdsSet = treeLocationDataLoadedIdsSet
    }
}

@injectable()
class SigmaRenderManagerArgs {
    @inject(TYPES.Object) public treeDataLoadedIdsSet
    @inject(TYPES.Object) public treeLocationDataLoadedIdsSet
}

export {SigmaRenderManager, SigmaRenderManagerArgs}
