// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IDatabaseSyncer, IProficiencyStats, ISubscribableMutableField} from '../interfaces';
import {IDBSubscriber} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class DBSubscriberToTreeLocation implements IDBSubscriber {
    private proficiencyStats: ISubscribableMutableField<IProficiencyStats>;
    private aggregationTimer: ISubscribableMutableField<number>;
    private proficiencyStatsSyncer: IDatabaseSyncer;
    private aggregationTimerSyncer: IDatabaseSyncer;

    constructor(@inject(TYPES.DBSubscriberToTreeLocationArgs) {
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
export class DBSubscriberToTreeLocationArgs {
    @inject(TYPES.ISubscribableMutableProficiencyStats) public proficiencyStats
    @inject(TYPES.ISubscribableMutableNumber) public aggregationTimer
    @inject(TYPES.IDatabaseSyncer) private proficiencyStatsSyncer: IDatabaseSyncer;
    @inject(TYPES.IDatabaseSyncer) private aggregationTimerSyncer: IDatabaseSyncer;
}
