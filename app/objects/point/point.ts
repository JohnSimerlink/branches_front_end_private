/* tslint:disable variable-name */
import {inject, injectable, multiInject} from 'inversify';
import {IMutable, IUndoableMutable} from '../mutations/IMutable';
import {IActivatableDatedMutation, IActivatableMutation, IDatedMutation} from '../mutations/IMutation';
import {MutationTypes} from '../mutations/MutationTypes';
import {TYPES} from '../types'
import {ICoordinate, IPoint} from './IPoint';
import {PointMutationTypes} from './PointMutationTypes';
import {log} from 'util';

/* TODO: Maybe split into  Point and PointMutator classes?

 */
/* TODO: Am I violating the Law of Demeter (SVLOD or WVLOD)
 by accessing the mutation list, and looking at properties on each mutation?
 Should I handle mutations as a separate class, rather than a duck type?
 IMO yes. I should create a generalized mutation module.
 Will do that after I have 1 to 2 modules using Mutations
*/
@injectable()
class Point implements IUndoableMutable<IDatedMutation>, IPoint {
    private x = 0;
    private y = 0;
    private _mutations: IActivatableDatedMutation[];
    // @multiInject("IActivatableDatedMutation") mutations

    /* NOTE: yes, this isn't the best obeyance of Dependency Inversion standards,
    because I am doing some processing in the constructor,
    rather than just assignment . . .
    */
    constructor({x, y, mutations = []}) {
        this._mutations = mutations
        log('CONSTRUCTOR mutations is ' + JSON.stringify(this._mutations))
        const mutation = {
            data: {delta: {x, y}},
            timestamp: Date.now(),
            type: PointMutationTypes.SHIFT,
        }
        this.addMutation(mutation)
    }
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
            case PointMutationTypes.SHIFT:
                this.shift(mutation.data.delta) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(PointMutationTypes))
        }
    }

    private undoMutation(mutation: IDatedMutation) {
        switch (mutation.type) {
            case PointMutationTypes.SHIFT:
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
    // private getMutation(index: number): IDatedMutation {
    //     if (index >= this._mutations.length) {
    //         throw new RangeError(index + ' invalid! There are only ' + this._mutations.length + ' mutations.')
    //     }  /* Is accessing a length property violating Law of Demeter */
    //     else {
    //         return this._mutations
    //     }
    // }

    public undo(index: number) {
        log('UNDO called ' + index + ' ' + JSON.stringify(this._mutations))
        const mutation: IActivatableDatedMutation = this._mutations[index]
        log('UNDO called ' + index + ' ' + JSON.stringify(this._mutations))

        if (!mutation.active || index === 0) {
            const activeMutations = this.getActiveMutations()
            throw new RangeError('Mutation ' + JSON.stringify(mutation)
                + ` is already not active and thus cannot be undone.
             The current mutations that are active are `
                + JSON.stringify(activeMutations) + '. Also the first mutation can\'t be undone.')
        }

        this.undoMutation(mutation)
        mutation.active = false
        return this
    }

    public redo(index: number) {
        const mutation: IActivatableDatedMutation = this._mutations[index]
        if (mutation.active) {
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

export {Point}
