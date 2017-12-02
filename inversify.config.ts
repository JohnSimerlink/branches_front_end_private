import {Container} from 'inversify'
import 'reflect-metadata'
import {ContentUserData, ContentUserDataArgs} from './app/objects/contentUserData/ContentUserData';
import {GlobalDataStoreArgs, SubscribableGlobalDataStore} from './app/objects/dataStores/SubscribableGlobalDataStore';
import {
    ISubscribableTreeDataStore, SubscribableDataStoreArgs,
    SubscribableTreeDataStore
} from './app/objects/dataStores/SubscribableTreeDataStore';
import {FirebaseRef} from './app/objects/dbSync/FirebaseRef';
import {FirebaseSaverArgs} from './app/objects/dbSync/FirebaseSaver';
import {SyncToDB, SyncToDBArgs} from './app/objects/dbSync/SyncToDB';
import {
    ISubscribableMutableIdArgs, SubscribableMutableId,
    SubscribableMutableIdArgs
} from './app/objects/id/SubscribableMutableId';
import {
    IBasicTree, IColorSlice, IContentUserData, IDatabaseSyncer, IDetailedUpdates,
    IdMutationTypes, IFirebaseRef, IMutableStringSet, IProficiencyStats, IProppedDatedMutation,
    ISaveUpdatesToDBFunction,
    ISigmaNode, ISubscribableTreeCore, ISubscribableMutableId, ISubscribableMutableStringSet,
    radian,
    TreePropertyNames
} from './app/objects/interfaces';
import {fGetSigmaIdsForContentId, ISigmaNodeHandler, ISubscribableGlobalDataStore} from './app/objects/interfaces';
import {IDatedMutation} from './app/objects/interfaces';
import {PROFICIENCIES} from './app/objects/proficiency/proficiencyEnum';
import {defaultProficiencyStats} from './app/objects/proficiencyStats/IProficiencyStats';
import {
    SubscribableMutableStringSet,
    SubscribableMutableStringSetArgs
} from './app/objects/set/SubscribableMutableStringSet';
import {ColorSlice} from './app/objects/sigmaNode/ColorSlice';
import {SigmaNode, SigmaNodeArgs} from './app/objects/sigmaNode/SigmaNode';
import {SigmaNodeHandler, SigmaNodeHandlerArgs} from './app/objects/sigmaNode/SigmaNodeHandler';
import {
    SigmaNodeHandlerSubscriber,
    SigmaNodeHandlerSubscriberArgs
} from './app/objects/sigmaNode/SigmaNodeHandlerSubscriber';
import {SubscribableArgs} from './app/objects/subscribable/Subscribable';
import {SubscribableTree, SubscribableBasicTreeArgs} from './app/objects/tree/SubscribableBasicTree';
import {TYPES} from './app/objects/types'
import {UIColor} from './app/objects/uiColor';
import {TREE_ID3} from './app/testHelpers/testHelpers';

