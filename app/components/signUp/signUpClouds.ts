const env = process.env.NODE_ENV || 'development';
let template;

const STYLE_FILE = './clouds.less';
const TEMPLATE_FILE = './signUpClouds.html';
if (env === 'test') {
	let register = requireBothWays('ignore-styles')
	register(['.html, .less']);
} else {
	let style = require('./clouds.less').default || require('./clouds.less');
	template = require('./signUpClouds.html').default || require('./signUpClouds.html'); // requireBothWays(TEMPLATE_FILE)
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
