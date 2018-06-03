'use strict'

const { createSandbox, proxyquire, expect, givenDesc } = require('./helper')

describe('helper', () => {
  let sandbox
  let stubs
  let helper
  before(() => {
    sandbox = createSandbox()
    const existsSync = sandbox.stub()
    const statSync = sandbox.stub()
    const readFileSync = sandbox.stub()
    const registerHelper = sandbox.stub()
    stubs = {
      fs: {
        existsSync,
        statSync,
        readFileSync,
      },
    }
    helper = proxyquire('../../lib/helper', {
      fs: stubs.fs,
      handlebars: { registerHelper },
    })
    expect(() => registerHelper.withArgs('helperMissing').yield({ name: 'foo' })).to.throw(Error, /value not defined/)
    expect(registerHelper).to.be.calledWith('helperMissing')
  })
  after(() => {
    sandbox.reset()
  })
  describe('fileNewerSync', () => {
    {
      context(givenDesc(undefined), () => {
        it('should return true if file is newer', () => {
          // Given
          stubs.fs.existsSync.returns(false)
          // When
          const result = helper.fileNewerSync()
          // Then
          expect(result).to.be.false
          expect(stubs.fs.existsSync).to.be.calledWith()
        })
      })
    }
    {
      const toFile = 'file1.txt'
      const toFileMtimeMs = 4
      context(givenDesc({ toFile, toFileMtimeMs }), () => {
        it('should return true if file is newer', () => {
          // Given
          stubs.fs.existsSync.withArgs(toFile).returns(true)
          stubs.fs.statSync.withArgs(toFile).returns({ mtimeMs: toFileMtimeMs })
          // When
          const result = helper.fileNewerSync(toFile)
          // Then
          expect(result).to.be.true
          expect(stubs.fs.existsSync).to.be.calledWith(toFile)
          expect(stubs.fs.statSync).to.be.calledWith(toFile)
        })
      })
    }
    {
      const toFile = 'file1.txt'
      const fromFile = 'file2.txt'
      const toFileMtimeMs = 4
      const fromFileMtimeMs = 2
      context(givenDesc({ toFile, fromFile, toFileMtimeMs, fromFileMtimeMs }), () => {
        it('should return true if file is newer', () => {
          // Given
          stubs.fs.existsSync.withArgs(toFile).returns(true)
          stubs.fs.statSync.withArgs(toFile).returns({ mtimeMs: toFileMtimeMs })
          stubs.fs.existsSync.withArgs(fromFile).returns(true)
          stubs.fs.statSync.withArgs(fromFile).returns({ mtimeMs: fromFileMtimeMs })
          // When
          const result = helper.fileNewerSync(toFile, fromFile)
          // Then
          expect(result).to.be.true
          expect(stubs.fs.existsSync).to.be.calledWith(toFile)
          expect(stubs.fs.statSync).to.be.calledWith(toFile)
          expect(stubs.fs.existsSync).to.be.calledWith(fromFile)
          expect(stubs.fs.statSync).to.be.calledWith(fromFile)
        })
      })
    }
    {
      const toFile = 'file1.txt'
      const fromFile = 'file2.txt'
      const toFileMtimeMs = 4
      const fromFileMtimeMs = 6
      context(givenDesc({ toFile, fromFile, toFileMtimeMs, fromFileMtimeMs }), () => {
        it('should return true if file is newer', () => {
          // Given
          stubs.fs.existsSync.withArgs(toFile).returns(true)
          stubs.fs.statSync.withArgs(toFile).returns({ mtimeMs: toFileMtimeMs })
          stubs.fs.existsSync.withArgs(fromFile).returns(true)
          stubs.fs.statSync.withArgs(fromFile).returns({ mtimeMs: fromFileMtimeMs })
          // When
          const result = helper.fileNewerSync(toFile, fromFile)
          // Then
          expect(result).to.be.false
          expect(stubs.fs.existsSync).to.be.calledWith(toFile)
          expect(stubs.fs.statSync).to.be.calledWith(toFile)
          expect(stubs.fs.existsSync).to.be.calledWith(fromFile)
          expect(stubs.fs.statSync).to.be.calledWith(fromFile)
        })
      })
    }
    {
      const toFile = ['file1.txt', 'file2.txt']
      const fromFile = 'file3.txt'
      const toFileMtimeMs = [4, 3]
      const fromFileMtimeMs = 6
      context(givenDesc({ toFile, fromFile, toFileMtimeMs, fromFileMtimeMs }), () => {
        it('should return true if file is newer', () => {
          // Given
          stubs.fs.existsSync.withArgs(toFile[0]).returns(true)
          stubs.fs.existsSync.withArgs(toFile[1]).returns(true)
          stubs.fs.statSync.withArgs(toFile[0]).returns({ mtimeMs: toFileMtimeMs[0] })
          stubs.fs.statSync.withArgs(toFile[1]).returns({ mtimeMs: toFileMtimeMs[1] })
          stubs.fs.existsSync.withArgs(fromFile).returns(true)
          stubs.fs.statSync.withArgs(fromFile).returns({ mtimeMs: fromFileMtimeMs })
          // When
          const result = helper.fileNewerSync(toFile, fromFile)
          // Then
          expect(result).to.be.false
          expect(stubs.fs.existsSync).to.be.calledWith(toFile[0])
          expect(stubs.fs.existsSync).to.be.calledWith(toFile[1])
          expect(stubs.fs.statSync).to.be.calledWith(toFile[0])
          expect(stubs.fs.statSync).to.be.calledWith(toFile[1])
          expect(stubs.fs.existsSync).to.be.calledWith(fromFile)
          expect(stubs.fs.statSync).to.be.calledWith(fromFile)
        })
      })
    }
    {
      const toFile = ['file1.txt', 'file2.txt']
      const fromFile = 'file3.txt'
      const toFileMtimeMs = [3, 4]
      const fromFileMtimeMs = 6
      context(givenDesc({ toFile, fromFile, toFileMtimeMs, fromFileMtimeMs }), () => {
        it('should return true if file is newer', () => {
          // Given
          stubs.fs.existsSync.withArgs(toFile[0]).returns(true)
          stubs.fs.existsSync.withArgs(toFile[1]).returns(true)
          stubs.fs.statSync.withArgs(toFile[0]).returns({ mtimeMs: toFileMtimeMs[0] })
          stubs.fs.statSync.withArgs(toFile[1]).returns({ mtimeMs: toFileMtimeMs[1] })
          stubs.fs.existsSync.withArgs(fromFile).returns(true)
          stubs.fs.statSync.withArgs(fromFile).returns({ mtimeMs: fromFileMtimeMs })
          // When
          const result = helper.fileNewerSync(toFile, fromFile)
          // Then
          expect(result).to.be.false
          expect(stubs.fs.existsSync).to.be.calledWith(toFile[0])
          expect(stubs.fs.existsSync).to.be.calledWith(toFile[1])
          expect(stubs.fs.statSync).to.be.calledWith(toFile[0])
          expect(stubs.fs.statSync).to.be.calledWith(toFile[1])
          expect(stubs.fs.existsSync).to.be.calledWith(fromFile)
          expect(stubs.fs.statSync).to.be.calledWith(fromFile)
        })
      })
    }
    {
      const toFile = ['file1.txt', 'notfound.txt']
      const fromFile = 'file3.txt'
      const toFileMtimeMs = 3
      const fromFileMtimeMs = 6
      context(givenDesc({ toFile, fromFile, toFileMtimeMs, fromFileMtimeMs }), () => {
        it('should return true if file is newer', () => {
          // Given
          stubs.fs.existsSync.withArgs(toFile[0]).returns(true)
          stubs.fs.existsSync.withArgs(toFile[1]).returns(false)
          stubs.fs.statSync.withArgs(toFile[0]).returns({ mtimeMs: toFileMtimeMs })
          stubs.fs.existsSync.withArgs(fromFile).returns(true)
          stubs.fs.statSync.withArgs(fromFile).returns({ mtimeMs: fromFileMtimeMs })
          // When
          const result = helper.fileNewerSync(toFile, fromFile)
          // Then
          expect(result).to.be.false
          expect(stubs.fs.existsSync).to.be.calledWith(toFile[0])
          expect(stubs.fs.existsSync).to.be.calledWith(toFile[1])
          expect(stubs.fs.statSync).to.be.calledWith(toFile[0])
          expect(stubs.fs.existsSync).to.be.calledWith(fromFile)
          expect(stubs.fs.statSync).to.be.calledWith(fromFile)
        })
      })
    }
    {
      const toFile = ['notfound.txt', 'file2.txt']
      const fromFile = 'file3.txt'
      const toFileMtimeMs = 3
      const fromFileMtimeMs = 6
      context(givenDesc({ toFile, fromFile, toFileMtimeMs, fromFileMtimeMs }), () => {
        it('should return true if file is newer', () => {
          // Given
          stubs.fs.existsSync.withArgs(toFile[0]).returns(false)
          stubs.fs.existsSync.withArgs(toFile[1]).returns(true)
          stubs.fs.statSync.withArgs(toFile[1]).returns({ mtimeMs: toFileMtimeMs })
          stubs.fs.existsSync.withArgs(fromFile).returns(true)
          stubs.fs.statSync.withArgs(fromFile).returns({ mtimeMs: fromFileMtimeMs })
          // When
          const result = helper.fileNewerSync(toFile, fromFile)
          // Then
          expect(result).to.be.false
          expect(stubs.fs.existsSync).to.be.calledWith(toFile[0])
          expect(stubs.fs.existsSync).to.be.calledWith(toFile[1])
          expect(stubs.fs.statSync).to.be.calledWith(toFile[1])
          expect(stubs.fs.existsSync).to.be.calledWith(fromFile)
          expect(stubs.fs.statSync).to.be.calledWith(fromFile)
        })
      })
    }
  })
  describe('loadYamlFile', () => {
    {
      const file = 'file.txt'
      context(givenDesc({ file }), () => {
        it('should load yaml file', () => {
          // Given
          stubs.fs.readFileSync.withArgs(file).returns(`---\nhello: world\nfoo: bar`)
          // When
          const result = helper.loadYamlFile(file)
          // Then
          expect(result).to.eql({ hello: 'world', foo: 'bar' })
        })
      })
    }
  })
  describe('parseDynamicYaml', () => {
    {
      const yamlTemplate = 'template.yml'
      const config = { hello: 'world' }
      context(givenDesc({ yamlTemplate, config }), () => {
        it('should parse dynamic yaml', () => {
          // Given
          stubs.fs.readFileSync.withArgs(yamlTemplate).returns(`---\nhello: '{{ hello }}'\nfoo: bar`)
          // When
          const result = helper.parseDynamicYaml(yamlTemplate, config)
          // Then
          expect(result).to.eql({ hello: 'world', foo: 'bar' })
        })
      })
    }
  })
})
