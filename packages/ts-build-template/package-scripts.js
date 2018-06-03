'use strict'

module.exports = {
  scripts: {
    clean: {
      default: {
        script: 'nps clean.dist',
        description: 'Clean all the temp directories',
      },
      dist: {
        script: 'rimraf dist/**',
        description: 'Clean the dist directory',
      },
    },
    lint: {
      script: 'eslint .',
      description: 'Validate code quality',
    },
    test: {
      script: 'mocha test/**/*.test.js',
      description: 'Run tests',
    },
    cover: {
      default: {
        script: 'if [ "$TRAVIS" = "true" ]; then nps cover.travis; else nps cover.local; fi',
        description: 'Run test coverage',
      },
      local: {
        script: 'nyc nps "test --forbid-only"',
        description: 'Run local test coverage',
      },
      travis: {
        script: 'nps cover.local && nps cover.report.travis',
        description: 'Run travis test coverage',
      },
      report: {
        travis: {
          script: 'nyc report --reporter=text-lcov | coveralls',
          description: 'Build travis coverage report',
        },
      },
    },
    validate: {
      default: {
        script: 'nps clean && nps lint && nps validate.cover',
        description: 'Validate project',
      },
      cover: {
        default: {
          script: 'nps cover && nps validate.cover.check',
          description: 'Run test and validate coverage',
        },
        check: {
          script: 'nyc check-coverage --lines 80',
          description: 'Validate code coverage',
        },
      },
    },
  },
}
