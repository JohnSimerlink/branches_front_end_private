/* tslint:disable variable-name */
// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDetailedUpdates} from '../interfaces';
import {FieldMutationTypes, IDatedMutation, IMutableField} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';
import {log} from '../../core/log'
@injectable()
export class MutableSubscribableField<T> extends Subscribable<IDetailedUpdates> implements IMutableField<T> {
    private field: T
    // private _id: number
    private _mutations: Array<IDatedMutation<FieldMutationTypes>>
    constructor(@inject(TYPES.MutableSubscribableFieldArgs) {
        updatesCallbacks = [], field = null, mutations = []
    }: MutableSubscribableFieldArgs  =
        {
             field: null,  mutations: [], updatesCallbacks: [],
        }) {
        super({updatesCallbacks})
        this.field = field
        this._mutations = mutations
        // this._id = Math.random()
        // log('Mutable Subscribable field just created with id of ', this._id, this)
    }

    public val(): T {
        return this.field
    }
    public dbVal(): T {
        return this.val()
    }
    /* TODO: refactor this private method into another class,
     with it as a public method, and use that class internally via composition
     * That way we can test the set method in a unit test */
    private set(field: T): void {
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
                    + JSON.stringify(FieldMutationTypes) +
                `. ${mutation.type} is invalid`)
        }
        this._mutations.push(mutation)
        this.pushes = {mutations: mutation}
        this.callCallbacks()
    }

    public mutations(): Array<IDatedMutation<FieldMutationTypes>> {
        return this._mutations;
    }
}
// TODO: type the args so that field must be type of T
@injectable()
export class MutableSubscribableFieldArgs {
    @inject(TYPES.Array) public updatesCallbacks? = []
    @inject(TYPES.Any) public field = null
    // TODO ^^ : Dependency inject the correct type into field dynamically
    @inject(TYPES.Array) public mutations? = []
}
