import { expect, use as chaiUse } from 'chai'
import { createSandbox, SinonSandbox, SinonStub, createStubInstance } from 'sinon'
import * as sinonChai from 'sinon-chai'
import { noCallThru } from 'proxyquire'
import { inspect } from 'util'

chaiUse(sinonChai)

const proxyquire = noCallThru().load

describe('test-helper', () => {
  let sandbox: SinonSandbox
  let stubs: any
  let helper: any
  before(() => {
    sandbox = createSandbox()
    stubs = {
      dirname: sandbox.stub(),
      resolve: sandbox.stub(),
      expect: sandbox.stub(),
      use: sandbox.stub(),
      inspect: sandbox.stub(),
      createSandbox: sandbox.stub(),
      createStubInstance: sandbox.stub(),
      sinonChai: sandbox.stub(),
      noCallThru: sandbox.stub(),
      caller: sandbox.stub(),
      proxyquireLoad: sandbox.stub(),
    }
    stubs.noCallThru.returns({ load: stubs.proxyquireLoad })
    helper = proxyquire('../../lib/helper', {
      path: { dirname: stubs.dirname, resolve: stubs.resolve },
      chai: { expect: stubs.expect, use: stubs.use },
      util: { inspect: stubs.inspect },
      sinon: {
        createSandbox: stubs.createSandbox,
        createStubInstance: stubs.createStubInstance,
      },
      'sinon-chai': stubs.sinonChai,
      proxyquire: { noCallThru: stubs.noCallThru },
      caller: stubs.caller,
    })
    expect(stubs.noCallThru).to.be.called
  })
  afterEach(() => {
    sandbox.restore()
  })
  it('should export needed functions', () => {
    expect(helper).to.be.ok
    expect(helper).to.have.property('expect', stubs.expect)
    expect(helper).to.have.property('createSandbox', stubs.createSandbox)
    expect(helper).to.have.property('createStubInstance', stubs.createStubInstance)
    expect(helper).to.have.property('proxyquire').that.is.a('function')
    expect(helper).to.have.property('hasBeenCalled').that.is.a('function')
  })
  context('proxyquire', () => {
    it('should return a proxified module', () => {
      // Given
      const request = 'mymodule'
      const expected = {
        callerFilename: 'thecallerfile',
        baseDir: 'thebasedir',
        relativeRequest: 'myrelativemodule',
        result: 'theresult',
      }
      stubs.caller.returns(expected.callerFilename)
      stubs.dirname.withArgs(expected.callerFilename).returns(expected.baseDir)
      stubs.resolve.withArgs(expected.baseDir, request).returns(expected.relativeRequest)
      stubs.proxyquireLoad.withArgs(expected.relativeRequest, stubs).returns(expected.result)
      // When
      const result = helper.proxyquire(request, stubs)
      // Then
      expect(result).to.equal(expected.result)
      expect(stubs.caller).to.be.called
      expect(stubs.dirname).to.be.calledWith(expected.callerFilename)
      expect(stubs.resolve).to.be.calledWith(expected.baseDir, request)
      expect(stubs.proxyquireLoad).to.be.calledWith(expected.relativeRequest, stubs)
    })
  })
  context('hasBeenCalled', () => {
    it('should true if function has been called', () => {
      // Given
      const fn = sandbox.stub()
      stubs.expect.withArgs(fn).returns({ to: { be: { called: {} } } })
      // When
      helper.hasBeenCalled(fn)
      // Then
      expect(stubs.expect).to.be.calledWith(fn)
    })
  })
  context('asString', () => {
    {
      const data = undefined
      const desc = inspect({ data }, { colors: process.stdin.isTTY, breakLength: Infinity })
      context(`given ${desc}`, () => {
        it('should return a string representation', () => {
          // Given
          const expected = { result: 'undefined' }
          // When
          const result = helper.asString(data)
          // Then
          expect(result).to.equal(expected.result)
          expect(stubs.inspect).to.not.be.called
        })
      })
    }
    {
      const data = 'data'
      const desc = inspect({ data }, { colors: process.stdin.isTTY, breakLength: Infinity })
      context(`given ${desc}`, () => {
        it('should return a string representation', () => {
          // When
          const result = helper.asString(data)
          // Then
          expect(result).to.equal(data)
          expect(stubs.inspect).to.not.be.called
        })
      })
    }
    {
      const data = { hello: 'world' }
      const desc = inspect({ data }, { colors: process.stdin.isTTY, breakLength: Infinity })
      context(`given ${desc}`, () => {
        it('should return a string representation', () => {
          // Given
          const expected = { result: 'theresult' }
          stubs.inspect.withArgs(data).returns(expected.result)
          // When
          const result = helper.asString(data)
          // Then
          expect(result).to.equal(expected.result)
          expect(stubs.inspect).to.be.calledWith(data)
        })
      })
    }
  })
  context('givenDesc', () => {
    it('should return a given description', () => {
      // Given
      const data = { hello: 'world' }
      const expected = { result: 'theresult' }
      stubs.inspect.withArgs(data).returns(expected.result)
      // When
      const result = helper.givenDesc(data)
      // Then
      expect(result).to.equal(`given : ${expected.result}`)
      expect(stubs.inspect).to.be.calledWith(data)
    })
  })
})
