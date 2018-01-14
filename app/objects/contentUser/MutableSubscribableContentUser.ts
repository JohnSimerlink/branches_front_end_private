// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    ContentUserPropertyMutationTypes,
    ContentUserPropertyNames,
    FieldMutationTypes,
    IDatedMutation, IMutableSubscribableContentUser, IMutableSubscribableTree,
    IProppedDatedMutation, ISubscribableTree,
    SetMutationTypes,
    TreePropertyMutationTypes, TreePropertyNames
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types'
import {SubscribableContentUser} from './SubscribableContentUser';

@injectable()
class MutableSubscribableContentUser extends SubscribableContentUser implements IMutableSubscribableContentUser {

    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.SubscribableContentUserArgs) {
        updatesCallbacks, id, overdue, proficiency, timer, lastRecordedStrength
    }) {
        super({updatesCallbacks, id, overdue, proficiency, timer, lastRecordedStrength})
    }

    public addMutation(mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>
    // TODO: this lack of typesafety between propertyName and MutationType is concerning
    ): void {
        const propertyName: ContentUserPropertyNames = mutation.propertyName
        const propertyMutation: IDatedMutation<ContentUserPropertyMutationTypes> = {
            data: mutation.data,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        switch (propertyName) {
            case ContentUserPropertyNames.LAST_RECORDED_STRENGTH:
                this.lastRecordedStrength.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break
            case ContentUserPropertyNames.OVERDUE:
                this.overdue.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break
            case ContentUserPropertyNames.PROFICIENCY:
                this.proficiency.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break
            case ContentUserPropertyNames.TIMER:
                this.timer.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break;
            default:
                throw new TypeError(
                    propertyName + JSON.stringify(mutation)
                    + ' does not exist as a property ')
        }
    }

    public mutations(): Array<IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
        throw new Error('Not Implemented!')
    }
}

@injectable()
class SubscribableContentUserArgs {
    @inject(TYPES.Array) public updatesCallbacks
    @inject(TYPES.String) public id: string
    @inject(TYPES.ISubscribableMutableNumber) public lastRecordedStrength: number
    @inject(TYPES.ISubscribableMutableBoolean) public overdue: boolean
    @inject(TYPES.ISubscribableMutableProficiency) public proficiency: PROFICIENCIES
    @inject(TYPES.ISubscribableMutableNumber) public timer: number
}

export {MutableSubscribableContentUser}
