import {inject, injectable} from 'inversify'
import {IHash, ISigmaIdToRender, ISigmaRenderManager} from '../interfaces';
import {SubscribableCore} from '../subscribable/SubscribableCore';
import {TYPES} from '../types';

@injectable()
export class SigmaRenderManager extends SubscribableCore<ISigmaIdToRender> implements ISigmaRenderManager {
    private treeDataLoadedIdsSet: IHash<boolean>
    private treeLocationDataLoadedIdsSet: IHash<boolean>
    private treeIdToBroadcast: string
    constructor(
        @inject(TYPES.SigmaRenderManagerArgs) {treeDataLoadedIdsSet, treeLocationDataLoadedIdsSet, updatesCallbacks
        }: SigmaRenderManagerArgs) {
        super({updatesCallbacks})
        this.treeDataLoadedIdsSet = treeDataLoadedIdsSet
        this.treeLocationDataLoadedIdsSet = treeLocationDataLoadedIdsSet
    }
    protected callbackArguments(): ISigmaIdToRender {
        return {sigmaIdToRender: this.treeIdToBroadcast}
    }

    public markTreeDataLoaded(treeId: string) {
        this.treeDataLoadedIdsSet[treeId] = true
        this.broadcastIfRenderable(treeId)
    }

    public markTreeLocationDataLoaded(treeId: string) {
        this.treeLocationDataLoadedIdsSet[treeId] = true
        this.broadcastIfRenderable(treeId)
    }

    private broadcastIfRenderable(treeId: string) {
        if (this.canRender(treeId)) {
            this.broadcastUpdate(treeId)
        }
    }
    private canRender(treeId: string) {
        return this.treeLocationDataLoadedIdsSet[treeId]  && this.treeDataLoadedIdsSet[treeId]
    }
    private broadcastUpdate(treeId: string) {
        this.treeIdToBroadcast = treeId
        this.callCallbacks()
    }

}

@injectable()
export class SigmaRenderManagerArgs {
    @inject(TYPES.Object) public treeDataLoadedIdsSet: IHash<boolean>
    @inject(TYPES.Object) public treeLocationDataLoadedIdsSet: IHash<boolean>
    @inject(TYPES.Array) public updatesCallbacks: Array<Function>
}
