/* tslint:disable variable-name */
// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDetailedUpdates} from '../interfaces';
import {FieldMutationTypes, IDatedMutation, IMutableField} from '../interfaces';
import {} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';

@injectable()
class SubscribableMutableField extends Subscribable<IDetailedUpdates> implements IMutableField {
    private field: any
    private _mutations: Array<IDatedMutation<FieldMutationTypes>>
    constructor(@inject(TYPES.SubscribableMutableFieldArgs) {
        updatesCallbacks = [], field = null, mutations = []
    } =
        {
             field: null,  mutations: [], updatesCallbacks: [],
        }) {
        super({updatesCallbacks})
        this.field = field
        this._mutations = mutations
    }

    public val(): any {
        return this.field
    }
    /* TODO: refactor this private method into another class,
     with it as a public method, and use that class internally via composition
     * That way we can test the set method in a unit test */
    private set(field): void {
        this.field = field
        this.updates.val = field
    }
    public addMutation(mutation: IDatedMutation<FieldMutationTypes>) {
        switch (mutation.type) {
            case FieldMutationTypes.SET:
                this.set(mutation.data) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(FieldMutationTypes))
        }
        this._mutations.push(mutation)
        this.pushes = {mutations: mutation}
        this.callCallbacks()
    }

    public mutations(): Array<IDatedMutation<FieldMutationTypes>> {
        return this._mutations;
    }
}
@injectable()
class SubscribableMutableFieldArgs {
    @inject(TYPES.Array) public updatesCallbacks = []
    @inject(TYPES.Any) public field = null
    @inject(TYPES.Array) public mutations = []
}
export {SubscribableMutableField, SubscribableMutableFieldArgs}
