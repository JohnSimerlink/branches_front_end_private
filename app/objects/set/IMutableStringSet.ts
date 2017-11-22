import {IMutable} from '../mutations/IMutable';
import {IDatedMutation} from '../mutations/IMutation';
import {ISet} from './ISet';
import {SetMutationTypes} from './SetMutationTypes';

interface IMutableStringSet extends IMutable<IDatedMutation<SetMutationTypes>>, ISet<string> {
}
export {IMutableStringSet}
