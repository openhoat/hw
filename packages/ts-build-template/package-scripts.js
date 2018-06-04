'use strict'

module.exports = {
  scripts: {
    clean: {
      default: {
        script: 'nps clean.dist',
        description: 'Clean all the temp directories',
      },
      dist: {
        script: 'npx rimraf dist/**',
        description: 'Clean the dist directory',
      },
    },
    lint: {
      script: 'npx eslint .',
      description: 'Validate code quality',
    },
    test: {
      script: 'npx mocha test/**/*.test.js',
      description: 'Run tests',
    },
    cover: {
      default: {
        script: 'nps cover.$([ "$TRAVIS" = "true" ] && echo "travis" || echo "local")',
        description: 'Run test coverage',
      },
      local: {
        script: 'npx nyc nps "test --forbid-only"',
        description: 'Run local test coverage',
      },
      travis: {
        script: 'nps cover.local && nps cover.report.travis',
        description: 'Run travis test coverage',
      },
      report: {
        travis: {
          script: 'npx nyc report --reporter=text-lcov | coveralls',
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
          script: 'npx nyc check-coverage --lines 80',
          description: 'Validate code coverage',
        },
      },
    },
  },
}
