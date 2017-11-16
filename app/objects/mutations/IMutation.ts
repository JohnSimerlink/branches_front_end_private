import {MutationTypes} from './MutationTypes'
export interface IMutation {
    type: MutationTypes,
    data
}
export interface IDatedMutation extends IMutation {
    datetime: number // ISO 8601 POSIX Timestamp
}
export interface IActivatableMutation extends IMutation {
    active: boolean
}
export interface IActivatableDatedMutation extends IDatedMutation, IActivatableMutation {
}
