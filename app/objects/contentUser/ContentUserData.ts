// tslint:disable max-classes-per-file
import {inject, injectable} from 'inversify';
import {IContentUserData, timestamp} from '../interfaces';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';
import {TYPES} from '../types';

@injectable()
export class ContentUserData implements IContentUserData {
	public id: string;
	public overdue: boolean;
	public timer: number;
	public proficiency: PROFICIENCIES;
	public lastEstimatedStrength: any;
	public lastInteractionTime: timestamp;
	public nextReviewTime: timestamp;

	constructor(@inject(TYPES.ContentUserDataArgs) {
		id, overdue, timer, proficiency, lastRecordedStrength,
		lastInteractionTime, nextReviewTime,
	}: ContentUserDataArgs) {
		this.id = id;
		this.overdue = overdue;
		this.timer = timer;
		this.proficiency = proficiency;
		this.lastEstimatedStrength = lastRecordedStrength;
		this.lastInteractionTime = lastInteractionTime;
		this.nextReviewTime = nextReviewTime;
	}
}

@injectable()
export class ContentUserDataArgs {
	@inject(TYPES.String) public id: string;
	@inject(TYPES.Boolean) public overdue: boolean;
	@inject(TYPES.Number) public timer: number;
	@inject(TYPES.PROFICIENCIES) public proficiency: PROFICIENCIES;
	@inject(TYPES.Any) public lastRecordedStrength: any;
	@inject(TYPES.Number) public lastInteractionTime: timestamp;
	@inject(TYPES.Number) public nextReviewTime: timestamp;
}
