const env = process.env.NODE_ENV || 'development';
let template;

const STYLE_FILE = './birds.less';
const TEMPLATE_FILE = './authBirds.html';
if (env === 'test') {
	let register = requireBothWays('ignore-styles')
	register(['.html, .less']);
} else {
	let style = require('./birds.less').default || require('./birds.less');
	template = require('./authBirds.html').default || require('./authBirds.html')
}
// tslint:disable-next-line no-var-requires
export default {
	template, // '<div> {{movie}} this is the tree template</div>',
	created() {
		// this.birdAudio = new Audio('../../static/music/bird_tweet.wav')
		// this.$refs.bird1.
	},
	appreciated() {

	},
	methods: {
		async birdTweet() {
			// audio element needs to be an html element . . .when creating/fetching the audio via JS i ran into a dom exception
			const audio: HTMLAudioElement = document.querySelector('#bird-tweet')
			try {
				audio.play()
			} catch (e) {
				console.error('birdplay audio error is ', e, e.message, e.error, JSON.stringify(e))
			}
			// try {
			// 	const res = await this.birdAudio.play()
			// 	console.log('birdplay res is ', res)
			// } catch (e) {
			// }
		},
		bird1Move() {
			this.birdTweet()
			const random = randomAroundZero(250)
			const newVal = addNumberToCssPixels(this.$refs.bird1.style.marginTop, random)
			this.$refs.bird1.style.marginTop = newVal
		},
		bird2Move() {
			this.birdTweet()
			const random = randomAroundZero(250)
			const newVal = addNumberToCssPixels(this.$refs.bird2.style.marginTop, random)
			this.$refs.bird2.style.marginTop = newVal
		},
		bird3Move() {
			this.birdTweet()
			const random = randomAroundZero(250)
			const newVal = addNumberToCssPixels(this.$refs.bird3.style.marginTop, random)
			this.$refs.bird3.style.marginTop = newVal
		},
		bird4Move() {
			this.birdTweet()
			const random = randomAroundZero(250)
			const newVal = addNumberToCssPixels(this.$refs.bird4.style.marginTop, random)
			this.$refs.bird4.style.marginTop = newVal
		},
		bird5Move() {
			this.birdTweet()
			const random = randomAroundZero(250)
			const newVal = addNumberToCssPixels(this.$refs.bird5.style.marginTop, random)
			this.$refs.bird5.style.marginTop = newVal
		},
	}
};

function randomAroundZero(radius) {
	const initialNum = Math.random() * 2 * radius - radius
	// ensure the magnitude is at least 30 so that the users don't get confused as to why the bird doesn't move when tapping
	const threshold = 30
	let finalNum = initialNum
	const magnitude = Math.abs(initialNum)
	if (magnitude < threshold) {
		const scalingFactor = threshold / magnitude
		finalNum = initialNum * scalingFactor
	}
	return finalNum
}

function addNumberToCssPixels(cssPixels: string, num: number): string {
	const originalNumber = getNumberFromCssPixels(cssPixels)
	console.log("originalNumber is ", originalNumber, "number is ", num, "added is ", originalNumber + num)
	let sum: number = originalNumber + num
	if (sum < 100) {
		sum = 100 // ensure bird always stays at least on the top of the screen
	}
	const height = getScreenHeight()
	if (sum > height) {
		sum = height
		// TODO: trigger event to make bird change colors or something if it hits bottom of screen
	}
	const cssString = sum + "px"
	return cssString
}

function getNumberFromCssPixels(csspixels: string): number {
	if (csspixels.length === 0) {
		return 0
	}
	if (csspixels.length < 2) {
		return
	}
	return Number.parseInt(csspixels.substring(0, csspixels.length - 2))
}

function requireBothWays(importIdentifier) {
	const requiredValue = require(importIdentifier)
	const output = requiredValue.default || requiredValue
	return output
}

function getScreenHeight() {
	const height = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
	return height
}
