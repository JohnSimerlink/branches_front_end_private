import {
	inject,
	injectable
} from 'inversify';
import {TYPES} from '../types';
import {
	FieldMutationTypes,
	IDatedMutation,
	IMutableSubscribableField,
	IOverdueListener,
	IOverdueListenerCore,
	timestamp
} from '../interfaces';
import {Subscribable} from '../subscribable/Subscribable';

/* setInterval and setTimeout behavior becomes glitchy after surpassing 2^31 ish milliseconds
 which is around 2 bil seconds as listed above
 */
const MAX_MILLISECONDS_FOR_TIMEOUT = 2147 * 1000 * 1000

export class OverdueListener implements IOverdueListener {
	private overdueListenerCore: IOverdueListenerCore;

	// TODO: should the below three objects be private?
	constructor(@inject(TYPES.OverdueListenerArgs) {
		overdueListenerCore
	}: OverdueListenerArgs) {
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

/* TODO: this class violates SRP - it sends a UI notification via message,
 as well as updates the db via addMutation on overdue property
 */
@injectable()
export class OverdueListenerCore extends Subscribable<null> implements IOverdueListenerCore {
	private nextReviewTime: IMutableSubscribableField<timestamp>;
	private overdue: IMutableSubscribableField<boolean>;
	private timeoutId: number;
	private onOverdue: () => any

	// TODO: should the below three objects be private?
	constructor(@inject(TYPES.OverdueListenerArgs) {
		overdue,
		nextReviewTime,
		timeoutId,
		onOverdue,
	}: OverdueListenerCoreArgs) {
		super()
		this.overdue = overdue;
		this.nextReviewTime = nextReviewTime;
		this.timeoutId = timeoutId;
		this.onOverdue = onOverdue;
	}

	public listenAndReactToAnyNextReviewTimeChanges() {
		this.nextReviewTime.onUpdate(this.onReviewTimeChange.bind(this))
	}

	public setOverdueTimer() {
		const overdueTime = this.nextReviewTime.val();
		const now = Date.now();
		const millisecondsTilOverdue = overdueTime - now;
		if (millisecondsTilOverdue <= 0) {
			this.markOverdue();
		} else {

			this.markNotOverdue()
			if (millisecondsTilOverdue > MAX_MILLISECONDS_FOR_TIMEOUT) {
				return; // don't set the timer
			}
			this.timeoutId = window.setTimeout(() => {
				/* ^^ deliberately say window.setTimeout (which returns a number,
				as opposed to Node's setTimeout which returns type Timer. */
				this.markOverdue();
				this.onOverdue()
			}, millisecondsTilOverdue);
		}
	}

	private onReviewTimeChange() {
		clearTimeout(this.timeoutId);
		this.markNotOverdue()
		this.setOverdueTimer();
	}

	private markNotOverdue() {
		const markFalse: IDatedMutation<FieldMutationTypes> = {
			timestamp: Date.now(),
			type: FieldMutationTypes.SET,
			data: false,
		};
		this.overdue.addMutation(markFalse);
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
	@inject(TYPES.Function) public onOverdue: () => any;
}
