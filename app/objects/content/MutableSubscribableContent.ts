// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    ContentPropertyMutationTypes,
    ContentPropertyNames, FieldMutationTypes,
    IDatedMutation, IMutableSubscribableContent,
    IProppedDatedMutation,
    ISubscribableContent, SetMutationTypes
} from '../interfaces';
import {TYPES} from '../types'
import {SubscribableContent} from './SubscribableContent';

@injectable()
class MutableSubscribableContent extends SubscribableContent implements IMutableSubscribableContent {

    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.SubscribableContentArgs) {updatesCallbacks, type, title, question, answer}) {
        super({updatesCallbacks, type, title, question, answer})
    }

    public addMutation(mutation: IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>
                       // TODO: this lack of typesafety between propertyName and MutationType is concerning
    ): void {
        const propertyName: ContentPropertyNames = mutation.propertyName
        const propertyMutation: IDatedMutation<ContentPropertyMutationTypes> = {
            data: mutation.data,
            timestamp: mutation.timestamp,
            type: mutation.type,
        }
        switch (propertyName) {
            case ContentPropertyNames.TYPE:
                this.type.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
            case ContentPropertyNames.TITLE:
                this.title.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break;
            case ContentPropertyNames.QUESTION:
                this.question.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                break;
            case ContentPropertyNames.ANSWER:
                this.answer.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>)
                // ^^ TODO: figure out a better typesafety solution. casting is kind of scary.
                break;
            default:
                throw new TypeError(
                    propertyName + JSON.stringify(mutation)
                    + ' does not exist as a property ')
        }
    }

    public mutations(): Array<IProppedDatedMutation<ContentPropertyMutationTypes, ContentPropertyNames>> {
        throw new Error('Not Implemented!')
    }
}

export {MutableSubscribableContent}
