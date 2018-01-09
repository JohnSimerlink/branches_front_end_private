import * as firebase from 'firebase';
import {log} from './app/core/log'
log('About to import sigmaConfigurations from inversify config')
import './other_imports/sigmaConfigurations'
log('just imported sigmaConfigurations from inversify config')
import sigma from './other_imports/sigma/sigma.core.js'
log('just imported sigma from sigma core')
import {Container, ContainerModule, interfaces} from 'inversify'
import 'reflect-metadata'
import {App, AppArgs} from './app/core/app';
import {FIREBASE_PATHS} from './app/loaders/paths';
import {TreeLoader, TreeLoaderArgs} from './app/loaders/tree/TreeLoader';
import {TreeLocationLoader, TreeLocationLoaderArgs} from './app/loaders/treeLocation/TreeLocationLoader';
import {SubscribableContent, SubscribableContentArgs} from './app/objects/content/SubscribableContent';
import {ContentUserData, ContentUserDataArgs} from './app/objects/contentUser/ContentUserData';
import {
    SubscribableContentUser,
    SubscribableContentUserArgs
} from './app/objects/contentUser/SubscribableContentUser';
import {FirebaseRef} from './app/objects/dbSync/FirebaseRef';
import {FirebaseSaverArgs} from './app/objects/dbSync/FirebaseSaver';
import {SyncToDB, SyncToDBArgs} from './app/objects/dbSync/SyncToDB';
import {
    SubscribableMutableField,
    SubscribableMutableFieldArgs
} from './app/objects/field/SubscribableMutableField';
import firebaseDevConfig = require('./app/objects/firebase.dev.config.json')
import Reference = firebase.database.Reference;
// import firebase from './app/objects/firebaseService.js'
import {
    FieldMutationTypes, IColorSlice, IContentLoader, IContentUserData, IDatabaseSyncer, IDetailedUpdates,
    IFirebaseRef, IMutableStringSet, IMutableSubscribableContent, IMutableSubscribableContentUser, IProficiencyStats,
    IProppedDatedMutation,
    ISaveUpdatesToDBFunction, ISigma,
    ISigmaNode, ISubscribableContentUser,
    ISubscribableMutableField, ISubscribableMutableStringSet, ITree, ITreeUserLoader,
    radian,
    TreePropertyNames
} from './app/objects/interfaces';
import {
    IApp,
    IDatedMutation, IDBSubscriberToTree, IDBSubscriberToTreeLocation, IMutableSubscribablePoint,
    IStoreSourceUpdateListenerCore,
    ISubscribableContentStoreSource,
    ISubscribableContentUserStoreSource, ISubscribableTreeLocation, ISubscribableTreeLocationStoreSource,
    ISubscribableTreeStoreSource,
    ISubscribableTreeUserStoreSource, ITreeLoader, ITreeLocationLoader,
    ObjectDataTypes
} from './app/objects/interfaces';
import {
    CONTENT_TYPES,
    fGetSigmaIdsForContentId, IMutableSubscribableContentStore,
    IMutableSubscribableContentUserStore,
    IMutableSubscribableGlobalStore, IMutableSubscribableTree,
    IMutableSubscribableTreeLocation, IMutableSubscribableTreeLocationStore,
    IMutableSubscribableTreeStore, IMutableSubscribableTreeUserStore, IRenderedNodesManager, IRenderedNodesManagerCore,
    ISigmaNodesUpdater,
    ISigmaRenderManager,
    IStoreSourceUpdateListener, ISubscribableContent,
    ISubscribableContentStore,
    ISubscribableContentUserStore,
    ISubscribableGlobalStore, ISubscribableTree, ISubscribableTreeLocationStore,
    ISubscribableTreeStore,
    ISubscribableTreeUser,
    ISubscribableTreeUserStore,
    ISigmaUpdater,
    IContentUserLoader,
    IMutableSubscribableTreeUser,
} from './app/objects/interfaces';
import {MutableSubscribablePoint, MutableSubscribablePointArgs} from './app/objects/point/MutableSubscribablePoint';
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
import {RenderedNodesManager, RenderedNodesManagerArgs} from './app/objects/sigmaNode/RenderedNodesManager';
import {RenderedNodesManagerCore, RenderedNodesManagerCoreArgs} from './app/objects/sigmaNode/RenderedNodesManagerCore';
import {SigmaNode, SigmaNodeArgs} from './app/objects/sigmaNode/SigmaNode';
import {SigmaNodesUpdater, SigmaNodesUpdaterArgs} from './app/objects/sigmaNode/SigmaNodesUpdater';
import {SigmaRenderManager, SigmaRenderManagerArgs} from './app/objects/sigmaNode/SigmaRenderManager';
import {MutableSubscribableContentStore} from './app/objects/stores/content/MutableSubscribableContentStore';
import {
    SubscribableContentStore,
    SubscribableContentStoreArgs
} from './app/objects/stores/content/SubscribableContentStore';
import {
    MutableSubscribableContentUserStore
} from './app/objects/stores/contentUser/MutableSubscribableContentUserStore';
import {
    SubscribableContentUserStore,
    SubscribableContentUserStoreArgs
} from './app/objects/stores/contentUser/SubscribableContentUserStore';
import {
    MutableSubscribableGlobalStore,
    MutableSubscribableGlobalStoreArgs
} from './app/objects/stores/MutableSubscribableGlobalStore';
import {StoreSourceUpdateListener, StoreSourceUpdateListenerArgs} from './app/objects/stores/StoreSourceUpdateListener';
import {
    StoreSourceUpdateListenerCore,
    StoreSourceUpdateListenerCoreArgs
} from './app/objects/stores/StoreSourceUpdateListenerCore';
import {SubscribableGlobalStore, SubscribableGlobalStoreArgs} from './app/objects/stores/SubscribableGlobalStore';
import {
    SubscribableContentStoreSource, SubscribableContentStoreSourceArgs,
    SubscribableContentUserStoreSource, SubscribableContentUserStoreSourceArgs,
    SubscribableStoreSourceArgs, SubscribableTreeLocationStoreSource,
    SubscribableTreeLocationStoreSourceArgs,
    SubscribableTreeStoreSource,
    SubscribableTreeStoreSourceArgs, SubscribableTreeUserStoreSource, SubscribableTreeUserStoreSourceArgs
} from './app/objects/stores/SubscribableStoreSource';
import {MutableSubscribableTreeStore} from './app/objects/stores/tree/MutableSubscribableTreeStore';
import {SubscribableTreeStore, SubscribableTreeStoreArgs} from './app/objects/stores/tree/SubscribableTreeStore';
import {
    MutableSubscribableTreeLocationStore
} from './app/objects/stores/treeLocation/MutableSubscribableTreeLocationStore';
import {
    SubscribableTreeLocationStore,
    SubscribableTreeLocationStoreArgs
} from './app/objects/stores/treeLocation/SubscribableTreeLocationStore';
import {MutableSubscribableTreeUserStore} from './app/objects/stores/treeUser/MutableSubscribableTreeUserStore';
import {
    SubscribableTreeUserStore,
    SubscribableTreeUserStoreArgs
} from './app/objects/stores/treeUser/SubscribableTreeUserStore';
import {SubscribableArgs} from './app/objects/subscribable/Subscribable';
import {DBSubscriberToTree, DBSubscriberToTreeArgs} from './app/objects/tree/DBSubscriberToTree';
import {MutableSubscribableTree} from './app/objects/tree/MutableSubscribableTree';
import {SubscribableTree, SubscribableTreeArgs} from './app/objects/tree/SubscribableTree';
import {
    DBSubscriberToTreeLocation,
    DBSubscriberToTreeLocationArgs
} from './app/objects/treeLocation/DBSubscriberToTreeLocation';
import {MutableSubscribableTreeLocation} from './app/objects/treeLocation/MutableSubscribableTreeLocation';
import {
    SubscribableTreeLocation,
    SubscribableTreeLocationArgs
} from './app/objects/treeLocation/SubscribableTreeLocation';
import {SubscribableTreeUser, SubscribableTreeUserArgs} from './app/objects/treeUser/SubscribableTreeUser';
import {TYPES } from './app/objects/types'
import {UIColor} from './app/objects/uiColor';
import { TREE_ID3} from './app/testHelpers/testHelpers';
import {SigmaUpdaterArgs, SigmaUpdater} from './app/objects/sigmaUpdater/sigmaUpdater';
// import SigmaConfigs = SigmaJs.SigmaConfigs;
// import Sigma = SigmaJs.Sigma;
import {GRAPH_CONTAINER_ID} from './app/core/globals';
import {ContentLoader, ContentLoaderArgs} from './app/loaders/content/ContentLoader';
import {ContentUserLoader, ContentUserLoaderArgs} from './app/loaders/contentUser/ContentUserLoader';
import {TreeUserLoader, TreeUserLoaderArgs} from './app/loaders/treeUser/TreeUserLoader';
import {MutableSubscribableContent} from './app/objects/content/MutableSubscribableContent';
import {MutableSubscribableTreeUser} from './app/objects/treeUser/MutableSubscribableTreeUser';
import {MutableSubscribableContentUser} from './app/objects/contentUser/MutableSubscribableContentUser';
// import {SigmaJs} from 'sigmajs';

