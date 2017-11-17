// export enum MutationTypes {
//     // TREE_ADD_CHILD,
//     // TREE_REMOVE_CHILD,
//     // POINT_SHIFT,
//     // ^^ TODO: Only add those in, if they don't show up from the other modules, when I import this module
//     // // Tree Mutation Types
//     // ADD_LEAF,
//     // REMOVE_LEAF,
// }
import {PointMutationTypes} from '../point/PointMutationTypes';
import {TreeMutationTypes} from '../tree/TreeMutationTypes';

type MutationTypes =  PointMutationTypes | TreeMutationTypes
export {MutationTypes}
