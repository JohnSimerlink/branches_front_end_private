import {IMutable} from '../mutations/IMutable';
import {IDatedMutation} from '../mutations/IMutation';
import {ISet} from './ISet';

interface IMutableStringSet extends IMutable<IDatedMutation>, ISet<string> {
}
export {IMutableStringSet}
