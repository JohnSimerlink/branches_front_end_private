import {inject, injectable, tagged} from 'inversify';
import {
    IContentData,
    IContentLoader, IContentUserData, IContentUserLoader, id, IHash, ISigma, ISigmaLoadData, ISigmaNodeLoader,
    ISigmaNodeLoaderCore,
} from '../../objects/interfaces';
import {log} from '../../core/log'
import {TYPES} from '../../objects/types';

@injectable()
export class SigmaNodeLoader implements ISigmaNodeLoader {
    /* TODO: Each of these loaders should have baked into them certain auth cookies
     that determine whether or not they are actually permitted to load the data
      */
    // private treeLoader: ITreeLoader
    // private treeLocationLoader: ITreeLocationLoader
    // // private treeUserLoader: ITreeUserLoader
    // private contentLoader: IContentLoader
    // private contentUserLoader: IContentUserLoader
    // private store: Store<any>
    // private userId: id
    private sigmaNodeLoaderCore: ISigmaNodeLoaderCore
    private sigmaIdLoadDataPromiseMap: IHash<Promise<ISigmaLoadData>>
    private sigmaIdLoadDataMap: IHash<ISigmaLoadData>
    constructor(@inject(TYPES.SigmaNodeLoaderArgs){
        sigmaNodeLoaderCore, sigmaIdLoadDataPromiseMap, sigmaIdLoadDataMap
    }: SigmaNodeLoaderArgs) {
        this.sigmaNodeLoaderCore = sigmaNodeLoaderCore
        this.sigmaIdLoadDataPromiseMap = sigmaIdLoadDataPromiseMap
        this.sigmaIdLoadDataMap = sigmaIdLoadDataMap
        // this.treeLoader = specialTreeLoader
        // this.treeLocationLoader = treeLocationLoader
        // this.contentLoader = contentLoader
        // this.contentUserLoader = contentUserLoader
        // this.store = store
        // this.userId = userId
    }

    // TODO: prevent from being called twice
    public async loadIfNotLoaded(sigmaId: id): Promise<ISigmaLoadData> {
        // log('sigmaNodeLoader loadIfNotLoaded called', sigmaId)
        // check if data is in cache
        const loadData: ISigmaLoadData
            = this.sigmaIdLoadDataMap[sigmaId]
        if (loadData) {
            return loadData
        }
        // check if data is currently being fetched by another instance of this method
        const storedLoadDataPromise: Promise<ISigmaLoadData> =
            this.sigmaIdLoadDataPromiseMap[sigmaId]
        if (storedLoadDataPromise) {
            return await storedLoadDataPromise
        }
        // else load the data
        const dataPromise = this.sigmaNodeLoaderCore.load(sigmaId)
        this.sigmaIdLoadDataPromiseMap[sigmaId] = dataPromise

        const data = await dataPromise
        this.sigmaIdLoadDataMap[sigmaId] = data
        delete this.sigmaIdLoadDataPromiseMap[sigmaId]
        return dataPromise
    }

}

@injectable()
export class SigmaNodeLoaderArgs {
    @inject(TYPES.ISigmaNodeLoaderCore)
        public sigmaNodeLoaderCore: ISigmaNodeLoaderCore
    @inject(TYPES.Object)
        private sigmaIdLoadDataPromiseMap: IHash<Promise<ISigmaLoadData>>
    @inject(TYPES.Object)
        private sigmaIdLoadDataMap: IHash<ISigmaLoadData>
}
