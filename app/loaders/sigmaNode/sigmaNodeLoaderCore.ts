import {inject, injectable, tagged} from 'inversify';
import {
    IContentData,
    IContentLoader, IContentUserData, IContentUserLoader, id, ISigmaLoadData, ISigmaNodeLoaderCore, ITreeDataWithoutId,
    ITreeLoader,
    ITreeLocationData,
    ITreeLocationLoader
} from '../../objects/interfaces';
import {Store} from 'vuex';
import {TYPES} from '../../objects/types';
import {TAGS} from '../../objects/tags';
import {log} from '../../core/log'

@injectable()
export class SigmaNodeLoaderCore implements ISigmaNodeLoaderCore {
    /* TODO: Each of these loaders should have baked into them certain auth cookies
     that determine whether or not they are actually permitted to load the data
      */
    private treeLoader: ITreeLoader
    private treeLocationLoader: ITreeLocationLoader
    // private treeUserLoader: ITreeUserLoader
    private contentLoader: IContentLoader
    private contentUserLoader: IContentUserLoader
    private store: Store<any>
    constructor(@inject(TYPES.SigmaNodeLoaderCoreArgs){
        specialTreeLoader,
        treeLocationLoader,
        contentLoader,
        contentUserLoader,
        store,
  }: SigmaNodeLoaderCoreArgs) {
        this.treeLoader = specialTreeLoader
        this.treeLocationLoader = treeLocationLoader
        this.contentLoader = contentLoader
        this.contentUserLoader = contentUserLoader
        this.store = store
    }

    public async load(sigmaId: id): Promise<ISigmaLoadData> {
        const treeId = sigmaId
        const treeLocationPromise: Promise<ITreeLocationData> = this.treeLocationLoader.downloadData(treeId)
        const treeDataWithoutId: ITreeDataWithoutId = await this.treeLoader.downloadData(treeId)

        if (!treeDataWithoutId) {
            return
        }
        const contentDataPromise: Promise<IContentData> = this.contentLoader.downloadData(treeDataWithoutId.contentId)
        const contentUserDataPromise: Promise<IContentUserData> = this.contentUserLoader.downloadData({
            contentId: treeDataWithoutId.contentId,
            userId: this.store.getters.userId
        })
        const [treeLocationData, contentData, contentUserData]
            = await Promise.all([treeLocationPromise, contentDataPromise, contentUserDataPromise])
        return {
            treeDataWithoutId,
            treeLocationData,
            contentData,
            contentUserData
        }
    }

}

@injectable()
export class SigmaNodeLoaderCoreArgs {
    @inject(TYPES.ITreeLoader)
    @tagged(TAGS.AUTO_SAVER, true)
        public specialTreeLoader: ITreeLoader
    @inject(TYPES.ITreeLocationLoader)
    @tagged(TAGS.AUTO_SAVER, true)
        public treeLocationLoader: ITreeLocationLoader
    @inject(TYPES.IContentLoader)
    @tagged(TAGS.AUTO_SAVER, true)
        public contentLoader: IContentLoader
    @inject(TYPES.IContentUserLoader)
    // TODO: I wish I could just arbitrarily compose whatever behavior I wanted onto this injection . . .
    // e.g. @tagged(TAGS.AUTO_SAVER, true) and @tagged(TAGS.OVERDUE_LISTENER, true) at the same time
    @tagged(TAGS.OVERDUE_LISTENER, true)
        public contentUserLoader: IContentUserLoader
    @inject(TYPES.BranchesStore)
        public store: Store<any>
    // @inject(TYPES.Id)
    //     public userId: id
    // @inject(TYPES.ITreeLoader)
    //     private treeLoader: ITreeLoader
    // private treeLocationLoader: ITreeLocationLoader
    // // private treeUserLoader: ITreeUserLoader
    // private contentLoader: IContentLoader
    // private contentUserLoader: IContentUserLoader
    // private store: Store<any>
    // private userId: id

}
