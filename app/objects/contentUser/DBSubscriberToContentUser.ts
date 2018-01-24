// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDatabaseAutoSaver, ISubscribableMutableField} from '../interfaces';
import {IDBSubscriber} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';

@injectable()
export class DBSubscriberToContentUser implements IDBSubscriber {
    private overdue: ISubscribableMutableField<boolean>;
    private timer: ISubscribableMutableField<string>;
    private proficiency: ISubscribableMutableField<PROFICIENCIES>;
    private lastRecordedStrength: ISubscribableMutableField<number>;
    private overdueSyncer: IDatabaseAutoSaver;
    private timerSyncer: IDatabaseAutoSaver;
    private proficiencySyncer: IDatabaseAutoSaver;
    private lastRecordedStrengthSyncer: IDatabaseAutoSaver;

    constructor(@inject(TYPES.DBSubscriberToTreeArgs) {
      overdue, timer, proficiency, lastRecordedStrength,
      overdueSyncer, timerSyncer, proficiencySyncer, lastRecordedStrengthSyncer
    }: DBSubscriberToContentUserArgs) {
        this.overdue = overdue
        this.timer = timer
        this.proficiency = proficiency
        this.lastRecordedStrength = lastRecordedStrength
        this.overdueSyncer = overdueSyncer
        this.timerSyncer = timerSyncer
        this.proficiencySyncer = proficiencySyncer
        this.lastRecordedStrengthSyncer = lastRecordedStrengthSyncer
    }
    public subscribe() {
        // subscribe the database to any local changes in the objects
        this.overdueSyncer.subscribe(this.overdue)
        this.timerSyncer.subscribe(this.timer)
        this.proficiencySyncer.subscribe(this.proficiency)
        this.lastRecordedStrengthSyncer.subscribe(this.lastRecordedStrength)
    }
}
@injectable()
export class DBSubscriberToContentUserArgs {
    @inject(TYPES.ISubscribableMutableBoolean) public overdue: ISubscribableMutableField<boolean>
    @inject(TYPES.ISubscribableMutableString) public timer: ISubscribableMutableField<string>
    @inject(TYPES.ISubscribableMutableProficiency) public proficiency
    @inject(TYPES.ISubscribableMutableNumber) public lastRecordedStrength: ISubscribableMutableField<number>
    @inject(TYPES.IDatabaseAutoSaver) public overdueSyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) public timerSyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) public proficiencySyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) public lastRecordedStrengthSyncer: IDatabaseAutoSaver;
}
