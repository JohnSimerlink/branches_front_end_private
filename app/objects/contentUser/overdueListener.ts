import {inject, injectable} from 'inversify';
import {TYPES} from '../types';
import {
	FieldMutationTypes,
	IDatedMutation,
	IMutableSubscribableField,
	IOverdueListener,
	IOverdueListenerCore,
	timestamp
} from '../interfaces';
import {log} from '../../core/log';

const MAX_MILLISECONDS_FOR_TIMEOUT = 2147 * 1000 * 1000 // setInterval and setTimeout behavior becomes glitchy after surpassing 2^31 ish milliseconds which is around 2 bil seconds as listed above
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

@injectable()
export class OverdueListenerCore implements IOverdueListenerCore {
	private nextReviewTime: IMutableSubscribableField<timestamp>;
	private overdue: IMutableSubscribableField<boolean>;
	private timeoutId: number;

	// TODO: should the below three objects be private?
	constructor(@inject(TYPES.OverdueListenerArgs) {
		overdue,
		nextReviewTime,
		timeoutId,
	}: OverdueListenerCoreArgs) {
		this.overdue = overdue;
		this.nextReviewTime = nextReviewTime;
		this.timeoutId = timeoutId;
	}

	public listenAndReactToAnyNextReviewTimeChanges() {
		this.nextReviewTime.onUpdate(this.onReviewTimeChange.bind(this))
	}

	public setOverdueTimer() {
		const overdueTime = this.nextReviewTime.val();
		const now = Date.now();
		const millisecondsTilOverdue = overdueTime - now;
		log('setOverdueTimer just called', millisecondsTilOverdue)
		if (millisecondsTilOverdue <= 0) {
			this.markOverdue();
		} else {

			this.markNotOverdue()
			log('markNotOverdue just called')
			if (millisecondsTilOverdue < MAX_MILLISECONDS_FOR_TIMEOUT)
			this.timeoutId = window.setTimeout(() => {
				/* ^^ deliberately say window.setTimeout (which returns a number,
				as opposed to Node's setTimeout which returns type Timer. */
				this.markOverdue();
				log('window setTimeout of markOverDue just called')
			}, millisecondsTilOverdue);
		}
	}

	private onReviewTimeChange() {
		log('onReviewTimeChange called')
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
}
