import {Container} from 'inversify'
import 'reflect-metadata'
import {IMutableId, MutableId} from './app/objects/id/MutableId';
import {ActivatableDatedMutation} from './app/objects/mutations/ActivatableDatedMutation';
import {IActivatableDatedMutation} from './app/objects/mutations/IMutation';
import {TYPES} from './app/objects/types'
import {IMutableStringSet} from './app/objects/set/IMutableStringSet';
import {SubscribableMutableStringSet} from './app/objects/set/SubscribableMutableStringSet';
import {ISubscribableMutableId} from './app/objects/id/ISubscribableMutableId';
import {
    ISubscribableMutableIdArgs, SubscribableMutableId,
    SubscribableMutableIdArgs
} from './app/objects/id/SubscribableMutableId';

const myContainer = new Container()
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation).to(ActivatableDatedMutation)
myContainer.bind<IMutableId>(TYPES.IMutableId).to(MutableId)
myContainer.bind<ISubscribableMutableId>(TYPES.ISubscribableMutableId).to(SubscribableMutableId)
myContainer.bind<ISubscribableMutableIdArgs>(TYPES.ISubscribableMutableIdArgs).to(SubscribableMutableIdArgs)
myContainer.bind<IMutableStringSet>(TYPES.IMutableStringSet).to(SubscribableMutableStringSet)
myContainer.bind<any[]>(TYPES.Array).toConstantValue([])
// tslint:disable-next-line ban-types
myContainer.bind<String>(TYPES.String).toConstantValue('')
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutationArr).to()

export {myContainer}
