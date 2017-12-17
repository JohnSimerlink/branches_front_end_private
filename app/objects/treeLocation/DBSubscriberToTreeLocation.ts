// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {log} from '../../core/log'
import {
    IDatabaseSyncer, IDBSubscriberToTreeLocation, IMutableSubscribablePoint
} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class DBSubscriberToTreeLocation implements IDBSubscriberToTreeLocation {
    private point: IMutableSubscribablePoint;
    private pointSyncer: IDatabaseSyncer

    constructor(@inject(TYPES.DBSubscriberToTreeLocationArgs) {
      point, pointSyncer,
    }) {
        this.pointSyncer = pointSyncer
        this.point = point
    }
    public subscribe() {
        this.pointSyncer.subscribe(this.point)
    }
}
@injectable()
export class DBSubscriberToTreeLocationArgs {
    @inject(TYPES.IMutableSubscribablePoint) public point: IMutableSubscribablePoint;
    @inject(TYPES.IDatabaseSyncer) private pointSyncer: IDatabaseSyncer;
}
