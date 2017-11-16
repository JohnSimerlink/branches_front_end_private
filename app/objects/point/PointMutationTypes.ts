// tslint:disable no-shadowed-variable
import {MutationTypes} from '../mutations/MutationTypes';
const POINT_SHIFT = 'POINT_SHIFT'
export enum PointMutationTypes {
    POINT_SHIFT
}
declare module '../mutations/MutationTypes' {
    export enum MutationTypes {
        POINT_SHIFT
    }
}
