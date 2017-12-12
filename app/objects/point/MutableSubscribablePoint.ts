/* tslint:disable variable-name */
import {inject, injectable} from 'inversify';
import {
    IActivatableDatedMutation, ICoordinate,
    IDatedMutation, IDetailedUpdates, IPoint, ISubscribableUndoableMutablePoint, IUndoableMutable,
    PointMutationTypes
} from '../interfaces';
import {} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';

/* TODO: Maybe split into  Point and PointMutator classes?

 */
/* TODO: Am I violating the Law of Demeter (SVLOD or WVLOD)
 by accessing the mutation list, and looking at properties on each mutation?
 Should I handle mutations as a separate class, rather than a duck type?
 IMO yes. I should create a generalized mutation module.
 Will do that after I have 1 to 2 modules using Mutations
*/
@injectable()
export class MutableSubscribablePoint
    extends Subscribable<IDetailedUpdates>
    implements ISubscribableUndoableMutablePoint {
    private x = 0;
    private y = 0;
    private _mutations: Array<IActivatableDatedMutation<PointMutationTypes>>;
    // @multiInject("IActivatableDatedMutation") mutations

    /* NOTE: yes, this isn't the best obeyance of Dependency Inversion standards,
    because I am doing some processing in the constructor,
    rather than just assignment . . .
    */
    constructor(@inject(TYPES.SubscribableMutablePointArgs){
        updatesCallbacks = [],
        x = null,
        y = null,
        mutations = [],
    }: {
        updatesCallbacks?: any[],
        x?: number,
        y?: number,
        mutations?: Array<IActivatableDatedMutation<PointMutationTypes>>
    }
    = {
        updatesCallbacks: [],
        x: null,
        y: null,
        mutations: [],
    }) {
        super({updatesCallbacks})
        this._mutations = mutations
        this.x = x
        this.y = y
    }
    public val(): ICoordinate {
        return {x: this.x, y: this.y}
    }

    private shift(delta: ICoordinate): ICoordinate {
        this.x += delta.x
        this.y += delta.y
        return this.val()
    }

    private unshift(delta: ICoordinate): ICoordinate {
        this.x -= delta.x
        this.y -= delta.y
        return this.val()
    }

    public addMutation(mutation: IDatedMutation<PointMutationTypes>): void {
        this.doMutation(mutation)
        const activatedMutation = {
            ...mutation,
            active: true
        }
        this._mutations.push(activatedMutation)
        this.pushes = {mutations: mutation}
        this.updates.val = this.val()
        this.callCallbacks()
    }

    /* NOTE: if we had a non-commutative mutation type (SHIFT is commutative),
     we'd need methods different from just doMutation and undoMutation
    */
    private doMutation(mutation: IDatedMutation<PointMutationTypes>) {
        switch (mutation.type) {
            case PointMutationTypes.SHIFT:
                this.shift(mutation.data.delta) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(PointMutationTypes))
        }
    }

    private undoMutation(mutation: IDatedMutation<PointMutationTypes>) {
        switch (mutation.type) {
            case PointMutationTypes.SHIFT:
                this.unshift(mutation.data.delta) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(PointMutationTypes))
        }
    }

    public mutations(): Array<IDatedMutation<PointMutationTypes>> {
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

    /* TODO: Add unit tests for mutation list
    While testing this undo method . . I found that the previousTime
    addMutation was called, the mutation list didn't actually add an element ...
     */
    public undo(mutationListIndex: number) {
        const mutation: IActivatableDatedMutation<PointMutationTypes> = this._mutations[mutationListIndex]

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

    public redo(mutationListIndex: number) {
        // log('redo called for ' + index + ' out of ' + JSON.stringify(this._mutations))
        const mutation: IActivatableDatedMutation<PointMutationTypes> = this._mutations[mutationListIndex]
        if (mutation.active) {
            const inactiveMutations = this.getInactiveMutations()
            throw new RangeError('Mutation' + JSON.stringify(mutation)
                + `is already active and thus cannot be currently redone.
             The current mutations that are inactive are `
                + JSON.stringify(inactiveMutations))
        }
        this.doMutation(mutation)
        // log('END redo called for ' + index + ' out of ' + JSON.stringify(this._mutations))
        mutation.active = true
        /* TODO: again is modifying mutations directly
        violating law of Demeter? I feel like i should
        separate mutations into its own class */
        return this
    }

    private getActiveMutations() {
        return this._mutations.filter(mutation => mutation.active)
    }

    private getInactiveMutations() {
        return this._mutations.filter(mutation => !mutation.active)
    }
}

@injectable()
export class SubscribableMutablePointArgs {
    @inject(TYPES.Array) public updatesCallbacks = []
    @inject(TYPES.Number) public x: number
    @inject(TYPES.Number) public y: number
    @inject(TYPES.Array) public mutations = []
}
