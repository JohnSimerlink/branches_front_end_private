import {Container} from 'inversify'
import 'reflect-metadata'
import {ContentUserData, ContentUserDataArgs} from './app/objects/contentUserData/ContentUserData';
import {IContentUserData} from './app/objects/contentUserData/IContentUserData';
import {GlobalDataStoreArgs, SubscribableGlobalDataStore} from './app/objects/dataStores/SubscribableGlobalDataStore';
import {
    ISubscribableTreeDataStore, SubscribableDataStoreArgs,
    SubscribableTreeDataStore
} from './app/objects/dataStores/SubscribableTreeDataStore';
import {FirebaseRef} from './app/objects/dbSync/FirebaseRef';
import {FirebaseSaverArgs} from './app/objects/dbSync/FirebaseSaver';
import {IDatabaseSyncer} from './app/objects/dbSync/IDatabaseSyncer';
import {IDetailedUpdates} from './app/objects/dbSync/IDetailedUpdates';
import {IFirebaseRef} from './app/objects/dbSync/IFirebaseRef';
import {SaveUpdatesToDBFunction} from './app/objects/dbSync/ISaveUpdatesToDBFunction';
import {SyncToDB, SyncToDBArgs} from './app/objects/dbSync/SyncToDB';
import {IdMutationTypes} from './app/objects/id/IdMutationTypes';
import {ISubscribableMutableId} from './app/objects/id/ISubscribableMutableId';
import {
    ISubscribableMutableIdArgs, SubscribableMutableId,
    SubscribableMutableIdArgs
} from './app/objects/id/SubscribableMutableId';
import {fGetSigmaIdsForContentId, ISigmaNodeHandler} from './app/objects/interfaces';
import {radian} from './app/objects/MathUtils/MathUtils';
import {IDatedMutation} from './app/objects/mutations/IMutation';
import {PROFICIENCIES} from './app/objects/proficiency/proficiencyEnum';
import {defaultProficiencyStats, IProficiencyStats} from './app/objects/proficiencyStats/IProficiencyStats';
import {IMutableStringSet} from './app/objects/set/IMutableStringSet';
import {ISubscribableMutableStringSet} from './app/objects/set/ISubscribableMutableStringSet';
import {
    SubscribableMutableStringSet,
    SubscribableMutableStringSetArgs
} from './app/objects/set/SubscribableMutableStringSet';
import {ColorSlice} from './app/objects/sigmaNode/ColorSlice';
import {IColorSlice} from './app/objects/sigmaNode/IColorSlice';
import {ISigmaNode} from './app/objects/sigmaNode/ISigmaNode';
import {SigmaNode, SigmaNodeArgs} from './app/objects/sigmaNode/SigmaNode';
import {SigmaNodeHandler, SigmaNodeHandlerArgs} from './app/objects/sigmaNode/SigmaNodeHandler';
import {
    SigmaNodeHandlerSubscriber,
    SigmaNodeHandlerSubscriberArgs
} from './app/objects/sigmaNode/SigmaNodeHandlerSubscriber';
import {SubscribableArgs} from './app/objects/subscribable/Subscribable';
import {IBasicTree} from './app/objects/tree/IBasicTree';
import {ISubscribableBasicTreeCore} from './app/objects/tree/ISubscribableBasicTree';
import {SubscribableBasicTree, SubscribableBasicTreeArgs} from './app/objects/tree/SubscribableBasicTree';
import {TYPES} from './app/objects/types'
import {UIColor} from './app/objects/uiColor';

