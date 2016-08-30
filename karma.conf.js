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

        browsers: ['Firefox', 'Chrome', 'Safari']

    });

	if (process.argv.indexOf('--with-coverage') > -1) {
		config.webpack.module.postLoaders.push({
			test: /\.js$/,
			exclude: /(test|node_modules)\//,
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