const firebaseConfig = firebaseDevConfig
const myContainer = new Container()

const sigmaInstance /*: Sigma*/ = new sigma({
        graph: {
            nodes: [],
            edges: []
        },
        container: GRAPH_CONTAINER_ID,
        glyphScale: 0.7,
        glyphFillColor: '#666',
        glyphTextColor: 'white',
        glyphStrokeColor: 'transparent',
        glyphFont: 'FontAwesome',
        glyphFontStyle: 'normal',
        glyphTextThreshold: 6,
        glyphThreshold: 3,
    } as any/* as SigmaConfigs*/) as any
// throw new Error('inversify error error error')

// const firebaseConfig = {
//     apiKey: 'AIzaSyCqzA9NxQsKpY4WzKbJf59nvrf-8-60i8A',
//     authDomain: 'branches-dev.firebaseapp.com',
//     databaseURL: 'https://branches-dev.firebaseio.com',
//     projectId: 'branches-dev',
//     storageBucket: 'branches-dev.appspot.com',
//     messagingSenderId: '354929800016'
// }
firebase.initializeApp(firebaseConfig)
const treesRef = firebase.database().ref(FIREBASE_PATHS.TREES)
const treeLocationsRef = firebase.database().ref(FIREBASE_PATHS.TREE_LOCATIONS)
const contentRef = firebase.database().ref(FIREBASE_PATHS.CONTENT)
const contentUsersRef = firebase.database().ref(FIREBASE_PATHS.CONTENT_USERS)
const treeUsersRef = firebase.database().ref(FIREBASE_PATHS.TREE_USERS)
const loaders = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    myContainer.bind<IContentLoader>(TYPES.IContentLoader).to(ContentLoader)
    myContainer.bind<IContentUserLoader>(TYPES.IContentUserLoader).to(ContentUserLoader)
    myContainer.bind<ITreeLoader>(TYPES.ITreeLoader).to(TreeLoader)
    myContainer.bind<ITreeUserLoader>(TYPES.ITreeUserLoader).to(TreeUserLoader)
    myContainer.bind<ITreeUserLoader>(TYPES.ITreeUserLoader).to(TreeUserLoader)
    myContainer.bind<ITreeLocationLoader>(TYPES.ITreeLocationLoader).to(TreeLocationLoader)
    myContainer.bind<TreeLocationLoaderArgs>(TYPES.TreeLocationLoaderArgs).to(TreeLocationLoaderArgs)
    myContainer.bind<TreeUserLoaderArgs>(TYPES.TreeUserLoaderArgs).to(TreeUserLoaderArgs)
    myContainer.bind<TreeLoaderArgs>(TYPES.TreeLoaderArgs).to(TreeLoaderArgs)
    myContainer.bind<ContentLoaderArgs>(TYPES.ContentLoaderArgs).to(ContentLoaderArgs)
    myContainer.bind<ContentUserLoaderArgs>(TYPES.ContentUserLoaderArgs).to(ContentUserLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treesRef)
        .whenInjectedInto(TreeLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treeLocationsRef)
        .whenInjectedInto(TreeLocationLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentRef)
        .whenInjectedInto(ContentLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(contentUsersRef)
        .whenInjectedInto(ContentUserLoaderArgs)
    myContainer.bind<Reference>(TYPES.FirebaseReference).toConstantValue(treeUsersRef)
        .whenInjectedInto(TreeUserLoaderArgs)
})
const subscribableTreeStoreSourceSingleton: ISubscribableTreeStoreSource
    = new SubscribableTreeStoreSource({hashmap: {}, updatesCallbacks: [], type: ObjectDataTypes.TREE_DATA})
