/* tslint:disable variable-name */
import {log} from '../../core/log'
import {IUndoableMutable} from '../mutations/IMutable';
import {IActivatableDatedMutation, IDatedMutation} from '../mutations/IMutation';
import {PointMutationTypes} from '../point/PointMutationTypes';
import {ISimpleTree} from './ISimpleTree'
import {TreeMutationTypes} from './TreeMutationTypes';
class UndoableMutableTree implements IUndoableMutable<IDatedMutation>, ISimpleTree {
    private _mutations: IActivatableDatedMutation[];
    private _deactivatedChildIdMutationIndexMap = {}
    private childSet: object;
    constructor({childSet, mutations} = {childSet: {}, mutations: []}) {
        this.childSet = childSet
        this._mutations = mutations
    }
    public getChildIds(): string[] {
        return Object.keys(this.childSet)
    }

    public addChild(childId: string) {
        if (this.childSet[childId]) {
            throw new RangeError(
                childId + ' is already a childId. The children are' + JSON.stringify(this.getChildIds())
            )
        }
        this.childSet[childId] = true
    }

    public removeChild(childId: string) {
        if (!this.childSet[childId]) {
            throw new RangeError(childId + ' is not a childId. The children are' + JSON.stringify(this.getChildIds()))
        }
        delete this.childSet[childId]
    }
    public hasChild(childId: string): boolean {
        return this.childSet[childId]
    }
    public addMutation(mutation: IDatedMutation) {
        log('addMutation called' + JSON.stringify(mutation))
        const addToMutationList: boolean = this.doMutation(mutation)
        if (!addToMutationList) {
            return
        }
        const activatedMutation = {
            ...mutation,
            active: true
        }
        this._mutations.push(activatedMutation)
    }
    private doMutation(mutation: IDatedMutation): boolean {
        log('doMutation called ' + JSON.stringify(mutation))
        switch (mutation.type) {
            case TreeMutationTypes.ADD_CHILD:
                const childId = mutation.data.childId
                const mutationIndex = this.deactivatedAddChildMutationExistsFor(childId)
                if (mutationIndex >= 0 ) {
                   log('mutationIndex greater than zero')
                   this.addChild(childId)
                   delete this._deactivatedChildIdMutationIndexMap[childId]
                   this._setActive(mutationIndex)
                   return false
                }
                this.addChild(childId) // TODO: Law of Demeter Violation? How to fix?
                break;
            case TreeMutationTypes.REMOVE_CHILD:
                this.removeChild(mutation.data.childId) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(TreeMutationTypes))
        }
        return true
    }

    private deactivatedAddChildMutationExistsFor(childId: string): number {
        // TODO: this method sucks, and the whole reason I'm using this method sucks
        // Maybe I should redraw everything with a state diagram
        const mutationIndex = this._deactivatedChildIdMutationIndexMap[childId]
        log('deactivatedAddChildMutationExistsFor called ' + childId + ' ==> ' + mutationIndex)
        return mutationIndex
        // for (let i = 0; i < this._mutations.length; i++) {
        //     const mutation = this._mutations[i]
        //     if (
        //         !mutation.active
        //         && mutation.type === TreeMutationTypes.ADD_CHILD
        //         && mutation.data.childId === childId
        //     ) {
        //         return i
        //     }
        // }
        // return -1
    }

    private undoMutation(mutation: IDatedMutation, mutationListIndex?: number) {
        switch (mutation.type) {
            case TreeMutationTypes.ADD_CHILD:
                const childId = mutation.data.childId
                this.removeChild(childId) // TODO: Law of Demeter Violation? How to fix?
                this._deactivatedChildIdMutationIndexMap[childId] = mutationListIndex
                break;
            case TreeMutationTypes.REMOVE_CHILD:
                this.addChild(mutation.data.childId) // TODO: Law of Demeter Violation? How to fix?
                break;
            default:
                throw new TypeError('Mutation Type needs to be one of the following types'
                    + JSON.stringify(TreeMutationTypes))
        }
    }
    private checkIndexInBounds(mutationListIndex: number) {
        if (mutationListIndex < 0 || mutationListIndex >= this._mutations.length) {
            throw new RangeError('Index out of bounds')
        }
    }

    public undo(mutationListIndex: number) {
        this.checkIndexInBounds(mutationListIndex)
        const mutation: IActivatableDatedMutation = this._mutations[mutationListIndex]

        if (!mutation.active) {
            const activeMutations = this.getActiveMutations()
            throw new RangeError('Mutation ' + JSON.stringify(mutation)
                + ` is already not active and thus cannot be undone.
             The current mutations that are active are `
                + JSON.stringify(activeMutations) + '. Also the first mutation can\'t be undone.')
        }

        this.undoMutation(mutation, mutationListIndex)
        mutation.active = false
        return this
    }

    public redo(mutationListIndex: number) {
        this.checkIndexInBounds(mutationListIndex)
        const mutation: IActivatableDatedMutation = this._mutations[mutationListIndex]

        if (mutation.active) {
            const activeMutations = this.getActiveMutations()
            throw new RangeError('Mutation ' + JSON.stringify(mutation)
                + ` is already not active and thus cannot be undone.
             The current mutations that are active are `
                + JSON.stringify(activeMutations) + '. Also the first mutation can\'t be undone.')
        }

        this.doMutation(mutation)
        mutation.active = true
        return this
    }

    private _setActive(mutationIndex: number) {
        const mutation = this._mutations[mutationIndex]
        mutation.active = true
    }
    private getActiveMutations() {
        return this._mutations.filter(mutation => mutation.active)
    }

    private getInactiveMutations() {
        return this._mutations.filter(mutation => !mutation.active)
    }
    public mutations(): IDatedMutation[] {
        return this._mutations;
    }

}

export {UndoableMutableTree}
