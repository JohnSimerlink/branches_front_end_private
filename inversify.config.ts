import {Container} from 'inversify'
import 'reflect-metadata'
import {ContentUserData, ContentUserDataArgs} from './app/objects/contentUserData/ContentUserData';
import {ContentUserDataUtils} from './app/objects/contentUserData/ContentUserDataUtils';
import {IContentUserData} from './app/objects/contentUserData/IContentUserData';
import {FirebaseRef} from './app/objects/dbSync/FirebaseRef';
import {FirebaseSaverArgs} from './app/objects/dbSync/FirebaseSaver';
import {IDatabaseSyncer} from './app/objects/dbSync/IDatabaseSyncer';
import {IFirebaseRef} from './app/objects/dbSync/IFirebaseRef';
import {SaveUpdatesToDBFunction} from './app/objects/dbSync/ISaveUpdatesToDBFunction';
import {IUpdates} from './app/objects/dbSync/IUpdates';
import {SyncToDB, SyncToDBArgs} from './app/objects/dbSync/SyncToDB';
import {ISubscribableMutableId} from './app/objects/id/ISubscribableMutableId';
import {IMutableId, MutableId} from './app/objects/id/MutableId';
import {
    ISubscribableMutableIdArgs, SubscribableMutableId,
    SubscribableMutableIdArgs
} from './app/objects/id/SubscribableMutableId';
import {ISubscribable} from './app/objects/ISubscribable';
import {radian} from './app/objects/MathUtils/MathUtils';
import {ActivatableDatedMutation} from './app/objects/mutations/ActivatableDatedMutation';
import {IActivatableDatedMutation, IDatedMutation} from './app/objects/mutations/IMutation';
import {PROFICIENCIES} from './app/objects/proficiency/proficiencyEnum';
import {IMutableStringSet} from './app/objects/set/IMutableStringSet';
import {ISubscribableMutableStringSet} from './app/objects/set/ISubscribableMutableStringSet';
import {SetMutationTypes} from './app/objects/set/SetMutationTypes';
import {
    SubscribableMutableStringSet,
    SubscribableMutableStringSetArgs
} from './app/objects/set/SubscribableMutableStringSet';
import {ColorSlice} from './app/objects/sigmaNode/ColorSlice';
import {IColorSlice} from './app/objects/sigmaNode/IColorSlice';
import {ISigmaNode} from './app/objects/sigmaNode/ISigmaNode';
import {ISigmaNodeData} from './app/objects/sigmaNode/ISigmaNodeData';
import {SigmaNode, SigmaNodeArgs} from './app/objects/sigmaNode/SigmaNode';
import {Subscribable} from './app/objects/Subscribable';
import {SubscribableArgs} from './app/objects/Subscribable';
import {IBasicTree} from './app/objects/tree/IBasicTree';
import {ISubscribableBasicTree} from './app/objects/tree/ISubscribableBasicTree';
import {SubscribableBasicTree, SubscribableBasicTreeArgs} from './app/objects/tree/SubscribableBasicTree';
import {TYPES} from './app/objects/types'
import {UIColor} from './app/objects/uiColor';
import {defaultProficiencyStats, IProficiencyStats} from './app/objects/proficiencyStats/IProficiencyStats';
import {IdMutationTypes} from './app/objects/id/IdMutationTypes';

const myContainer = new Container()
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation).to(ActivatableDatedMutation)
myContainer.bind<any>(TYPES.Any).toConstantValue(false)
myContainer.bind<boolean>(TYPES.Boolean).toConstantValue(false)
myContainer.bind<ContentUserDataArgs>(TYPES.ContentUserDataArgs).to(ContentUserDataArgs)
myContainer.bind<FirebaseSaverArgs>(TYPES.FirebaseSaverArgs).to(FirebaseSaverArgs)
myContainer.bind<IBasicTree>(TYPES.IBasicTree).to(SubscribableBasicTree)
myContainer.bind<IColorSlice>(TYPES.IColorSlice).to(ColorSlice)
myContainer.bind<IDatabaseSyncer>(TYPES.IDatabaseSyncer).to(SyncToDB)
myContainer.bind<IDatedMutation<IdMutationTypes>>(TYPES.IDatedMutation).toConstantValue({
    data: {id: '12345'},
    timestamp: Date.now(),
    type: IdMutationTypes.SET,
})
myContainer.bind<IFirebaseRef>(TYPES.IFirebaseRef).to(FirebaseRef)
myContainer.bind<IMutableId>(TYPES.IMutableId).to(MutableId)
myContainer.bind<IProficiencyStats>(TYPES.IProficiencyStats).toConstantValue(defaultProficiencyStats)
myContainer.bind<ISigmaNode>(TYPES.ISigmaNode).to(SigmaNode)
myContainer.bind<ISubscribableBasicTree>(TYPES.ISubscribableBasicTree).to(SubscribableBasicTree)
myContainer.bind<ISubscribableMutableId>(TYPES.ISubscribableMutableId).to(SubscribableMutableId)
myContainer.bind<ISubscribableMutableIdArgs>(TYPES.ISubscribableMutableIdArgs).to(SubscribableMutableIdArgs)
myContainer.bind<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<IContentUserData>(TYPES.IContentUserData).to(ContentUserData)
myContainer.bind<radian>(TYPES.radian).toConstantValue(0)
myContainer.bind<SubscribableMutableStringSetArgs>
(TYPES.SubscribableMutableStringSetArgs).to(SubscribableMutableStringSetArgs)
myContainer.bind<SubscribableArgs>(TYPES.SubscribableArgs).to(SubscribableArgs)
myContainer.bind<SubscribableBasicTreeArgs>(TYPES.SubscribableBasicTreeArgs).to(SubscribableBasicTreeArgs)
myContainer.bind<ISubscribable>(TYPES.Subscribable).to(Subscribable);

myContainer.bind<IMutableStringSet>(TYPES.IMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<any[]>(TYPES.Array).toConstantValue([])
// tslint:disable-next-line ban-types
myContainer.bind<Number>(TYPES.Number).toConstantValue(0)
myContainer.bind<PROFICIENCIES>(TYPES.PROFICIENCIES).toConstantValue(PROFICIENCIES.ONE)
myContainer.bind<SigmaNodeArgs>(TYPES.SigmaNodeArgs).to(SigmaNodeArgs)
// tslint:disable-next-line ban-types
myContainer.bind<String>(TYPES.String).toConstantValue('')
myContainer.bind<SyncToDBArgs>(TYPES.SyncToDBArgs).to(SyncToDBArgs)
myContainer.bind<SaveUpdatesToDBFunction>(TYPES.SaveUpdatesToDBFunction).toConstantValue((updates: IUpdates) => void 0)
myContainer.bind<UIColor>(TYPES.UIColor).toConstantValue(UIColor.GRAY);
// tslint:disable-next-line ban-types
myContainer.bind<Object>(TYPES.Object).toConstantValue({})
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutationArr).to()

export {myContainer}
