'use strict';


module.exports = function(config) {
    config.set({

        basePath: '',

        files: [
			'node_modules/sinon/pkg/sinon.js', // sinon doesn't work with webpack, so we have to load the browser version
            'test/**/*.test.js',
			{ pattern: 'public/**', watched: false, included: false, served: true }
        ],

        preprocessors: {
            'test/**/*.test.js': ['webpack', 'sourcemap']
        },

        webpack: {
			devtool: 'inline-source-map',
			module: {
				postLoaders: []
			}
		},

        webpackMiddleware: {
            stats: false
        },

        reporters: ['progress'],

        frameworks: ['mocha'],

		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
	
		// Number of browsers to run in parallel [set to 1 to avoid timing-based tests from failing]
		concurrency: 1,
		// Using SafariNative launcher to due changes in Mojave: https://github.com/karma-runner/karma-safari-launcher/issues/29
		browsers: ['Firefox', 'Chrome', 'SafariNative']

    });

	if (process.argv.indexOf('--with-coverage') > -1) {
		config.webpack.module.postLoaders.push({
			test: /\.js$/,
			exclude: /((test|node_modules)\/)|(lib\/detect\/(browser.js|environment.js))/,
			loader: 'istanbul-instrumenter'
		});

		config.reporters.push('coverage');

		config.coverageReporter = {
			dir: 'coverage',
			type: 'lcov'
		};
	}

	if (process.env.TRAVIS) {
		config.browsers = ['Firefox', 'Chrome_travis_ci'];
	}


};
