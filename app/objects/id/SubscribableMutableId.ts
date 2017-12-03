/* tslint:disable variable-name */
// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDetailedUpdates} from '../interfaces';
import {IDatedMutation, IdMutationTypes, IMutableId} from '../interfaces';
import {} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types';

@injectable()
class SubscribableMutableId extends Subscribable<IDetailedUpdates> implements IMutableId {
    private id: string
    private _mutations: Array<IDatedMutation<IdMutationTypes>>
    constructor(@inject(TYPES.ISubscribableMutableIdArgs) {
        updatesCallbacks = [], id = '', mutations = []
    } =
        {
             id: '',  mutations: [], updatesCallbacks: [],
        }) {
        super({updatesCallbacks})
        this.id = id
        this._mutations = mutations
    }

    public val(): string {
        return this.id
    }
    /* TODO: refactor this private method into another class,
     with it as a public method, and use that class internally via composition
     * That way we can test the set method in a unit test */
    private set(id): void {
        this.id = id
        this.updates.val = id
    }
    public addMutation(mutation: IDatedMutation<IdMutationTypes>) {
        switch (mutation.type) {
            case IdMutationTypes.SET:
                this.set(mutation.data.id) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(IdMutationTypes))
        }
        this._mutations.push(mutation)
        this.pushes = {mutations: mutation}
        this.callCallbacks()
    }

    public mutations(): Array<IDatedMutation<IdMutationTypes>> {
        return this._mutations;
    }
}
interface ISubscribableMutableIdArgs {
    updatesCallbacks;
    id;
    mutations;
}
@injectable()
class SubscribableMutableIdArgs implements ISubscribableMutableIdArgs {
    @inject(TYPES.Array) public updatesCallbacks = []
    @inject(TYPES.String) public id = null
    @inject(TYPES.Array) public mutations = []
}
export {SubscribableMutableId, SubscribableMutableIdArgs, ISubscribableMutableIdArgs}
