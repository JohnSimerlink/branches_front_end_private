// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDatabaseSyncer, ISubscribableMutableField} from '../interfaces';
import {IDBSubscriber} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';

@injectable()
class DBSubscriberToContentUser implements IDBSubscriber {
    private overdue: ISubscribableMutableField<string>;
    private timer: ISubscribableMutableField<string>;
    private proficiency: ISubscribableMutableField<PROFICIENCIES>;
    private lastRecordedStrength: ISubscribableMutableField<number>;
    private overdueSyncer: IDatabaseSyncer;
    private timerSyncer: IDatabaseSyncer;
    private proficiencySyncer: IDatabaseSyncer;
    private lastRecordedStrengthSyncer: IDatabaseSyncer;

    constructor(@inject(TYPES.DBSubscriberToTreeArgs) {
      overdue, timer, proficiency, lastRecordedStrength,
      overdueSyncer, timerSyncer, proficiencySyncer, lastRecordedStrengthSyncer
    }) {
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
class DBSubscriberToContentUserArgs {
    @inject(TYPES.ISubscribableMutableBoolean) public overdue
    @inject(TYPES.ISubscribableMutableString) public timer
    @inject(TYPES.ISubscribableMutableProficiency) public proficiency
    @inject(TYPES.ISubscribableMutableNumber) public lastRecordedStrength
    @inject(TYPES.IDatabaseSyncer) private overdueSyncer: IDatabaseSyncer;
    @inject(TYPES.IDatabaseSyncer) private timerSyncer: IDatabaseSyncer;
    @inject(TYPES.IDatabaseSyncer) private proficiencySyncer: IDatabaseSyncer;
    @inject(TYPES.IDatabaseSyncer) private lastRecordedStrengthSyncer: IDatabaseSyncer;
}
export {DBSubscriberToContentUser, DBSubscriberToContentUserArgs}
