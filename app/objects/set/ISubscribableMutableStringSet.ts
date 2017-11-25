import {IMutableStringSet} from './IMutableStringSet';
import {ISubscribable} from '../ISubscribable';
import {SetMutationTypes} from './SetMutationTypes';

interface ISubscribableMutableStringSet extends ISubscribable, IMutableStringSet {

}
export {ISubscribableMutableStringSet}