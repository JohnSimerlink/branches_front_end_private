import {IMutable} from '../mutations/IMutable';
import {IDatedMutation} from '../mutations/IMutation';
import {IdMutationTypes} from './IdMutationTypes';
import {IId} from './IId';

interface IMutableId extends IMutable<IDatedMutation<IdMutationTypes>>, IId {}

export {IMutableId}
