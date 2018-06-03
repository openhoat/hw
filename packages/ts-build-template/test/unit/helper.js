'use strict'

const { expect, use: chaiUse } = require('chai')
const { inspect } = require('util')
const { createSandbox, SinonSandbox, SinonStub, createStubInstance } = require('sinon')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')

const chaiAsPromised = require('chai-as-promised')
chaiUse(sinonChai)
chaiUse(chaiAsPromised)

function hasBeenCalled(fn) {
  expect(fn).to.be.called
}

function asString(data) {
  return data === undefined ?
    'undefined' :
    (
      typeof data === 'object' ?
        inspect(data, { colors: process.stdin.isTTY, breakLength: Infinity }) :
        data
    )
}

function givenDesc(data) {
  return `given : ${asString(data)}`
}

module.exports = {
  expect,
  SinonSandbox,
  SinonStub,
  createSandbox,
  createStubInstance,
  proxyquire,
  givenDesc,
}
