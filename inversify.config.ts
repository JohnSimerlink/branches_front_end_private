import {Container} from 'inversify'
import 'reflect-metadata'
import {SubscribableContent, SubscribableContentArgs} from './app/objects/content/SubscribableContent';
import {ContentUserData, ContentUserDataArgs} from './app/objects/contentUserData/ContentUserData';
import {
    SubscribableContentUser,
    SubscribableContentUserArgs
} from './app/objects/contentUserData/SubscribableContentUser';
import {FirebaseRef} from './app/objects/dbSync/FirebaseRef';
import {FirebaseSaverArgs} from './app/objects/dbSync/FirebaseSaver';
import {SyncToDB, SyncToDBArgs} from './app/objects/dbSync/SyncToDB';
import {
    SubscribableMutableField,
    SubscribableMutableFieldArgs
} from './app/objects/field/SubscribableMutableField';
import {
    CONTENT_TYPES,
    fGetSigmaIdsForContentId, IMutableSubscribableContentStore, IMutableSubscribableContentUserStore,
    IMutableSubscribableGlobalStore,
    IMutableSubscribableTree,
    IMutableSubscribableTreeLocationStore, IMutableSubscribableTreeStore,
    IMutableSubscribableTreeUserStore,
    ISigmaNodeHandler,
    ISigmaRenderManager, ISubscribableContent,
    ISubscribableContentStore,
    ISubscribableContentUserStore,
    ISubscribableGlobalStore, ISubscribableTree, ISubscribableTreeLocationStore, ISubscribableTreeStore,
    ISubscribableTreeUser,
    ISubscribableTreeUserStore
} from './app/objects/interfaces';
import {
    FieldMutationTypes, IColorSlice, IContentUserData, IDatabaseSyncer, IDetailedUpdates,
    IFirebaseRef, IMutableStringSet, IProficiencyStats, IProppedDatedMutation, ISaveUpdatesToDBFunction,
    ISigmaNode, ISubscribableContentUser,
    ISubscribableMutableField, ISubscribableMutableStringSet, ISubscribableStore, ISubscribableTreeCore, ITree,
    radian,
    TreePropertyNames
} from './app/objects/interfaces';
import {IDatedMutation} from './app/objects/interfaces';
import {PROFICIENCIES} from './app/objects/proficiency/proficiencyEnum';
import {defaultProficiencyStats} from './app/objects/proficiencyStats/IProficiencyStats';
import {
    SubscribableMutableStringSet,
    SubscribableMutableStringSetArgs
} from './app/objects/set/SubscribableMutableStringSet';
import {
    CanvasUI,
    CanvasUIArgs
} from './app/objects/sigmaNode/CanvasUI';
import {ColorSlice} from './app/objects/sigmaNode/ColorSlice';
import {SigmaNode, SigmaNodeArgs} from './app/objects/sigmaNode/SigmaNode';
import {SigmaNodeHandler, SigmaNodeHandlerArgs} from './app/objects/sigmaNode/SigmaNodeHandler';
import {SubscribableGlobalStoreArgs, SubscribableGlobalStore} from './app/objects/stores/SubscribableGlobalStore';
import {SubscribableStore, SubscribableStoreArgs} from './app/objects/stores/SubscribableStore';
import {SubscribableArgs} from './app/objects/subscribable/Subscribable';
import {DBSubscriberToTreeArgs} from './app/objects/tree/DBSubscriberToTree';
import {SubscribableTree, SubscribableTreeArgs} from './app/objects/tree/SubscribableTree';
import {TYPES} from './app/objects/types'
import {UIColor} from './app/objects/uiColor';
import {TREE_ID3} from './app/testHelpers/testHelpers';
import {SubscribableTreeUser, SubscribableTreeUserArgs} from './app/objects/treeUser/SubscribableTreeUser';
import {MutableSubscribableTree} from './app/objects/tree/MutableSubscribableTree';
import {SigmaRenderManager, SigmaRenderManagerArgs} from './app/objects/sigmaNode/SigmaRenderManager';
import {SubscribableTreeStore} from './app/objects/stores/tree/SubscribableTreeStore';
import {SubscribableTreeUserStore} from './app/objects/stores/treeUser/SubscribableTreeUserStore';
import {SubscribableTreeLocationStore} from './app/objects/stores/treeLocation/SubscribableTreeLocationStore';
import {SubscribableContentUserStore} from './app/objects/stores/contentUser/SubscribableContentUserStore';
import {SubscribableContentStore} from './app/objects/stores/content/SubscribableContentStore';
import {
    MutableSubscribableGlobalStore,
    MutableSubscribableGlobalStoreArgs
} from './app/objects/stores/MutableSubscribableGlobalStore';
import {MutableSubscribableTreeStore} from './app/objects/stores/tree/MutableSubscribableTreeStore';
import {MutableSubscribableTreeUserStore} from './app/objects/stores/treeUser/MutableSubscribableTreeUserStore';
import {MutableSubscribableTreeLocationStore} from './app/objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {MutableSubscribableContentStore} from './app/objects/stores/content/MutableSubscribableContentStore';
import {MutableSubscribableContentUserStore} from './app/objects/stores/contentUser/MutableSubscribableContentUserStore';

