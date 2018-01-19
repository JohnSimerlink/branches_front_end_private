// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {log} from '../../core/log'
import {
    IDatabaseAutoSaver, IDBSubscriberToTreeLocation, IMutableSubscribablePoint
} from '../interfaces';
import {TYPES} from '../types';

@injectable()
export class DBSubscriberToTreeLocation implements IDBSubscriberToTreeLocation {
    private point: IMutableSubscribablePoint;
    private pointSyncer: IDatabaseAutoSaver

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
    @inject(TYPES.IDatabaseAutoSaver) private pointSyncer: IDatabaseAutoSaver;
}
