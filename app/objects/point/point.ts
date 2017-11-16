/* tslint:disable variable-name */
import {IMutable, IUndoableMutable} from '../mutations/IMutable';
import {IActivatableDatedMutation, IActivatableMutation, IDatedMutation} from '../mutations/IMutation';
import {MutationTypes} from '../mutations/MutationTypes';
import {ICoordinate, IPoint} from './IPoint';
import {PointMutationTypes} from './PointMutationTypes';

class Point implements IUndoableMutable<IDatedMutation>, IPoint {
    private x;
    private y;
    private _mutations: IActivatableDatedMutation[];

    public val(): ICoordinate {
        return {x: this.x, y: this.y}
    }

    public shift(delta: ICoordinate): ICoordinate {
        this.x += delta.x
        this.y += delta.y
        return this.val()
    }

    private unshift(delta: ICoordinate): ICoordinate {
        this.x -= delta.x
        this.y -= delta.y
        return this.val()
    }

    public addMutation(mutation: IDatedMutation) {
        this.doMutation(mutation)
        const activatedMutation = {
            ...mutation,
            active: true
        }
        this._mutations.push(activatedMutation)
    }

    /* NOTE: if we had a non-commutative mutation type (SHIFT is commutative),
     we'd need methods different from just doMutation and undoMutation
    */
    private doMutation(mutation: IDatedMutation) {
        switch (mutation.type) {
            case MutationTypes.POINT_SHIFT:
                this.shift(mutation.data.delta) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(PointMutationTypes))
        }
    }

    private undoMutation(mutation: IDatedMutation) {
        switch (mutation.type) {
            case MutationTypes.POINT_SHIFT:
                this.unshift(mutation.data.delta) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(PointMutationTypes))
        }
    }

    public mutations(): IDatedMutation[] {
        return this._mutations
    }

    public undo(index: number) {
        const mutation: IActivatableDatedMutation = this._mutations[index]
        if (!mutation.active) {
            const activeMutations = this.getActiveMutations()
            throw new RangeError('Mutation ' + JSON.stringify(mutation)
                + ` is already not active and thus cannot be undone.
             The current mutations that are active are `
            + JSON.stringify(activeMutations))
        }
        this.undoMutation(mutation)
        mutation.active = false
        return this
    }

    public redo(index: number) {
        const mutation: IActivatableDatedMutation = this._mutations[index]
        if (!mutation.active) {
            const inactiveMutations = this.getInactiveMutations()
            throw new RangeError('Mutation' + JSON.stringify(mutation)
                + `is already active and thus cannot be currently redone.
             The current mutations that are inactive are `
                + JSON.stringify(inactiveMutations))
        }
        this.undoMutation(mutation)
        mutation.active = false
        return this
    }

    private getActiveMutations() {
        return this._mutations.filter(mutation => mutation.active)
    }

    private getInactiveMutations() {
        return this._mutations.filter(mutation => !mutation.active)
    }
}
