import {log} from '../../core/log';
import {PROFICIENCIES} from '../../objects/proficiency/proficiencyEnum';

const env = process.env.NODE_ENV || 'development';
let template = '';
if (env === 'test') {
	let register = require('ignore-styles').default;
	if (!register) {
		register = require('ignore-styles');
	}
	register(['.html, .less']);
} else {
	let style = require('./proficiency-selector.less').default;
	if (!style) {
		style = require('./proficiency-selector.less');
	}
	template = require('./proficiencySelector.html').default;
	if (!template) {
		template = require('./proficiencySelector.html');
	}
}

export default {
	props: ['value'],
	template,
	created() {
	},
	data() {
		return {};
	},
	computed: {
		proficiencyIsUnknown() {
			return this.value === PROFICIENCIES.UNKNOWN;
		},
		proficiencyIsOne() {
			return this.value <= PROFICIENCIES.ONE;
		},
		proficiencyIsTwo() {
			return this.value > PROFICIENCIES.ONE && this.value <= PROFICIENCIES.TWO;
		},
		proficiencyIsThree() {
			return this.value > PROFICIENCIES.TWO && this.value <= PROFICIENCIES.THREE;
		},
		proficiencyIsFour() {
			return this.value > PROFICIENCIES.THREE && this.value <= PROFICIENCIES.FOUR;
		},
	},
	methods: {
		setProficiencyToOne() {
			this.$emit('input', PROFICIENCIES.ONE);
		},
		setProficiencyToTwo() {
			this.$emit('input', PROFICIENCIES.TWO);
		},
		setProficiencyToThree() {
			this.$emit('input', PROFICIENCIES.THREE);
		},
		setProficiencyToFour() {
			this.$emit('input', PROFICIENCIES.FOUR);
		},
	}
};
