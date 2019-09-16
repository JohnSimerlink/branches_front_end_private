// import template from './views/knawledgeMap.html'
// import configure from 'ignore-styles'
import 'reflect-metadata';
import {
	decibels,
	IContentUserData,
	IFlipCardMutationArgs,
	ISigmaNodeData,
	IState,
	timestamp,
} from '../../objects/interfaces';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';
// tslint:disable-next-line no-var-requires
// const template = require('./knawledgeMap.html').default
import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import './cardConfidenceButtons2.less';
import {calculateCardWidth} from '../../../other_imports/sigma/renderers/canvas/cardDimensions';
import {
	calcHeight,
	calculateTextSizeFromNodeSize
} from '../../../other_imports/sigma/renderers/canvas/getDimensions';
import {log} from '../../core/log';
import {getContentUserId} from '../../loaders/contentUser/ContentUserLoaderUtils';
import * as moment
	from 'moment';
import {
	estimateCurrentInteractionStrengthFromContentUser,
	getMillisecondsSinceLastInteractionTime,
	getNextReviewTimeForContentUser
} from '../../objects/contentUser/MutableSubscribableContentUser';
import {calculateNextReviewTime} from '../../forgettingCurve';

const env = process.env.NODE_ENV || 'development';
if (env === 'test') {
	const register = require('ignore-styles').default;
	register(['.html', '.less']);
}

const template = require('./cardConfidenceButtons2.html').default;