const subscribableTreeLocationStoreSourceSingleton: ISubscribableTreeLocationStoreSource
    = new SubscribableTreeLocationStoreSource(
        {hashmap: {}, updatesCallbacks: [], type: ObjectDataTypes.TREE_LOCATION_DATA})
const subscribableTreeUserStoreSourceSingleton: ISubscribableTreeUserStoreSource
    = new SubscribableTreeUserStoreSource({hashmap: {}, updatesCallbacks: [], type: ObjectDataTypes.TREE_LOCATION_DATA})
const subscribableContentStoreSourceSingleton: ISubscribableContentStoreSource
    = new SubscribableContentStoreSource({hashmap: {}, updatesCallbacks: [], type: ObjectDataTypes.CONTENT_DATA})
const subscribableContentUserStoreSourceSingleton: ISubscribableContentUserStoreSource
    = new SubscribableContentUserStoreSource
({hashmap: {}, updatesCallbacks: [], type: ObjectDataTypes.CONTENT_USER_DATA})

const stores = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<ISubscribableTreeLocationStoreSource>(TYPES.ISubscribableTreeLocationStoreSource)
        .toConstantValue(subscribableTreeLocationStoreSourceSingleton)
    bind<ISubscribableTreeStoreSource>(TYPES.ISubscribableTreeStoreSource)
        .toConstantValue(subscribableTreeStoreSourceSingleton)
    bind<ISubscribableTreeUserStoreSource>(TYPES.ISubscribableTreeUserStoreSource)
        .toConstantValue(subscribableTreeUserStoreSourceSingleton)
    bind<ISubscribableContentStoreSource>(TYPES.ISubscribableContentStoreSource)
        .toConstantValue(subscribableContentStoreSourceSingleton)
    bind<ISubscribableContentUserStoreSource>(TYPES.ISubscribableContentUserStoreSource)
        .toConstantValue(subscribableContentUserStoreSourceSingleton)

    bind<SubscribableGlobalStoreArgs>(TYPES.SubscribableGlobalStoreArgs).to(SubscribableGlobalStoreArgs)
    bind<IMutableSubscribableGlobalStore>
    (TYPES.IMutableSubscribableGlobalStore).to(MutableSubscribableGlobalStore)

    bind<SubscribableContentUserStoreArgs>(TYPES.SubscribableContentUserStoreArgs)
        .to(SubscribableContentUserStoreArgs)
    bind<SubscribableContentStoreArgs>(TYPES.SubscribableContentStoreArgs).to(SubscribableContentStoreArgs)
    bind<SubscribableTreeStoreArgs>(TYPES.SubscribableTreeStoreArgs).to(SubscribableTreeStoreArgs)
    bind<SubscribableTreeUserStoreArgs>(TYPES.SubscribableTreeUserStoreArgs).to(SubscribableTreeUserStoreArgs)
    bind<SubscribableTreeLocationStoreArgs>(TYPES.SubscribableTreeLocationStoreArgs)
        .to(SubscribableTreeLocationStoreArgs)

    bind<IMutableSubscribableTreeStore>(TYPES.IMutableSubscribableTreeStore).to(MutableSubscribableTreeStore)
    bind<IMutableSubscribableTreeUserStore>(TYPES.IMutableSubscribableTreeUserStore)
        .to(MutableSubscribableTreeUserStore)
    bind<IMutableSubscribableTreeLocationStore>(TYPES.IMutableSubscribableTreeLocationStore)
        .to(MutableSubscribableTreeLocationStore)
    bind<IMutableSubscribableContentStore>(TYPES.IMutableSubscribableContentStore)
        .to(MutableSubscribableContentStore)
    bind<IMutableSubscribableContentUserStore>(TYPES.IMutableSubscribableContentUserStore)
        .to(MutableSubscribableContentUserStore)

    bind<SubscribableStoreSourceArgs>(TYPES.SubscribableStoreSourceArgs)
        .to(SubscribableStoreSourceArgs)

    bind<MutableSubscribableGlobalStoreArgs>(TYPES.MutableSubscribableGlobalStoreArgs)
        .to(MutableSubscribableGlobalStoreArgs)

    bind<ISubscribableGlobalStore>(TYPES.ISubscribableGlobalStore).to(SubscribableGlobalStore)

    bind<SubscribableContentStoreSourceArgs>(TYPES.SubscribableContentStoreSourceArgs)
        .to(SubscribableContentStoreSourceArgs)

    bind<SubscribableContentUserStoreSourceArgs>(TYPES.SubscribableContentUserStoreSourceArgs)
        .to(SubscribableContentUserStoreSourceArgs)
    bind<SubscribableTreeStoreSourceArgs>(TYPES.SubscribableTreeStoreSourceArgs)
        .to(SubscribableTreeStoreSourceArgs)
    bind<SubscribableTreeLocationStoreSourceArgs>(TYPES.SubscribableTreeLocationStoreSourceArgs)
        .to(SubscribableTreeLocationStoreSourceArgs)
    bind<SubscribableTreeUserStoreSourceArgs>(TYPES.SubscribableTreeUserStoreSourceArgs)
        .to(SubscribableTreeUserStoreSourceArgs)
