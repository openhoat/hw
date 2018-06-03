import {
  expect,
  proxyquire,
  givenDesc,
} from '@headwood/test-helper'

describe('private-object', () => {
  let PrivateObject: any
  before(() => {
    ({ PrivateObject } = proxyquire('../../lib/private-object', {}))
  })
  {
    const defaults = { foo: 'bar', hello: 'world' }
    context(givenDesc({ defaults }), () => {
      it('should build an instance with private data', () => {
        // Given
        const privateObject = new PrivateObject(defaults)
        expect(privateObject).to.be.an('object').that.is.ok
        expect(privateObject).to.have.property('priv')
        expect(privateObject.priv).to.eql(defaults)
      })
    })
  }
})
