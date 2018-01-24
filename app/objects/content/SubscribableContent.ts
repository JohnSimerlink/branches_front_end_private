// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    CONTENT_TYPES,
    IContentData, ISubscribable,
    ISubscribableContent,
    ISubscribableMutableField,
    IValUpdates,
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

@injectable()
class SubscribableContent extends Subscribable<IValUpdates> implements ISubscribableContent {
    private publishing = false
    public type: ISubscribableMutableField<CONTENT_TYPES>;
    public question: ISubscribableMutableField<string>;
    public answer: ISubscribableMutableField<string>;
    public title: ISubscribableMutableField<string>;

    // TODO: should the below three objects be private?
    public val(): IContentData {
        return {
            type: this.type.val(),
            question: this.question.val(),
            answer: this.answer.val(),
            title: this.title.val(),
        }
    }
    constructor(@inject(TYPES.SubscribableContentArgs) {
        updatesCallbacks, type, question, answer, title
    }: SubscribableContentArgs ) {
        super({updatesCallbacks})
        this.type = type
        this.question = question
        this.answer = answer
        this.title = title
    }
    protected callbackArguments(): IValUpdates {
        return this.val()
    }
    public startPublishing() {
        if (this.publishing) {
            return
        }
        this.publishing = true
        const boundCallCallbacks = this.callCallbacks.bind(this)
        this.type.onUpdate(boundCallCallbacks)
        this.question.onUpdate(boundCallCallbacks)
        this.answer.onUpdate(boundCallCallbacks)
        this.title.onUpdate(boundCallCallbacks)
    }
}

@injectable()
class SubscribableContentArgs {
    @inject(TYPES.Array) public updatesCallbacks: any[]
    @inject(TYPES.ISubscribableMutableContentType) public type
    @inject(TYPES.ISubscribableMutableString) public question: ISubscribableMutableField<string>
    @inject(TYPES.ISubscribableMutableString) public answer: ISubscribableMutableField<string>
    @inject(TYPES.ISubscribableMutableString) public title: ISubscribableMutableField<string>
}

export {SubscribableContent, SubscribableContentArgs}
