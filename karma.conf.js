 /* global module */
module.exports = function (config) {
	'use strict';
	config.set({
		autoWatch: true,
		singleRun: true,

		frameworks: ['jspm', 'jasmine'],

		jspm: {
			config: 'src/config.js',
			loadFiles: [
				'src/*.spec.js'
			],
			serveFiles: [
				'src/!(*spec).js'
			]
		},

		proxies: {
			'/src/': '/base/src/',
			'/jspm_packages/': '/src/jspm_packages/'
		},

		browsers: ['PhantomJS'],

		reporters: ['progress'],
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js'
        ]
	});

};
