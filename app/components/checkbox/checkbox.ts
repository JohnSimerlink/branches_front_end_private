import {MUTATION_NAMES} from '../../core/store/STORE_MUTATION_NAMES';
import {
	ICreateUserWithEmailMutationArgs,
	ILoginWithEmailMutationArgs,
	IState
} from '../../objects/interfaces';

const env = process.env.NODE_ENV || 'development';
let template;

if (env === 'test') {
	let register = require('ignore-styles').default || require('ignore-styles');
	register(['.html, .less']);
} else {
	let style = require('./checkbox.less').default || require('./checkbox.less');
	template = require('./checkbox.html').default || require('./checkbox.html');
}
// tslint:disable-next-line no-var-requires
export default {
	props: ['value'],
	template, // '<div> {{movie}} this is the tree template</div>',
	mounted() {
		const me = this
		console.log('checkbox.ts mounted value is ', this.value)
		me.$refs.checkbox.addEventListener('change', function() {
			if (this.checked) {
				me.$emit('input', true);
				/* NOTE: YES we are reversing the values.
				 this is the only way it works intuitively. For some reason when the UI looks false it is actually returning true */
			} else {
				me.$emit('input', false)
			}

		})

	}
};
