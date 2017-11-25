import {Container} from 'inversify'
import 'reflect-metadata'
import {ISubscribableMutableId} from './app/objects/id/ISubscribableMutableId';
import {IMutableId, MutableId} from './app/objects/id/MutableId';
import {
    ISubscribableMutableIdArgs, SubscribableMutableId,
    SubscribableMutableIdArgs
} from './app/objects/id/SubscribableMutableId';
import {ActivatableDatedMutation} from './app/objects/mutations/ActivatableDatedMutation';
import {IActivatableDatedMutation, IDatedMutation} from './app/objects/mutations/IMutation';
import {IMutableStringSet} from './app/objects/set/IMutableStringSet';
import {ISubscribableMutableStringSet} from './app/objects/set/ISubscribableMutableStringSet';
import {SetMutationTypes} from './app/objects/set/SetMutationTypes';
import {
    SubscribableMutableStringSet,
    SubscribableMutableStringSetArgs
} from './app/objects/set/SubscribableMutableStringSet';
import {Subscribable} from './app/objects/tree/Subscribable';
import {SubscribableArgs} from './app/objects/tree/Subscribable';
import {TYPES} from './app/objects/types'
import {ISubscribable} from './app/objects/ISubscribable';

const myContainer = new Container()
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation).to(ActivatableDatedMutation)
myContainer.bind<IMutableId>(TYPES.IMutableId).to(MutableId)
myContainer.bind<ISubscribableMutableId>(TYPES.ISubscribableMutableId).to(SubscribableMutableId)
myContainer.bind<ISubscribableMutableIdArgs>(TYPES.ISubscribableMutableIdArgs).to(SubscribableMutableIdArgs)
myContainer.bind<ISubscribableMutableStringSet>(TYPES.ISubscribableMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<SubscribableMutableStringSetArgs>
(TYPES.SubscribableMutableStringSetArgs).to(SubscribableMutableStringSetArgs)
myContainer.bind<SubscribableArgs>(TYPES.SubscribableArgs).to(SubscribableArgs);
myContainer.bind<ISubscribable>(TYPES.Subscribable).to(Subscribable);

myContainer.bind<IMutableStringSet>(TYPES.IMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<any[]>(TYPES.Array).toConstantValue([])
// tslint:disable-next-line ban-types
myContainer.bind<String>(TYPES.String).toConstantValue('')
// tslint:disable-next-line ban-types
myContainer.bind<Object>(TYPES.Object).toConstantValue({})
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutationArr).to()

export {myContainer}
