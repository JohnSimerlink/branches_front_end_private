import {IDetailedUpdates} from '../dbSync/IDetailedUpdates';
import {ISubscribable} from '../subscribable/ISubscribable';
import {IMutableStringSet} from './IMutableStringSet';
import {SetMutationTypes} from './SetMutationTypes';

interface ISubscribableMutableStringSet extends ISubscribable<IDetailedUpdates>, IMutableStringSet {

}
export {ISubscribableMutableStringSet}