const myContainer = new Container()
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation).to(ActivatableDatedMutation)
myContainer.bind<any>(TYPES.Any).toConstantValue(null)
myContainer.bind<boolean>(TYPES.Boolean).toConstantValue(false)
myContainer.bind<ContentUserDataArgs>(TYPES.ContentUserDataArgs).to(ContentUserDataArgs)
myContainer.bind<DBSubscriberToTreeArgs>(TYPES.DBSubscriberToTreeArgs).to(DBSubscriberToTreeArgs)
myContainer.bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).toConstantValue(() => [])
myContainer.bind<FirebaseSaverArgs>(TYPES.FirebaseSaverArgs).to(FirebaseSaverArgs)
myContainer.bind<SubscribableGlobalStoreArgs>(TYPES.SubscribableGlobalStoreArgs).to(SubscribableGlobalStoreArgs)
myContainer.bind<IMutableSubscribableGlobalStore>
(TYPES.IMutableSubscribableGlobalStore).to(MutableSubscribableGlobalStore)
myContainer.bind<ITree>(TYPES.ITree).to(SubscribableTree)
myContainer.bind<IColorSlice>(TYPES.IColorSlice).to(ColorSlice)
myContainer.bind<IDatabaseSyncer>(TYPES.IDatabaseSyncer).to(SyncToDB)
// TODO: maybe only use this constant binding for a test container. . . Not production container
myContainer.bind<IDatedMutation<FieldMutationTypes>>(TYPES.IDatedMutation).toConstantValue({
    data: {id: '12345'},
    timestamp: Date.now(),
    type: FieldMutationTypes.SET,
})

myContainer.bind<IContentUserData>(TYPES.IContentUserData).to(ContentUserData)
myContainer.bind<IFirebaseRef>(TYPES.IFirebaseRef).to(FirebaseRef)
myContainer.bind<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore).to(MutableSubscribableTreeStore)
myContainer.bind<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)
    .to(MutableSubscribableTreeUserStore)
myContainer.bind<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)
    .to(MutableSubscribableTreeLocationStore)
myContainer.bind<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)
    .to(MutableSubscribableContentStore)
myContainer.bind<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)
    .to(MutableSubscribableContentUserStore)

myContainer.bind<MutableSubscribableGlobalStoreArgs>(TYPES.MutableSubscribableGlobalStoreArgs)
    .to(MutableSubscribableGlobalStoreArgs)

myContainer.bind<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree).to(MutableSubscribableTree)
myContainer.bind<IMutableStringSet>(TYPES.IMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<IProficiencyStats>(TYPES.IProficiencyStats).toConstantValue(defaultProficiencyStats)
myContainer.bind<IProppedDatedMutation<FieldMutationTypes, TreePropertyNames>>
(TYPES.IProppedDatedMutation).toConstantValue({
    data: {id: TREE_ID3},
    propertyName: TreePropertyNames.PARENT_ID,
    timestamp: Date.now(),
    type: FieldMutationTypes.SET,
})
myContainer.bind<ISigmaNode>(TYPES.ISigmaNode).to(SigmaNode)
myContainer.bind<ISigmaRenderManager>(TYPES.ISigmaRenderManager).to(SigmaRenderManager)
myContainer.bind<ISigmaNodeHandler>(TYPES.ISigmaNodeHandler).to(SigmaNodeHandler)
myContainer.bind<ISubscribableContent>(TYPES.ISubscribableContent).to(SubscribableContent)
myContainer.bind<ISubscribableContentUser>(TYPES.ISubscribableContentUser).to(SubscribableContentUser)
myContainer.bind<ISubscribableGlobalStore>(TYPES.ISubscribableGlobalStore).to(SubscribableGlobalStore)
myContainer.bind<ISubscribableTree>(TYPES.ISubscribableTree).to(SubscribableTree)
myContainer.bind<ISubscribableTreeUser>(TYPES.ISubscribableTreeUser).to(SubscribableTreeUser)
myContainer.bind<ISubscribableMutableField<boolean>>(TYPES.ISubscribableMutableBoolean).to(SubscribableMutableField)
myContainer.bind<SubscribableMutableFieldArgs>(TYPES.SubscribableMutableFieldArgs).to(SubscribableMutableFieldArgs)
myContainer.bind<SubscribableContentUserArgs>(TYPES.SubscribableContentUserArgs).to(SubscribableContentUserArgs)
myContainer.bind<ISubscribableMutableField<number>>(TYPES.ISubscribableMutableNumber).to(SubscribableMutableField)
myContainer.bind<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString).to(SubscribableMutableField)
myContainer.bind<ISubscribableMutableField<PROFICIENCIES>>(TYPES.ISubscribableMutableProficiency)
    .to(SubscribableMutableField)
