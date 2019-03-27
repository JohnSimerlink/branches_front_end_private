
const env = process.env.NODE_ENV || 'development';
let template;

const STYLE_FILE = './birds.less';
const TEMPLATE_FILE = './signUpBirds.html';
if (env === 'test') {
	let register = requireBothWays('ignore-styles')
	register(['.html, .less']);
} else {
	let style = require('./birds.less').default || require('./birds.less');
	template = require('./signUpBirds.html').default || require('./signUpBirds.html')
}
// tslint:disable-next-line no-var-requires
export default {
	template, // '<div> {{movie}} this is the tree template</div>',
};
function requireBothWays(importIdentifier) {
	const requiredValue = require(importIdentifier)
	const output = requiredValue.default || requiredValue
	return output
}
