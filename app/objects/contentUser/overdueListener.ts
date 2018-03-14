import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {
    FieldMutationTypes, IDatedMutation,
    IOverdueListener, IOverdueListenerCore,
    IMutableSubscribableField,
    timestamp
} from '../interfaces';
import Timer = NodeJS.Timer;
import {log} from '../../core/log';
import moment = require('moment');

export class OverdueListener  implements IOverdueListener {
    private overdueListenerCore: IOverdueListenerCore;
    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.OverdueListenerArgs) {
        overdueListenerCore
   }: OverdueListenerArgs ) {
        this.overdueListenerCore = overdueListenerCore;
    }
    public start() {
        this.overdueListenerCore.setOverdueTimer();
        this.overdueListenerCore.listenAndReactToAnyNextReviewTimeChanges();
    }
}
@injectable()
export class OverdueListenerArgs {
    @inject(TYPES.IOverdueListenerCore) public overdueListenerCore:
        IOverdueListenerCore;
}

@injectable()
export class OverdueListenerCore  implements IOverdueListenerCore {
    private nextReviewTime: IMutableSubscribableField<timestamp>;
    private overdue: IMutableSubscribableField<boolean>;
    private timeoutId: number;
    // TODO: should the below three objects be private?
    constructor(@inject(TYPES.OverdueListenerArgs) {
        overdue,
        nextReviewTime,
        timeoutId,
   }: OverdueListenerCoreArgs ) {
        this.overdue = overdue;
        this.nextReviewTime = nextReviewTime;
        this.timeoutId = timeoutId;
    }
    public listenAndReactToAnyNextReviewTimeChanges() {
        this.nextReviewTime.onUpdate(newNextReviewTime => {
            const markFalse: IDatedMutation<
                FieldMutationTypes> = {
                timestamp: Date.now(),
                type: FieldMutationTypes.SET,
                data: false,
            };
            this.overdue.addMutation(markFalse);

            clearTimeout(this.timeoutId);
            this.setOverdueTimer();
        });
    }
    public setOverdueTimer() {
        const overdueTime = this.nextReviewTime.val();
        const now = Date.now();
        const millisecondsTilOverdue = overdueTime - now;
        if (millisecondsTilOverdue <= 0) {
            this.markOverdue();
        } else {
            this.timeoutId = window.setTimeout(() => {
                /* ^^ deliberately say window.setTimeout (which returns a number,
                as opposed to Node's setTimeout which returns type Timer. */
                this.markOverdue();
            }, millisecondsTilOverdue);
        }
    }
    private markOverdue() {
        const markTrue: IDatedMutation<FieldMutationTypes> = {
            timestamp: Date.now(),
            type: FieldMutationTypes.SET,
            data: true,
        };
        this.overdue.addMutation(markTrue);
    }
}
@injectable()
export class OverdueListenerCoreArgs {
    @inject(TYPES.IMutableSubscribableNumber) public nextReviewTime:
        IMutableSubscribableField<timestamp>;
    @inject(TYPES.IMutableSubscribableBoolean) public overdue:
        IMutableSubscribableField<boolean>;
    @inject(TYPES.Number) public timeoutId: number;
}