// myContainer.bind<ISubscribableStore<ISubscribableTreeCore>>
// (TYPES.ISubscribableStore_ISubscribableTreeCore).to(SubscribableStore)
    /* ^^ TODO: Why can't i specify the interface on the SubscribableStore type? */
    bind<ISubscribableTreeStore>(TYPES.ISubscribableTreeStore).to(SubscribableTreeStore)
    bind<ISubscribableTreeUserStore>(TYPES.ISubscribableTreeUserStore).to(SubscribableTreeUserStore)
    bind<ISubscribableTreeLocationStore>(TYPES.ISubscribableTreeLocationStore).to(SubscribableTreeLocationStore)
    bind<ISubscribableContentUserStore>(TYPES.ISubscribableContentUserStore).to(SubscribableContentUserStore)
    bind<ISubscribableContentStore>(TYPES.ISubscribableContentStore).to(SubscribableContentStore)

    bind<ObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(ObjectDataTypes.TREE_DATA)
        .whenInjectedInto(SubscribableTreeStoreSourceArgs)
    bind<ObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(ObjectDataTypes.TREE_LOCATION_DATA)
        .whenInjectedInto(SubscribableTreeLocationStoreSourceArgs)
    bind<ObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(ObjectDataTypes.TREE_USER_DATA)
        .whenInjectedInto(SubscribableTreeUserStoreSourceArgs)
    bind<ObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(ObjectDataTypes.CONTENT_DATA)
        .whenInjectedInto(SubscribableContentStoreSourceArgs)
    bind<ObjectDataTypes>(TYPES.ObjectDataTypes).toConstantValue(ObjectDataTypes.CONTENT_USER_DATA)
        .whenInjectedInto(SubscribableContentUserStoreSourceArgs)
})
//
const rendering = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<radian>(TYPES.radian).toConstantValue(0)
    bind<SigmaNodesUpdaterArgs>(TYPES.SigmaNodesUpdaterArgs).to(SigmaNodesUpdaterArgs)
    bind<CanvasUI>(TYPES.CanvasUI).to(CanvasUI)
    bind<CanvasUIArgs>(TYPES.CanvasUIArgs)
        .to(CanvasUIArgs)

    bind<SigmaNodeArgs>(TYPES.SigmaNodeArgs).to(SigmaNodeArgs)
    bind<ISigmaRenderManager>(TYPES.SigmaRenderManager).to(SigmaRenderManager)
    bind<SigmaRenderManagerArgs>(TYPES.SigmaRenderManagerArgs).to(SigmaRenderManagerArgs)
    bind<SigmaUpdaterArgs>(TYPES.SigmaUpdaterArgs).to(SigmaUpdaterArgs)

    bind<ISigma>(TYPES.ISigma).toConstantValue(sigmaInstance)

    bind<ISigmaUpdater>(TYPES.ISigmaUpdater).to(SigmaUpdater)

    bind<StoreSourceUpdateListenerArgs>(TYPES.StoreSourceUpdateListenerArgs).to(StoreSourceUpdateListenerArgs)
    bind<IStoreSourceUpdateListener>(TYPES.IStoreSourceUpdateListener).to(StoreSourceUpdateListener)

    bind<StoreSourceUpdateListenerCoreArgs>(TYPES.StoreSourceUpdateListenerCoreArgs)
        .to(StoreSourceUpdateListenerCoreArgs)
    bind<IStoreSourceUpdateListenerCore>(TYPES.IStoreSourceUpdateListenerCore).to(StoreSourceUpdateListenerCore)

    bind<IRenderedNodesManager>(TYPES.IRenderedNodesManager).to(RenderedNodesManager)
    bind<IRenderedNodesManagerCore>(TYPES.IRenderedNodesManagerCore).to(RenderedNodesManagerCore)
    bind<RenderedNodesManagerArgs>(TYPES.RenderedNodesManagerArgs).to(RenderedNodesManagerArgs)
    bind<RenderedNodesManagerCoreArgs>(TYPES.RenderedNodesManagerCoreArgs).to(RenderedNodesManagerCoreArgs)
    bind<ISigmaNode>(TYPES.ISigmaNode).to(SigmaNode)
    bind<ISigmaRenderManager>(TYPES.ISigmaRenderManager).to(SigmaRenderManager)
    bind<ISigmaNodesUpdater>(TYPES.ISigmaNodesUpdater).to(SigmaNodesUpdater)

    bind<IColorSlice>(TYPES.IColorSlice).to(ColorSlice)
    bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).toConstantValue(() => [])
})
//
const dataObjects = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<IDatedMutation<FieldMutationTypes>>(TYPES.IDatedMutation).toConstantValue({
        data: {id: '12345'},
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    })
    bind<IProppedDatedMutation<FieldMutationTypes, TreePropertyNames>>
    (TYPES.IProppedDatedMutation).toConstantValue({
        data: {id: TREE_ID3},
        propertyName: TreePropertyNames.PARENT_ID,
        timestamp: Date.now(),
        type: FieldMutationTypes.SET,
    })
    bind<ContentUserDataArgs>(TYPES.ContentUserDataArgs).to(ContentUserDataArgs)
    bind<DBSubscriberToTreeArgs>(TYPES.DBSubscriberToTreeArgs).to(DBSubscriberToTreeArgs)
    bind<DBSubscriberToTreeLocationArgs>(TYPES.DBSubscriberToTreeLocationArgs)
        .to(DBSubscriberToTreeLocationArgs)

    bind<IMutableSubscribablePoint>(TYPES.IMutableSubscribablePoint).to(MutableSubscribablePoint)
    bind<MutableSubscribablePointArgs>(TYPES.MutableSubscribablePointArgs).to(MutableSubscribablePointArgs)

    bind<ISubscribableContent>(TYPES.ISubscribableContent).to(SubscribableContent)
    bind<ISubscribableContentUser>(TYPES.ISubscribableContentUser).to(SubscribableContentUser)
    bind<ISubscribableTree>(TYPES.ISubscribableTree).to(SubscribableTree)
    bind<ISubscribableTreeLocation>(TYPES.ISubscribableTreeLocation).to(SubscribableTreeLocation)
    bind<ISubscribableTreeUser>(TYPES.ISubscribableTreeUser).to(SubscribableTreeUser)
    bind<ISubscribableMutableField<boolean>>(TYPES.ISubscribableMutableBoolean).to(SubscribableMutableField)
    bind<SubscribableMutableFieldArgs>(TYPES.SubscribableMutableFieldArgs).to(SubscribableMutableFieldArgs)
    bind<SubscribableContentUserArgs>(TYPES.SubscribableContentUserArgs).to(SubscribableContentUserArgs)
    bind<ISubscribableMutableField<number>>(TYPES.ISubscribableMutableNumber).to(SubscribableMutableField)
    bind<ISubscribableMutableField<string>>(TYPES.ISubscribableMutableString).to(SubscribableMutableField)
    bind<ISubscribableMutableField<PROFICIENCIES>>(TYPES.ISubscribableMutableProficiency)
        .to(SubscribableMutableField)
    bind<ISubscribableMutableField<CONTENT_TYPES>>(TYPES.ISubscribableMutableContentType)
        .to(SubscribableMutableField)
    bind<ISubscribableMutableField<IProficiencyStats>>(TYPES.ISubscribableMutableProficiencyStats)
        .to(SubscribableMutableField)
    bind<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet).to(SubscribableMutableStringSet)
