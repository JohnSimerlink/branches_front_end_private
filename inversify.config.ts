import {Container} from 'inversify'
import 'reflect-metadata'
import {ActivatableDatedMutation} from './app/objects/mutations/ActivatableDatedMutation';
import {IActivatableDatedMutation} from './app/objects/mutations/IMutation';
import {TYPES} from './app/objects/types'

const myContainer = new Container()
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutation).to(ActivatableDatedMutation)
// myContainer.bind(<Array>(TYPES.Array)).to(Array)
// myContainer.bind<IActivatableDatedMutation>(TYPES.IActivatableDatedMutationArr).to()

export {myContainer}
