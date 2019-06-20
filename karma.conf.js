'use strict';
var path = require('path');

module.exports = function(config) {
    config.set({

        basePath: '',

        files: [
			'node_modules/sinon/pkg/sinon.js', // sinon doesn't work with webpack, so we have to load the browser version
            'test/**/*.test.js',
			{ pattern: 'public/**', watched: false, included: false, served: true }
        ],

        preprocessors: {
            'test/**/*.test.js': ['webpack', 'sourcemap'],

			'lib/**/*.js': ['coverage']
        },

        webpack: {
			devtool: 'inline-source-map',
			module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: { loader: 'istanbul-instrumenter-loader' },
                        include: path.resolve('lib/'),
                        exclude: /((test|node_modules)\/)|(lib\/detect\/(browser.js|environment.js))/
                    }
                ]
			}
		},

        webpackMiddleware: {
            stats: false
        },

        reporters: ['progress'],

		coverageReporter: {
        	type: 'lcov',
			dir: 'coverage',
            instrumenterOptions: {
                istanbul: { noCompact: true }
            }
		},

        frameworks: ['mocha'],

		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
	
		// Number of browsers to run in parallel [set to 1 to avoid timing-based tests from failing]
		concurrency: 1,
		browsers: ['Firefox', 'Chrome']

    });

	if (process.env.TRAVIS) {
		config.browsers = ['Firefox', 'Chrome_travis_ci'];
	}

    if (process.argv.indexOf('--with-coverage') > -1) {
        config.reporters.push('coverage');
    }
};
