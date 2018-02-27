// // tslint:disable max-classes-per-file
// // tslint:disable no-empty-interface
import {inject, injectable} from 'inversify';
import {
    IContentUserData,
    ISubscribableContentUser,
    IMutableSubscribableField,
    IValUpdates, timestamp,
} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {Subscribable} from '../subscribable/Subscribable';
import {TYPES} from '../types'

@injectable()
export class SubscribableContentUser extends Subscribable<IValUpdates> implements ISubscribableContentUser {
    private publishing = false
    public id: string
    public overdue: IMutableSubscribableField<boolean>;
    public timer: IMutableSubscribableField<number>;
    public proficiency: IMutableSubscribableField<PROFICIENCIES>;
    public lastEstimatedStrength: IMutableSubscribableField<number>;
    public lastInteractionTime: IMutableSubscribableField<timestamp>
    public nextReviewTime: IMutableSubscribableField<timestamp>

    // TODO: should the below three objects be private?
    public val(): IContentUserData {
        return {
            id: this.id,
            lastEstimatedStrength: this.lastEstimatedStrength.val(),
            overdue: this.overdue.val(),
            proficiency: this.proficiency.val(),
            timer: this.timer.val(),
            lastInteractionTime: this.lastInteractionTime.val(),
            nextReviewTime: this.nextReviewTime.val()
        }
    }
    constructor(@inject(TYPES.SubscribableContentUserArgs) {
        updatesCallbacks, id, overdue, proficiency, timer, lastEstimatedStrength,
        lastInteractionTime, nextReviewTime
    }: SubscribableContentUserArgs) {
        super({updatesCallbacks})
        this.id = id
        this.overdue = overdue
        this.proficiency = proficiency
        this.timer = timer
        this.lastEstimatedStrength = lastEstimatedStrength
        this.lastInteractionTime = lastInteractionTime
        this.nextReviewTime = nextReviewTime
    }
    protected callbackArguments(): IValUpdates {
        return this.val()
    }
    public startPublishing() {
        if (this.publishing) {
            return
        }
        this.publishing = true
        const boundCallCallbacks = this.callCallbacks.bind(this)
        this.overdue.onUpdate(boundCallCallbacks)
        this.proficiency.onUpdate(boundCallCallbacks)
        this.timer.onUpdate(boundCallCallbacks)
        this.lastEstimatedStrength.onUpdate(boundCallCallbacks)
        this.lastInteractionTime.onUpdate(boundCallCallbacks)
        this.nextReviewTime.onUpdate(boundCallCallbacks)
    }
}

@injectable()
export class SubscribableContentUserArgs {
    @inject(TYPES.Array) public updatesCallbacks: Array<Function>
    @inject(TYPES.String) public id: string
    @inject(TYPES.IMutableSubscribableNumber) public lastEstimatedStrength: IMutableSubscribableField<number>
    @inject(TYPES.IMutableSubscribableBoolean) public overdue: IMutableSubscribableField<boolean>
    @inject(TYPES.IMutableSubscribableProficiency) public proficiency: IMutableSubscribableField<PROFICIENCIES>
    @inject(TYPES.IMutableSubscribableNumber) public timer: IMutableSubscribableField<number>
    @inject(TYPES.IMutableSubscribableNumber) public lastInteractionTime: IMutableSubscribableField<timestamp>
    @inject(TYPES.IMutableSubscribableNumber) public nextReviewTime: IMutableSubscribableField<timestamp>
}
