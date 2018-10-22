import {log} from '../../core/log';

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