myContainer.bind<ISubscribableMutableField<CONTENT_TYPES>>(TYPES.ISubscribableMutableContentType)
    .to(SubscribableMutableField)
myContainer.bind<ISubscribableMutableField<IProficiencyStats>>(TYPES.ISubscribableMutableProficiencyStats)
    .to(SubscribableMutableField)
myContainer.bind<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<ISubscribableStore<ISubscribableTreeCore>>
(TYPES.ISubscribableStore_ISubscribableTreeCore).to(SubscribableStore)
/* ^^ TODO: Why can't i specify the interface on the SubscribableStore type? */
myContainer.bind<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore).to(SubscribableTreeStore)
myContainer.bind<ISubscribableTreeUserStore>(TYPES.ISubscribableTreeUserStore).to(SubscribableTreeUserStore)
myContainer.bind<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore).to(SubscribableTreeLocationStore)
myContainer.bind<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore).to(SubscribableContentUserStore)
myContainer.bind<ISubscribableContentStore>(TYPES.ISubscribableContentStore).to(SubscribableContentStore)

myContainer.bind<radian>(TYPES.radian).toConstantValue(0)
myContainer.bind<SigmaNodeHandlerArgs>(TYPES.SigmaNodeHandlerArgs).to(SigmaNodeHandlerArgs)
myContainer.bind<CanvasUI>(TYPES.CanvasUI).to(CanvasUI)
myContainer.bind<CanvasUIArgs>(TYPES.CanvasUIArgs)
    .to(CanvasUIArgs)
myContainer.bind<SubscribableMutableStringSetArgs>
(TYPES.SubscribableMutableStringSetArgs).to(SubscribableMutableStringSetArgs)
myContainer.bind<SubscribableArgs>(TYPES.SubscribableArgs).to(SubscribableArgs)
myContainer.bind<SubscribableTreeArgs>(TYPES.SubscribableTreeArgs).to(SubscribableTreeArgs)
/* myContainer.bind<ISubscribable<IDetailedUpdates>>
(TYPES.Subscribable_IDetailedUpdates).to(Subscribable<IDetailedUpdates>);

 */
myContainer.bind<SubscribableContentArgs>(TYPES.SubscribableContentArgs).to(SubscribableContentArgs)
myContainer.bind<any[]>(TYPES.Array).toConstantValue([])
// tslint:disable-next-line ban-types
myContainer.bind<Number>(TYPES.Number).toConstantValue(0)
myContainer.bind<PROFICIENCIES>(TYPES.PROFICIENCIES).toConstantValue(PROFICIENCIES.ONE)
myContainer.bind<SigmaNodeArgs>(TYPES.SigmaNodeArgs).to(SigmaNodeArgs)
myContainer.bind<ISigmaRenderManager>(TYPES.SigmaRenderManager).to(SigmaRenderManager)
myContainer.bind<SigmaRenderManagerArgs>(TYPES.SigmaRenderManagerArgs).to(SigmaRenderManagerArgs)
// tslint:disable-next-line ban-types
myContainer.bind<String>(TYPES.String).toConstantValue('')
myContainer.bind<SyncToDBArgs>(TYPES.SyncToDBArgs).to(SyncToDBArgs)
myContainer.bind<SubscribableStoreArgs>(TYPES.SubscribableStoreArgs).to(SubscribableStoreArgs)
myContainer.bind<SubscribableTreeUserArgs>(TYPES.SubscribableTreeUserArgs).to(SubscribableTreeUserArgs)
myContainer.bind<ISaveUpdatesToDBFunction>(TYPES.ISaveUpdatesToDBFunction)
    .toConstantValue((updates: IDetailedUpdates) => void 0)
myContainer.bind<UIColor>(TYPES.UIColor).toConstantValue(UIColor.GRAY);
// tslint:disable-next-line ban-types
myContainer.bind<Object>(TYPES.Object).toConstantValue({})
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutationArr).to()

export {myContainer}
