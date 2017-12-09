import {inject, injectable} from 'inversify'
import {ISigmaRenderManager} from '../interfaces';
import {TYPES} from '../types';

@injectable()
class SigmaRenderManager implements ISigmaRenderManager {

    public markTreeDataLoaded(treeId) {
        this.treeDataLoadedIdsSet[treeId] = true
    }

    public markTreeLocationDataLoaded(treeId) {
        this.treeLocationDataLoadedIdsSet[treeId] = true
    }

    public canRender(treeId) {
        return this.treeLocationDataLoadedIdsSet[treeId]  && this.treeDataLoadedIdsSet[treeId]
    }

    private treeDataLoadedIdsSet
    private treeLocationDataLoadedIdsSet
    constructor(@inject(TYPES.SigmaRenderManagerArgs) {treeDataLoadedIdsSet, treeLocationDataLoadedIdsSet}) {
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
