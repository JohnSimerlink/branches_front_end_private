// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDatabaseAutoSaver, ISubscribableMutableField} from '../interfaces';
import {IDBSubscriber} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class DBSubscriberToContent implements IDBSubscriber {
    private type: ISubscribableMutableField<string>;
    private question: ISubscribableMutableField<string>;
    private answer: ISubscribableMutableField<string>;
    private title: ISubscribableMutableField<string>;
    private typeSyncer: IDatabaseAutoSaver;
    private questionSyncer: IDatabaseAutoSaver;
    private answerSyncer: IDatabaseAutoSaver;
    private titleSyncer: IDatabaseAutoSaver;

    constructor(@inject(TYPES.DBSubscriberToTreeArgs) {
      type, question, answer, title,
      typeSyncer, questionSyncer, answerSyncer, titleSyncer
    }: DBSubscriberToContentArgs ) {
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
export class DBSubscriberToContentArgs {
    @inject(TYPES.ISubscribableMutableString) public type: ISubscribableMutableField<string>
    @inject(TYPES.ISubscribableMutableString) public question: ISubscribableMutableField<string>
    @inject(TYPES.ISubscribableMutableString) public answer: ISubscribableMutableField<string>
    @inject(TYPES.ISubscribableMutableString) public title: ISubscribableMutableField<string>
    @inject(TYPES.IDatabaseAutoSaver) public typeSyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) public questionSyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) public answerSyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) public titleSyncer: IDatabaseAutoSaver;
}