export default {
	template,
	created() {
		// console.log('ccb2 created', this.cardId)
		this.oneListener = oneEventListener.bind(this)
		this.twoListener = twoEventListener.bind(this)
		this.threeListener = threeEventListener.bind(this)
		this.fourListener = fourEventListener.bind(this)
		document.body.addEventListener('keydown', this.oneListener);
		document.body.addEventListener('keydown', this.twoListener);
		// ev => {
		// 	if (ev.keyCode === 2 || ev.key === '2') {
		// 		this.clickProficiencyTwo()
		// 	}
		// });
		document.body.addEventListener('keydown', this.threeListener);
		// ev => {
		// 	if (ev.keyCode === 3 || ev.key === '3') {
		// 		this.clickProficiencyThree()
		// 	}
		// });
		document.body.addEventListener('keydown', this.fourListener);
		// ev => {
		// 	if (ev.keyCode === 4 || ev.key === '4') {
		// 		this.clickProficiencyFour()
		// 	}
		// });
	},
	destroyed() {
		log('destroyed called')
		document.body.removeEventListener('keydown', this.oneListener)
		document.body.removeEventListener('keydown', this.twoListener)
		document.body.removeEventListener('keydown', this.threeListener)
		document.body.removeEventListener('keydown', this.fourListener)

	},
	mounted() {
		// console.log('ccb2 mounted', this.cardId)
		this.timeOpened = Date.now()
	},
	props: {
		cardId: String,
	},
	data() {
		return {
			cardId: '123',
			timeOpened: null,
			oneListener: null,
			twoListener: null,
			threeListener: null,
			fourListener: null,
		};
	},
	watch: {
	},
	computed: {
		node(): ISigmaNodeData {
			const state: IState = this.$store.state
			return state.graph.nodes(this.cardId)
		},
		cardBottom() {
			if (this.node) {
				const bottom = this.cardCenter.y + this.cardHeight / 2
				return bottom
			}
		},
		cardCenter() {
			if (this.node) {
				return {
					x: this.node['renderer1:x'],
					y: this.node['renderer1:y'],
				}
			}
		},
		left() {
			if (this.node) {
				const left = this.cardCenter.x - this.cardWidth / 2
				// console.log('cardConfidenceButtons2 left called', left, this.cardCenter.x, this.cardWidth)
				return left
			}
			// this.node()
		},
		cardWidth() {
			if (this.node) {
				const width = calculateCardWidth(null, Number.parseInt(this.renderedSize))
				// console.log('cardConfidenceButtons2 cardWidth called', this.renderedSize, width)
				return width
			}
		},
		cardHeight() {
			if (!this.node) {
				return
			}
			const height = calcHeight(this.node)
			// console.log('cardConfidenceButtons2 cardHeight called', this.renderedSize, height)
			return height
		},
		renderedSize() {
			if (this.node) {
				return this.node['renderer1:size']
			}
		},
		fontSize() {
			return calculateTextSizeFromNodeSize(this.renderedSize) * .7
		},
		contentUserId() {
			const userId =  this.$store.getters.userId
			const contentUserId = getContentUserId({
				contentId: this.node.contentId,
				userId
			})
			return contentUserId
		},
		contentUserDataLoaded() {
			return !!(this.contentUserData && Object.keys(this.contentUserData).length);
		},
		contentUserData() {
			const contentUserData = this.$store.getters.contentUserData(this.contentUserId) || {};
			// this.proficiencyInput = contentUserData.proficiency || PROFICIENCIES.UNKNOWN;
			return contentUserData;
		},
		timeTilNextReviewIfClickOne() {
			// // if (!this.node.contentUserData) {
			// // 	return 'Very Soon'
			// // }
			// const friendlyTime = getFriendlyTime(PROFICIENCIES.ONE, this.contentUserData)
			// return friendlyTime
			//
			//
			// const newInteractionTime = Date.now();
			// const millisecondsSinceLastInteraction = getMillisecondsSinceLastInteractionTime(null, newInteractionTime)
			// // this.last - this.hasInteractions() ? nowMilliseconds - mostRecentInteraction.timestamp : 0
			//
			// /* if this is the first user's interaction and they scored higher than PROFICIENCIES.ONE
			//  we can assume they have learned it before.
			//  We will simply assume that they last saw it/learned it an hour ago.
			// 	(e.g. like in a lecture 1 hour ago).
			//  */
			// // const previousInteractionStrength =
			// // 	measurePreviousStrength(
			// // 		{
			// // 			estimatedPreviousStrength: this.lastEstimatedStrength.val(),
			// // 			R: this.proficiency.val(),
			// // 			t: millisecondsSinceLastInteraction / 1000
			// // 		}) || 0;
			// const val = this.val()
			// const currentEstimatedInteractionStrength =
			// 	estimateCurrentInteractionStrengthFromContentUser(PROFICIENCIES.ONE, null, millisecondsSinceLastInteraction)
			// // estimateCurrentStrength({
			// // 	previousInteractionStrengthDecibels: previousInteractionStrength,
			// // 	currentProficiency: this.proficiency.val(),
			// // 	secondsSinceLastInteraction: millisecondsSinceLastInteraction / 1000
			// // }) || 0;
			// const nextReviewTime = calculateNextReviewTime(
			// 	{
			// 		lastInteractionTime: newInteractionTime,
			// 		lastInteractionEstimatedStrength: currentEstimatedInteractionStrength
			// 	})

			const nextReviewTime = calculateNextReviewTime2(PROFICIENCIES.ONE, this.contentUserDataLoaded, this.contentUserData )
			return formatFriendly(nextReviewTime)









		},
		timeTilNextReviewIfClickTwo() {
			// if (!this.node.contentUserData) {
			// 	return 'Soon'
			// }
			// const friendlyTime = getFriendlyTime(PROFICIENCIES.ONE, this.contentUserData)
			// return friendlyTime
			// // const friendlyTime = getFriendlyTime(PROFICIENCIES.TWO, this.node.contentUserData)
			// // return friendlyTime

			const nextReviewTime = calculateNextReviewTime2(PROFICIENCIES.TWO, this.contentUserDataLoaded, this.contentUserData )
			return formatFriendly(nextReviewTime)
		},
		timeTilNextReviewIfClickThree() {
			// if (!this.node.contentUserData) {
			// 	return 'Later'
			// }
			const nextReviewTime = calculateNextReviewTime2(PROFICIENCIES.THREE, this.contentUserDataLoaded, this.contentUserData )
			return formatFriendly(nextReviewTime)
			// const friendlyTime = getFriendlyTime(PROFICIENCIES.THREE, this.contentUserData)
			// return friendlyTime
		},
		timeTilNextReviewIfClickFour() {
			const nextReviewTime = calculateNextReviewTime2(PROFICIENCIES.FOUR, this.contentUserDataLoaded, this.contentUserData )
			return formatFriendly(nextReviewTime)
			// if (!this.node.contentUserData) {
			// 	return 'Much Later'
			// }
			// const friendlyTime = getFriendlyTime(PROFICIENCIES.FOUR, this.contentUserData)
			// return friendlyTime
		},
	},
	methods: {
		clickProficiencyOne() {
			this.proficiencyClicked(PROFICIENCIES.ONE)
		},
		clickProficiencyTwo() {
			this.proficiencyClicked(PROFICIENCIES.TWO)
		},
		clickProficiencyThree() {
			this.proficiencyClicked(PROFICIENCIES.THREE)
		},
		clickProficiencyFour() {
			this.proficiencyClicked(PROFICIENCIES.FOUR)
		},
		proficiencyClicked(proficiency: PROFICIENCIES) {
			const contentUserId = this.contentUserId;
			const currentTime = Date.now();
			// log('cardMain proficiency clicked')
			if (!this.contentUserDataLoaded) {
				// log(
				// 	`ADD CONTENT INTERACTION IF NO CONTENT USER DATA ABOUT TO BE CALLED ${contentUserId} ${proficiency}`
				// );
				const contentUserData = this.$store.commit(
					MUTATION_NAMES.ADD_CONTENT_INTERACTION_IF_NO_CONTENT_USER_DATA,
					{
						contentUserId,
						proficiency,
						timestamp: currentTime,
					}
				);
			} else {
				// log(
				// 	'ADD CONTENT INTERACTION ABOUT TO BE CALLED '
				// );
				this.$store.commit(MUTATION_NAMES.ADD_CONTENT_INTERACTION, {
					contentUserId,
					proficiency,
					timestamp: currentTime
				});
			}

			const flipCardMutationArgs: IFlipCardMutationArgs = {
				sigmaId: this.node.id
			}
			this.$store.commit(MUTATION_NAMES.FLIP_FLASHCARD, flipCardMutationArgs)
			this.$store.commit(MUTATION_NAMES.JUMP_TO_NEXT_FLASHCARD_IF_IN_PLAYING_MODE);
			// this.$store.commit(MUTATION_NAMES.REFRESH); // needed to get rid of label disappearing bug

		}
	}
};
function getFriendlyTime(proficiency: PROFICIENCIES, contentUserData: IContentUserData) {
	const nextReviewTime = getNextReviewTimeForContentUser(proficiency, contentUserData.lastEstimatedStrength, null, Date.now())
	// console.log('nextReviewTime is ', nextReviewTime)
	// console.log('nextReviewTime datetime is ', moment(nextReviewTime))
	let friendlyTime = moment(nextReviewTime).fromNow()
	// console.log('friendlyTime is', friendlyTime)
	friendlyTime = friendlyTime.replace('minutes', 'min')
	friendlyTime = friendlyTime.replace('in a few seconds', '< 1 min')

	return friendlyTime
}
function formatFriendly(timestamp: timestamp) {
	let friendlyTime = moment(timestamp).fromNow()
	// console.log('friendlyTime for ', timestamp, ' is', friendlyTime, "--- diff is", Date.now() - timestamp)
	friendlyTime = friendlyTime.replace('minutes', 'min')
	friendlyTime = friendlyTime.replace('in a few seconds', '< 1 min')

	return friendlyTime
}

