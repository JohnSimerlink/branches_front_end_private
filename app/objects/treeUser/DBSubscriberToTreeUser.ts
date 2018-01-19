// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDatabaseAutoSaver, IProficiencyStats, ISubscribableMutableField} from '../interfaces';
import {IDBSubscriber} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';

@injectable()
class DBSubscriberToTreeUser implements IDBSubscriber {
    private proficiencyStats: ISubscribableMutableField<IProficiencyStats>;
    private aggregationTimer: ISubscribableMutableField<number>;
    private proficiencyStatsSyncer: IDatabaseAutoSaver;
    private aggregationTimerSyncer: IDatabaseAutoSaver;

    constructor(@inject(TYPES.DBSubscriberToTreeUserArgs) {
      proficiencyStats, aggregationTimer,
      proficiencyStatsSyncer, aggregationTimerSyncer,
    }) {
        this.proficiencyStats = proficiencyStats
        this.aggregationTimer = aggregationTimer
        this.proficiencyStatsSyncer = proficiencyStatsSyncer
        this.aggregationTimerSyncer = aggregationTimerSyncer
    }
    public subscribe() {
        // subscribe the database to any local changes in the objects
        this.proficiencyStatsSyncer.subscribe(this.proficiencyStats)
        this.aggregationTimerSyncer.subscribe(this.aggregationTimer)
    }
}
@injectable()
class DBSubscriberToTreeUserArgs {
    @inject(TYPES.ISubscribableMutableProficiencyStats) public proficiencyStats
    @inject(TYPES.ISubscribableMutableNumber) public aggregationTimer
    @inject(TYPES.IDatabaseAutoSaver) private proficiencyStatsSyncer: IDatabaseAutoSaver;
    @inject(TYPES.IDatabaseAutoSaver) private aggregationTimerSyncer: IDatabaseAutoSaver;
}
export {DBSubscriberToTreeUser, DBSubscriberToTreeUserArgs}
