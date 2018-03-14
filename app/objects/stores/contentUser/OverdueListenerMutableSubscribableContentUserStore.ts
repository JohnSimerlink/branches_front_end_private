import {log} from '../../../core/log';
import {
    ContentUserPropertyMutationTypes, ContentUserPropertyNames,
    IContentUserData, IContentUserLoader, id, IIdAndValUpdates, IIdProppedDatedMutation,
    IMutableSubscribableContentUser,
    IMutableSubscribableContentUserStore, IObjectFirebaseAutoSaver, ISubscribable, ISubscribableContentUserCore,
    ISyncableMutableSubscribableContentUser, ISyncableMutableSubscribableContentUserStore,
    IUpdatesCallback,
} from '../../interfaces';
import {inject, injectable, tagged} from 'inversify';
import {TYPES} from '../../types';
import * as firebase from 'firebase';
import {TAGS} from '../../tags';
import {OverdueListener, OverdueListenerCore} from '../../contentUser/overdueListener';

@injectable()
export class OverdueListenerMutableSubscribableContentUserStore
    implements IMutableSubscribableContentUserStore {
    // TODO: I sorta don't like how store is responsible for connecting the item to an auto saver
    private contentUserStore: ISyncableMutableSubscribableContentUserStore;
    constructor(@inject(TYPES.OverdueListenerMutableSubscribableContentUserStoreArgs){
        contentUserStore,
    }: OverdueListenerMutableSubscribableContentUserStoreArgs) {
        this.contentUserStore = contentUserStore;
    }
    public addAndSubscribeToItemFromData(
        {id, contentUserData}:
            { id: string; contentUserData: IContentUserData; })
    : ISyncableMutableSubscribableContentUser {
        const contentUser: ISyncableMutableSubscribableContentUser =
            this.contentUserStore.addAndSubscribeToItemFromData({id, contentUserData});

        const overdueListenerCore = new OverdueListenerCore(
            {overdue: contentUser.overdue, nextReviewTime: contentUser.nextReviewTime, timeoutId: null}
        );
        const overdueListener = new OverdueListener({overdueListenerCore});
        overdueListener.start();

        return contentUser;
    }
    public onUpdate(func: IUpdatesCallback<IIdAndValUpdates>) {
        return this.contentUserStore.onUpdate(func);
    }

    public addItem(id: any, item: ISubscribable<IIdAndValUpdates> & ISubscribableContentUserCore) {
        return this.contentUserStore.addItem(id, item);
    }

    public startPublishing() {
        return this.contentUserStore.startPublishing();
    }

    public addMutation(mutation: IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>) {
        return this.contentUserStore.addMutation(mutation);
    }

    public mutations(): Array<IIdProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
        return this.contentUserStore.mutations();
    }
}
@injectable()
export class OverdueListenerMutableSubscribableContentUserStoreArgs {
    @inject(TYPES.IMutableSubscribableContentUserStore)
    @tagged(TAGS.AUTO_SAVER, true)
    public contentUserStore: ISyncableMutableSubscribableContentUserStore;
}
