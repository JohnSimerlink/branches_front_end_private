// tslint:disable max-classes-per-file
// tslint:disable no-empty-interface
import {
	inject,
	injectable
} from 'inversify';
import {
	ContentUserPropertyMutationTypes,
	ContentUserPropertyNames,
	FieldMutationTypes,
	IContentUserData,
	IDatedMutation,
	IMutableSubscribableContentUser,
	IProppedDatedMutation,
	milliseconds,
	timestamp
} from '../interfaces';
import {TYPES} from '../types';
import {
	SubscribableContentUser,
	SubscribableContentUserArgs
} from './SubscribableContentUser';
import {
	calculateNextReviewTime,
	estimateCurrentStrength,
	measurePreviousStrength
} from '../../forgettingCurve';
import {PROFICIENCIES} from '../proficiency/proficiencyEnum';

@injectable()
export class MutableSubscribableContentUser extends SubscribableContentUser implements IMutableSubscribableContentUser {
	// TODO: should the below three objects be private?
	constructor(@inject(TYPES.SubscribableContentUserArgs) {
		updatesCallbacks, id, overdue, proficiency, timer, lastEstimatedStrength,
		lastInteractionTime, nextReviewTime
	}: SubscribableContentUserArgs) {
		super({
			updatesCallbacks,
			id,
			overdue,
			proficiency,
			timer,
			lastEstimatedStrength,
			lastInteractionTime,
			nextReviewTime
		});

	}

	public addMutation(mutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>
										 // TODO: this lack of typesafety between propertyName and MutationType is concerning
	): void {
		const propertyName: ContentUserPropertyNames = mutation.propertyName;
		const propertyMutation: IDatedMutation<ContentUserPropertyMutationTypes> = {
			data: mutation.data,
			timestamp: mutation.timestamp,
			type: mutation.type,
		};
		switch (propertyName) {
			case ContentUserPropertyNames.LAST_ESTIMATED_STRENGTH:
				this.lastEstimatedStrength.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case ContentUserPropertyNames.OVERDUE:
				this.overdue.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case ContentUserPropertyNames.PROFICIENCY:
				this.proficiency.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);

				// NOTE: no values are null in an edit mutation. They were set to a non-null/empty value during creation
				console.log("MutableSubscribableContentUser.ts proficiency is", mutation.data)
				const newInteractionTime = mutation.timestamp;
				const millisecondsSinceLastInteraction = getMillisecondsSinceLastInteractionTime(this.lastInteractionTime.val(), newInteractionTime)
				console.log("MutableSubscribableContentUser.ts newInteractionTime", newInteractionTime)
				console.log("MutableSubscribableContentUser.ts millisecondsSinceLastInteraction", millisecondsSinceLastInteraction)
				// this.last - this.hasInteractions() ? nowMilliseconds - mostRecentInteraction.timestamp : 0

				/* if this is the first user's interaction and they scored higher than PROFICIENCIES.ONE
				 we can assume they have learned it before.
				 We will simply assume that they last saw it/learned it an hour ago.
					(e.g. like in a lecture 1 hour ago).
				 */
				// const previousInteractionStrength =
				// 	measurePreviousStrength(
				// 		{
				// 			estimatedPreviousStrength: this.lastEstimatedStrength.val(),
				// 			R: this.proficiency.val(),
				// 			t: millisecondsSinceLastInteraction / 1000
				// 		}) || 0;
				const val = this.val()
				const currentEstimatedInteractionStrength =
					estimateCurrentInteractionStrengthFromContentUser(val.proficiency, val.lastEstimatedStrength, millisecondsSinceLastInteraction)
				console.log("MutableSubscribableContentUser.ts currentEstimatedInteractionStrength", currentEstimatedInteractionStrength)
					// estimateCurrentStrength({
					// 	previousInteractionStrengthDecibels: previousInteractionStrength,
					// 	currentProficiency: this.proficiency.val(),
					// 	secondsSinceLastInteraction: millisecondsSinceLastInteraction / 1000
					// }) || 0;
				const nextReviewTime = calculateNextReviewTime(
					{
						lastInteractionTime: newInteractionTime,
						lastInteractionEstimatedStrength: currentEstimatedInteractionStrength
					}
				);
				console.log("MutableSubscribableContentUser.ts nextReviewTime", nextReviewTime)

				const strengthMutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
					propertyName: ContentUserPropertyNames.LAST_ESTIMATED_STRENGTH,
					timestamp: Date.now(),
					type: FieldMutationTypes.SET,
					data: currentEstimatedInteractionStrength,
				};
				const interactionTimeMutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
					propertyName: ContentUserPropertyNames.LAST_INTERACTION_TIME,
					timestamp: Date.now(),
					type: FieldMutationTypes.SET,
					data: newInteractionTime,
				};
				const nextReviewTimeMutation: IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames> = {
					propertyName: ContentUserPropertyNames.NEXT_REVIEW_TIME,
					timestamp: Date.now(),
					type: FieldMutationTypes.SET,
					data: nextReviewTime,
				};

				this.addMutation(strengthMutation);
				this.addMutation(interactionTimeMutation);
				this.addMutation(nextReviewTimeMutation);

				// const strength = calculateStrength(sampleContentUser1Proficiency, )
				break;
			case ContentUserPropertyNames.TIMER:
				this.timer.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case ContentUserPropertyNames.LAST_INTERACTION_TIME:
				this.lastInteractionTime.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			case ContentUserPropertyNames.NEXT_REVIEW_TIME:
				this.nextReviewTime.addMutation(propertyMutation as IDatedMutation<FieldMutationTypes>);
				break;
			default:
				throw new TypeError(
					propertyName + JSON.stringify(mutation)
					+ ' does not exist as a property on ' + JSON.stringify(ContentUserPropertyNames));
		}
	}

	public mutations(): Array<IProppedDatedMutation<ContentUserPropertyMutationTypes, ContentUserPropertyNames>> {
		throw new Error('Not Implemented!');
	}
}
export function getMillisecondsSinceLastInteractionTime(lastInteractionTime: timestamp, newInteractionTime: timestamp): number {

	if (!lastInteractionTime) {
		lastInteractionTime = newInteractionTime - 1000 * 60 * 60; // an hour ago
	}
	const millisecondsSinceLastInteraction = newInteractionTime - lastInteractionTime;
	return millisecondsSinceLastInteraction
}