const myContainer = new Container()
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation).to(ActivatableDatedMutation)
myContainer.bind<any>(TYPES.Any).toConstantValue(false)
myContainer.bind<boolean>(TYPES.Boolean).toConstantValue(false)
myContainer.bind<ContentUserDataArgs>(TYPES.ContentUserDataArgs).to(ContentUserDataArgs)
myContainer.bind<fGetSigmaIdsForContentId>(TYPES.fGetSigmaIdsForContentId).toConstantValue(() => [])
myContainer.bind<FirebaseSaverArgs>(TYPES.FirebaseSaverArgs).to(FirebaseSaverArgs)
myContainer.bind<SubscribableGlobalDataStore>(TYPES.GlobalDataStore).to(SubscribableGlobalDataStore)
myContainer.bind<GlobalDataStoreArgs>(TYPES.GlobalDataStoreArgs).to(GlobalDataStoreArgs)
myContainer.bind<IBasicTree>(TYPES.IBasicTree).to(SubscribableBasicTree)
myContainer.bind<IColorSlice>(TYPES.IColorSlice).to(ColorSlice)
myContainer.bind<IDatabaseSyncer>(TYPES.IDatabaseSyncer).to(SyncToDB)
myContainer.bind<IDatedMutation<IdMutationTypes>>(TYPES.IDatedMutation).toConstantValue({
    data: {id: '12345'},
    timestamp: Date.now(),
    type: IdMutationTypes.SET,
})
myContainer.bind<IContentUserData>(TYPES.IContentUserData).to(ContentUserData)
myContainer.bind<IFirebaseRef>(TYPES.IFirebaseRef).to(FirebaseRef)
myContainer.bind<IProficiencyStats>(TYPES.IProficiencyStats).toConstantValue(defaultProficiencyStats)
myContainer.bind<ISigmaNode>(TYPES.ISigmaNode).to(SigmaNode)
myContainer.bind<ISigmaNodeHandler>(TYPES.ISigmaNodeHandler).to(SigmaNodeHandler)
myContainer.bind<SigmaNodeHandlerArgs>(TYPES.SigmaNodeHandlerArgs).to(SigmaNodeHandlerArgs)
myContainer.bind<SigmaNodeHandlerSubscriber>(TYPES.SigmaNodeHandlerSubscriber).to(SigmaNodeHandlerSubscriber)
myContainer.bind<SigmaNodeHandlerSubscriberArgs>(TYPES.SigmaNodeHandlerSubscriberArgs)
    .to(SigmaNodeHandlerSubscriberArgs)
myContainer.bind<SubscribableGlobalDataStore>(TYPES.SubscribableGlobalDataStore).to(SubscribableGlobalDataStore)
myContainer.bind<ISubscribableBasicTreeCore>(TYPES.ISubscribableBasicTree).to(SubscribableBasicTree)
myContainer.bind<ISubscribableMutableId>(TYPES.ISubscribableMutableId).to(SubscribableMutableId)
myContainer.bind<ISubscribableMutableIdArgs>(TYPES.ISubscribableMutableIdArgs).to(SubscribableMutableIdArgs)
myContainer.bind<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<ISubscribableTreeDataStore>(TYPES.ISubscribableTreeDataStore).to(SubscribableTreeDataStore)
myContainer.bind<radian>(TYPES.radian).toConstantValue(0)
myContainer.bind<SubscribableMutableStringSetArgs>
(TYPES.SubscribableMutableStringSetArgs).to(SubscribableMutableStringSetArgs)
myContainer.bind<SubscribableArgs>(TYPES.SubscribableArgs).to(SubscribableArgs)
myContainer.bind<SubscribableBasicTreeArgs>(TYPES.SubscribableBasicTreeArgs).to(SubscribableBasicTreeArgs)
// myContainer.bind<ISubscribable<IDetailedUpdates>>(TYPES.Subscribable_IDetailedUpdates).to(Subscribable<IDetailedUpdates>);

myContainer.bind<IMutableStringSet>(TYPES.IMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<any[]>(TYPES.Array).toConstantValue([])
// tslint:disable-next-line ban-types
myContainer.bind<Number>(TYPES.Number).toConstantValue(0)
myContainer.bind<PROFICIENCIES>(TYPES.PROFICIENCIES).toConstantValue(PROFICIENCIES.ONE)
myContainer.bind<SigmaNodeArgs>(TYPES.SigmaNodeArgs).to(SigmaNodeArgs)
// tslint:disable-next-line ban-types
myContainer.bind<String>(TYPES.String).toConstantValue('')
myContainer.bind<SyncToDBArgs>(TYPES.SyncToDBArgs).to(SyncToDBArgs)
myContainer.bind<SubscribableDataStoreArgs>(TYPES.SubscribableDataStoreArgs).to(SubscribableDataStoreArgs)
myContainer.bind<SaveUpdatesToDBFunction>(TYPES.SaveUpdatesToDBFunction)
    .toConstantValue((updates: IDetailedUpdates) => void 0)
myContainer.bind<UIColor>(TYPES.UIColor).toConstantValue(UIColor.GRAY);
// tslint:disable-next-line ban-types
myContainer.bind<Object>(TYPES.Object).toConstantValue({})
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutationArr).to()

export {myContainer}