//
    bind<SubscribableMutableStringSetArgs>
    (TYPES.SubscribableMutableStringSetArgs).to(SubscribableMutableStringSetArgs)
    bind<SubscribableArgs>(TYPES.SubscribableArgs).to(SubscribableArgs)
    bind<SubscribableTreeArgs>(TYPES.SubscribableTreeArgs).to(SubscribableTreeArgs)
    bind<SubscribableTreeLocationArgs>(TYPES.SubscribableTreeLocationArgs).to(SubscribableTreeLocationArgs)

    bind<IMutableSubscribableTree>(TYPES.IMutableSubscribableTree).to(MutableSubscribableTree)
    bind<IMutableSubscribableTreeLocation>(TYPES.IMutableSubscribableTreeLocation).to(MutableSubscribableTreeLocation)
    bind<IMutableSubscribableTreeUser>(TYPES.IMutableSubscribableTreeUser).to(MutableSubscribableTreeUser)
    bind<IMutableSubscribableContent>(TYPES.IMutableSubscribableContent).to(MutableSubscribableContent)
    bind<IMutableSubscribableContentUser>(TYPES.IMutableSubscribableContentUser).to(MutableSubscribableContentUser)
    bind<IMutableStringSet>(TYPES.IMutableStringSet).to(SubscribableMutableStringSet)

    bind<SubscribableTreeUserArgs>(TYPES.SubscribableTreeUserArgs).to(SubscribableTreeUserArgs)
    bind<IDatabaseSyncer>(TYPES.IDatabaseSyncer).to(SyncToDB)
    bind<IDBSubscriberToTree>(TYPES.IDBSubscriberToTree).to(DBSubscriberToTree)
    bind<IDBSubscriberToTreeLocation>(TYPES.IDBSubscriberToTreeLocation).to(DBSubscriberToTreeLocation)
    bind<SubscribableContentArgs>(TYPES.SubscribableContentArgs).to(SubscribableContentArgs)

    bind<PROFICIENCIES>(TYPES.PROFICIENCIES).toConstantValue(PROFICIENCIES.ONE)