const myContainer = new Container()
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation).to(ActivatableDatedMutation)
myContainer.bind<any>(TYPES.Any).toConstantValue(false)
myContainer.bind<boolean>(TYPES.Boolean).toConstantValue(false)
myContainer.bind<ContentUserDataArgs>(TYPES.ContentUserDataArgs).to(ContentUserDataArgs)
myContainer.bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).toConstantValue(() => [])
myContainer.bind<FirebaseSaverArgs>(TYPES.FirebaseSaverArgs).to(FirebaseSaverArgs)
myContainer.bind<GlobalDataStoreArgs>(TYPES.SubscribableGlobalDataStoreArgs).to(GlobalDataStoreArgs)
myContainer.bind<IBasicTree>(TYPES.IBasicTree).to(SubscribableTree)
myContainer.bind<IColorSlice>(TYPES.IColorSlice).to(ColorSlice)
myContainer.bind<IDatabaseSyncer>(TYPES.IDatabaseSyncer).to(SyncToDB)
// TODO: maybe only use this constant binding for a test container. . . Not production container
myContainer.bind<IDatedMutation<IdMutationTypes>>(TYPES.IDatedMutation).toConstantValue({
    data: {id: '12345'},
    timestamp: Date.now(),
    type: IdMutationTypes.SET,
})
myContainer.bind<IContentUserData>(TYPES.IContentUserData).to(ContentUserData)
myContainer.bind<IFirebaseRef>(TYPES.IFirebaseRef).to(FirebaseRef)
myContainer.bind<IMutableStringSet>(TYPES.IMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<IProficiencyStats>(TYPES.IProficiencyStats).toConstantValue(defaultProficiencyStats)
myContainer.bind<IProppedDatedMutation<IdMutationTypes, TreePropertyNames>>
(TYPES.IProppedDatedMutation).toConstantValue({
    data: {id: TREE_ID3},
    propertyName: TreePropertyNames.PARENT_ID,
    timestamp: Date.now(),
    type: IdMutationTypes.SET,
})
myContainer.bind<ISigmaNode>(TYPES.ISigmaNode).to(SigmaNode)
myContainer.bind<ISigmaNodeHandler>(TYPES.ISigmaNodeHandler).to(SigmaNodeHandler)
myContainer.bind<ISubscribableGlobalDataStore>(TYPES.ISubscribableGlobalDataStore).to(SubscribableGlobalDataStore)
myContainer.bind<ISubscribableTreeCore>(TYPES.ISubscribableTree).to(SubscribableTree)
myContainer.bind<ISubscribableMutableId>(TYPES.ISubscribableMutableId).to(SubscribableMutableId)
myContainer.bind<ISubscribableMutableIdArgs>(TYPES.ISubscribableMutableIdArgs).to(SubscribableMutableIdArgs)
myContainer.bind<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<ISubscribableTreeDataStore>(TYPES.ISubscribableTreeDataStore).to(SubscribableTreeDataStore)
myContainer.bind<radian>(TYPES.radian).toConstantValue(0)
myContainer.bind<SigmaNodeHandlerArgs>(TYPES.SigmaNodeHandlerArgs).to(SigmaNodeHandlerArgs)
myContainer.bind<SigmaNodeHandlerSubscriber>(TYPES.SigmaNodeHandlerSubscriber).to(SigmaNodeHandlerSubscriber)
myContainer.bind<SigmaNodeHandlerSubscriberArgs>(TYPES.SigmaNodeHandlerSubscriberArgs)
    .to(SigmaNodeHandlerSubscriberArgs)
myContainer.bind<SubscribableMutableStringSetArgs>
(TYPES.SubscribableMutableStringSetArgs).to(SubscribableMutableStringSetArgs)
myContainer.bind<SubscribableArgs>(TYPES.SubscribableArgs).to(SubscribableArgs)
myContainer.bind<SubscribableBasicTreeArgs>(TYPES.SubscribableTreeArgs).to(SubscribableBasicTreeArgs)
/* myContainer.bind<ISubscribable<IDetailedUpdates>>
(TYPES.Subscribable_IDetailedUpdates).to(Subscribable<IDetailedUpdates>);

 */

myContainer.bind<any[]>(TYPES.Array).toConstantValue([])
// tslint:disable-next-line ban-types
myContainer.bind<Number>(TYPES.Number).toConstantValue(0)
myContainer.bind<PROFICIENCIES>(TYPES.PROFICIENCIES).toConstantValue(PROFICIENCIES.ONE)
myContainer.bind<SigmaNodeArgs>(TYPES.SigmaNodeArgs).to(SigmaNodeArgs)
// tslint:disable-next-line ban-types
myContainer.bind<String>(TYPES.String).toConstantValue('')
myContainer.bind<SyncToDBArgs>(TYPES.SyncToDBArgs).to(SyncToDBArgs)
myContainer.bind<SubscribableDataStoreArgs>(TYPES.SubscribableDataStoreArgs).to(SubscribableDataStoreArgs)
myContainer.bind<ISaveUpdatesToDBFunction>(TYPES.ISaveUpdatesToDBFunction)
    .toConstantValue((updates: IDetailedUpdates) => void 0)
myContainer.bind<UIColor>(TYPES.UIColor).toConstantValue(UIColor.GRAY);
// tslint:disable-next-line ban-types
myContainer.bind<Object>(TYPES.Object).toConstantValue({})
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutationArr).to()

export {myContainer}
