import {Container} from 'inversify'
import 'reflect-metadata'
import {FirebaseRef} from './app/objects/dbSync/FirebaseRef';
import {IDatabaseSyncer} from './app/objects/dbSync/IDatabaseSyncer';
import {IFirebaseRef} from './app/objects/dbSync/IFirebaseRef';
import {SaveUpdatesToDBFunction} from './app/objects/dbSync/ISaveUpdatesToDBFunction';
import {IUpdates} from './app/objects/dbSync/IUpdates';
import {FirebaseSaverArgs} from './app/objects/dbSync/FirebaseSaver';
import {SyncToDB, SyncToDBArgs} from './app/objects/dbSync/SyncToDB';
import {ISubscribableMutableId} from './app/objects/id/ISubscribableMutableId';
import {IMutableId, MutableId} from './app/objects/id/MutableId';
import {
    ISubscribableMutableIdArgs, SubscribableMutableId,
    SubscribableMutableIdArgs
} from './app/objects/id/SubscribableMutableId';
import {ISubscribable} from './app/objects/ISubscribable';
import {ActivatableDatedMutation} from './app/objects/mutations/ActivatableDatedMutation';
import {IActivatableDatedMutation, IDatedMutation} from './app/objects/mutations/IMutation';
import {IMutableStringSet} from './app/objects/set/IMutableStringSet';
import {ISubscribableMutableStringSet} from './app/objects/set/ISubscribableMutableStringSet';
import {SetMutationTypes} from './app/objects/set/SetMutationTypes';
import {
    SubscribableMutableStringSet,
    SubscribableMutableStringSetArgs
} from './app/objects/set/SubscribableMutableStringSet';
import {SubscribableArgs} from './app/objects/Subscribable';
import {Subscribable} from './app/objects/Subscribable';
import {ISubscribableBasicTree} from './app/objects/tree/ISubscribableBasicTree';
import {SubscribableBasicTree, SubscribableBasicTreeArgs} from './app/objects/tree/SubscribableBasicTree';
import {TYPES} from './app/objects/types'

const myContainer = new Container()
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation).to(ActivatableDatedMutation)
myContainer.bind<FirebaseSaverArgs>(TYPES.FirebaseSaverArgs).to(FirebaseSaverArgs)
myContainer.bind<IDatabaseSyncer>(TYPES.IDatabaseSyncer).to(SyncToDB)
myContainer.bind<IFirebaseRef>(TYPES.IFirebaseRef).to(FirebaseRef)
myContainer.bind<IMutableId>(TYPES.IMutableId).to(MutableId)
myContainer.bind<ISubscribableBasicTree>(TYPES.ISubscribableBasicTree).to(SubscribableBasicTree)
myContainer.bind<ISubscribableMutableId>(TYPES.ISubscribableMutableId).to(SubscribableMutableId)
myContainer.bind<ISubscribableMutableIdArgs>(TYPES.ISubscribableMutableIdArgs).to(SubscribableMutableIdArgs)
myContainer.bind<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<SubscribableMutableStringSetArgs>
(TYPES.SubscribableMutableStringSetArgs).to(SubscribableMutableStringSetArgs)
myContainer.bind<SubscribableArgs>(TYPES.SubscribableArgs).to(SubscribableArgs)
myContainer.bind<SubscribableBasicTreeArgs>(TYPES.SubscribableBasicTreeArgs).to(SubscribableBasicTreeArgs)
myContainer.bind<ISubscribable>(TYPES.Subscribable).to(Subscribable);

myContainer.bind<IMutableStringSet>(TYPES.IMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<any[]>(TYPES.Array).toConstantValue([])
// tslint:disable-next-line ban-types
myContainer.bind<String>(TYPES.String).toConstantValue('')
myContainer.bind<SyncToDBArgs>(TYPES.SyncToDBArgs).to(SyncToDBArgs)
myContainer.bind<SaveUpdatesToDBFunction>(TYPES.SaveUpdatesToDBFunction).toConstantValue((updates: IUpdates) => void 0)
// tslint:disable-next-line ban-types
myContainer.bind<Object>(TYPES.Object).toConstantValue({})
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutationArr).to()

export {myContainer}
