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
		me.$refs.checkbox.addEventListener('change', function() {
			if (this.checked) {
				me.$emit('input', true)
			} else {
				me.$emit('input', false)
			}

		})

	}
};
