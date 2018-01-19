// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDatabaseAutoSaver, ISubscribableMutableField} from '../interfaces';
import {IDBSubscriber} from '../interfaces';
import {TYPES} from '../types';

@injectable()
class DBSubscriberToContent implements IDBSubscriber {
    private type: ISubscribableMutableField<string>;
    private question: ISubscribableMutableField<string>;
    private answer: ISubscribableMutableField<string>;
    private title: ISubscribableMutableField<number>;
    private typeSyncer: IDatabaseAutoSaver;
    private questionSyncer: IDatabaseAutoSaver;
    private answerSyncer: IDatabaseAutoSaver;
    private titleSyncer: IDatabaseAutoSaver;

    constructor(@inject(TYPES.DBSubscriberToTreeArgs) {
      type, question, answer, title,
      typeSyncer, questionSyncer, answerSyncer, titleSyncer
    }) {
        this.type = type
        this.question = question
        this.answer = answer
        this.title = title
        this.typeSyncer = typeSyncer
        this.questionSyncer = questionSyncer
        this.answerSyncer = answerSyncer
        this.titleSyncer = titleSyncer
    }
    public subscribe() {
        // subscribe the database to any local changes in the objects
        this.typeSyncer.subscribe(this.type)
        this.questionSyncer.subscribe(this.question)
        this.answerSyncer.subscribe(this.answer)
        this.titleSyncer.subscribe(this.title)
    }
}
@injectable()
class DBSubscriberToContentArgs {
    @inject(TYPES.ISubscribableMutableString) public type
    @inject(TYPES.ISubscribableMutableString) public question
    @inject(TYPES.ISubscribableMutableString) public answer
    @inject(TYPES.ISubscribableMutableString) public title
    @inject(TYPES.IDatabaseAutoSaver) private typeSyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) private questionSyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) private answerSyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) private titleSyncer: IDatabaseAutoSaver;
}
export {DBSubscriberToContent, DBSubscriberToContentArgs}