/**
 * @assumes that the proficiency has already mutated for contentUser
 * @param contentUserData
 * @param millisecondsSinceLastInteraction
 */
export function estimateCurrentInteractionStrengthFromContentUser(
	proficiency, lastEstimatedStrength, millisecondsSinceLastInteraction: milliseconds): number {

	const previousInteractionStrength =
		measurePreviousStrength(
			{
				estimatedPreviousStrength: lastEstimatedStrength,
				R: proficiency,
				t: millisecondsSinceLastInteraction / 1000
			}) || 0;
	const currentEstimatedInteractionStrength =
		estimateCurrentStrength({
			previousInteractionStrengthDecibels: previousInteractionStrength,
			currentProficiency: proficiency,
			secondsSinceLastInteraction: millisecondsSinceLastInteraction / 1000
		}) || 0;
	return currentEstimatedInteractionStrength
}

/**
 * @assumes that the proficiency has already mutated for contentUser
 * @param contentUser
 * @param newInteractionTime
 * @param lastInteractionTime CAN be null
 */
export function getNextReviewTimeForContentUser(proficiency: PROFICIENCIES, lastInteractionStrength, lastInteractionTime: timestamp | null, newInteractionTime ) {

	const millisecondsSinceLastInteraction = getMillisecondsSinceLastInteractionTime(lastInteractionTime, newInteractionTime)
	const currentEstimatedInteractionStrength =
		estimateCurrentInteractionStrengthFromContentUser(proficiency, lastInteractionStrength, millisecondsSinceLastInteraction)
	const nextReviewTime = calculateNextReviewTime(
		{
			lastInteractionTime: newInteractionTime,
			lastInteractionEstimatedStrength: currentEstimatedInteractionStrength
		}
	);
	return nextReviewTime
}
