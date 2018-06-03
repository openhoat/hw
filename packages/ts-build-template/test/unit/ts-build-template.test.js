'use strict'

const { join } = require('path')
const { createSandbox, proxyquire, expect, givenDesc } = require('./helper')

describe('ts-build-template', () => {
  let sandbox
  let stubs
  let tsBuildTemplate
  before(() => {
    sandbox = createSandbox()
    const writeFileSync = sandbox.stub()
    const loadYamlFile = sandbox.stub()
    const fileNewerSync = sandbox.stub()
    const parseDynamicYaml = sandbox.stub()
    stubs = {
      fs: {
        writeFileSync,
      },
      helper: {
        loadYamlFile,
        fileNewerSync,
        parseDynamicYaml,
      },
    }
    tsBuildTemplate = proxyquire('../../lib/ts-build-template.js', {
      fs: stubs.fs,
      './helper': stubs.helper,
    })
  })
  after(() => {
    sandbox.reset()
  })
  describe('generateTsConfigFile', () => {
    {
      const projectDir = 'projectdir'
      const tsConfigTemplateFiles = ['tsconfig-tmp.yml', 'lib/tsconfig-tmp.yml']
      context(givenDesc({ projectDir, tsConfigTemplateFiles }), () => {
        it('should generate tsconfig.json', () => {
          // Given
          stubs.helper.fileNewerSync.onFirstCall().returns(true)
          // When
          tsBuildTemplate.generateTsConfigFile(projectDir, tsConfigTemplateFiles)
          // Then
          expect(stubs.helper.loadYamlFile).to.be.called
          expect(stubs.helper.fileNewerSync).to.be.called
          expect(stubs.helper.parseDynamicYaml).to.be.calledWith(join(projectDir, tsConfigTemplateFiles[0]))
          expect(stubs.fs.writeFileSync).to.be.called
        })
      })
    }
  })
  describe('getPackageScripts', () => {
    {
      const projectDir = 'projectdir'
      const expected = {
        result: { hello: 'world' },
      }
      context(givenDesc({ projectDir }), () => {
        it('should get package scripts', () => {
          // Given
          stubs.helper.loadYamlFile.returns({ hello: 'world' })
          stubs.helper.parseDynamicYaml.returns(expected.result)
          // When
          const result = tsBuildTemplate.getPackageScripts(projectDir)
          // Then
          expect(result).to.eql(expected.result)
        })
      })
    }
  })
})
