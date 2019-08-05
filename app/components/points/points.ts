const env = process.env.NODE_ENV || 'development';
let template = '';
if (env === 'test') {
	let register = require('ignore-styles').default;
	if (!register) {
		register = require('ignore-styles');
	}
	register(['.html']);
} else {
	template = require('./points.html').default;
	require('./points.less');
}
const UPDATE_FONT_SIZE = 25
const REGULAR_FONT_SIZE = 20
// tslint:disable-next-line no-var-requires
export default {
	template,
	data() {
		return {
			fontSize: REGULAR_FONT_SIZE,
			updateInProgress: false,
			deltaPoints: 0,
			oldPoints: 0,
		}
	},
	computed: {
		points() {
			const userId = this.$store.getters.userId;
			return this.$store.getters.userPoints(userId);
		},
	},
	methods: {
		clicked() {
			console.log('points clicked')
			// TODO: should open up leaderboards. with side swiping menu style
			// TODO: will show your real-time ranking highlighted white in a sea of blue
			// TODO: whenever you move up a spot in the leaderboards, this screen pops up and does an animation showing your ranking swapping spots with the person above you
			// TODO: when someone else takes your spot, it just does a toast notification or other type of notification
			// TODO: leaderboard notifications add a red facebook style notification number up at the top right (i.e. # of notifications you've missed, not # of leaderboard spots you've moved
			// TODO: multiple leaderboards - all, friends, Group (can select one group at a time - one being the Ohio State University)
			// TODO: points number is part of a golden progress bar, that is shimmering/puslating gold (and pulsates faster and bigger the closer you are to the end).
			// TODO: figure out how that progress bar stands in relation to the global one
			// TODO: maybe one of the progress bars should be progress in relation to passing the next person on the leaderboards , and one should be experience to the next personal level (e.g. runescape style)

		},
		pointsDisplay() {
			if (this.updateInProgress) {
				return this.oldPoints + this.deltaPoints
			} else {
				return this.points
			}
		}
	},
	watch: {
		points(newPoints, oldPoints) {
			this.updateInProgress = true
			this.fontSize = UPDATE_FONT_SIZE
			const totalDelta = newPoints - oldPoints
			this.oldPoints = oldPoints;
			this.deltaPoints = 0
			const totalUpdatePeriod = 500 // ms
			const intervalPeriod = 60
			const numIntervals = totalUpdatePeriod / intervalPeriod
			const intervalDelta = totalDelta / numIntervals
			let intervalCount = 0
			const intervalId = window.setInterval(() => {
				this.deltaPoints = this.deltaPoints + intervalDelta
				intervalCount++
				this.$forceUpdate()
				if (intervalCount > numIntervals) {
					window.clearInterval(intervalId)
					this.updateInProgress = false
					this.fontSize = REGULAR_FONT_SIZE
				}
			}, intervalPeriod)
		}
	}
};