function calculateNextReviewTime2(proficiency: PROFICIENCIES, contentUserDataLoaded: boolean, contentUserData: IContentUserData, ): timestamp {
	// console.log('calculateNextReviewTime2 called', proficiency, contentUserDataLoaded, contentUserData)
	if (contentUserDataLoaded) {
		return calculateNextReviewTimeWithPreviousInteraction(proficiency, contentUserData.lastInteractionTime, contentUserData.lastEstimatedStrength)
	} else {
		return calculateNextReviewTimeWithoutPreviousInteraction(proficiency)
	}
}
function calculateNextReviewTimeWithPreviousInteraction(proficiency: PROFICIENCIES, previousInteractionTime: timestamp, lastEstimatedStrength: decibels): timestamp {
	// console.log('calculateNextReviewTimeWithPreviousInteraction called', proficiency, previousInteractionTime, lastEstimatedStrength)
	const newInteractionTime = Date.now();
	const millisecondsSinceLastInteraction = getMillisecondsSinceLastInteractionTime(previousInteractionTime, newInteractionTime)
	// console.log("calculateNextReviewTimeWithPreviousInteraction proficiency is", proficiency)
	// console.log("calculateNextReviewTimeWithPreviousInteraction.ts newInteractionTime", newInteractionTime)
	// console.log("calculateNextReviewTimeWithPreviousInteraction millisecondsSinceLastInteraction", millisecondsSinceLastInteraction)
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
	const currentEstimatedInteractionStrength =
		estimateCurrentInteractionStrengthFromContentUser(proficiency, lastEstimatedStrength, millisecondsSinceLastInteraction)
	// console.log("calculateNextReviewTimeWithPreviousInteraction currentEstimatedInteractionStrength proficiency is", currentEstimatedInteractionStrength)
	// estimateCurrentStrength({
	// 	previousInteractionStrengthDecibels: previousInteractionStrength,
	// 	currentProficiency: this.proficiency.val(),
	// 	secondsSinceLastInteraction: millisecondsSinceLastInteraction / 1000
	// }) || 0;
	const nextReviewTime = calculateNextReviewTime(
		{
			lastInteractionTime: newInteractionTime,
			lastInteractionEstimatedStrength: currentEstimatedInteractionStrength
		})
	// console.log("calculateNextReviewTimeWithPreviousInteraction nextReviewTime is", nextReviewTime)
	return nextReviewTime
}
function calculateNextReviewTimeWithoutPreviousInteraction(proficiency: PROFICIENCIES): timestamp {
	return calculateNextReviewTimeWithPreviousInteraction(proficiency, null, null)
}
function oneEventListener(ev) {
	log('1 eventListener called outer')
	if (ev.keyCode === 1 || ev.key === '1') {
		const state: IState = this.$store.state
		if (state.hoveringCardId === this.node.id) {
			log('1 eventListener called inside')
			this.clickProficiencyOne()
		}
	}
}
function twoEventListener(ev) {
	log('2 eventListener called outer')
	if (ev.keyCode === 2 || ev.key === '2') {
		const state: IState = this.$store.state
		if (state.hoveringCardId === this.node.id) {
			log('2 eventListener called inside')
			this.clickProficiencyTwo()
		}
	}
}
function threeEventListener(ev) {
	log('3 eventListener called outer')
	if (ev.keyCode === 3 || ev.key === '3') {
		const state: IState = this.$store.state
		if (state.hoveringCardId === this.node.id) {
			log('3 eventListener called inside')
			this.clickProficiencyThree()
		}
	}
}
function fourEventListener(ev) {
	if (ev.keyCode === 4 || ev.key === '4') {
		const state: IState = this.$store.state
		if (state.hoveringCardId === this.node.id) {
			this.clickProficiencyFour()
		}
	}

}