// tslint:disable-next-line ban-types
    bind<SyncToDBArgs>(TYPES.SyncToDBArgs).to(SyncToDBArgs)
    bind<ISaveUpdatesToDBFunction>(TYPES.ISaveUpdatesToDBFunction)
        .toConstantValue((updates: IDetailedUpdates) => void 0)
    bind<UIColor>(TYPES.UIColor).toConstantValue(UIColor.GRAY);
// tslint:disable-next-line ban-types

    bind<FirebaseSaverArgs>(TYPES.FirebaseSaverArgs).to(FirebaseSaverArgs)
    bind<ITree>(TYPES.ITree).to(SubscribableTree)
// TODO: maybe only use this constant binding for a test container. . . Not production container

    bind<IContentUserData>(TYPES.IContentUserData).to(ContentUserData)
    bind<IFirebaseRef>(TYPES.IFirebaseRef).to(FirebaseRef)

    bind<IProficiencyStats>(TYPES.IProficiencyStats).toConstantValue(defaultProficiencyStats)
})
// app

const app = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<IApp>(TYPES.IApp).to(App)
    bind<AppArgs>(TYPES.AppArgs).to(AppArgs)
})
const misc = new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
    bind<() => void>(TYPES.Function).toConstantValue(() => void 0)
    bind<any>(TYPES.Any).toConstantValue(null)
    bind<boolean>(TYPES.Boolean).toConstantValue(false)
    bind<string>(TYPES.String).toConstantValue('')
    bind<any[]>(TYPES.Array).toDynamicValue((context: interfaces.Context) => [] )
// tslint:disable-next-line ban-types
    bind<Number>(TYPES.Number).toConstantValue(0)
    bind<object>(TYPES.Object).toDynamicValue((context: interfaces.Context) => ({}))
})

myContainer.load(stores)
myContainer.load(loaders)
myContainer.load(rendering)
myContainer.load(dataObjects)
myContainer.load(app)
myContainer.load(misc)

export {myContainer}
