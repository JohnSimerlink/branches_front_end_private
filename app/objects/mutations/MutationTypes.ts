import {IdMutationTypes} from '../interfaces';
import {PointMutationTypes} from '../point/PointMutationTypes';
import {SetMutationTypes} from '../set/SetMutationTypes';
import {TreeMutationTypes} from '../tree/TreeMutationTypes';
import {TreeParentMutationTypes} from '../tree/TreeParentMutationTypes';

type MutationTypes =  PointMutationTypes | TreeMutationTypes | TreeParentMutationTypes
    | IdMutationTypes | SetMutationTypes
export {MutationTypes}
