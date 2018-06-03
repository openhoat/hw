'use strict'

const { readFileSync, existsSync, statSync } = require('fs')
const { safeLoad } = require('js-yaml')
const Handlebars = require('handlebars')

Handlebars.registerHelper('helperMissing', context => {
  throw new Error(`${context.name} value not defined`)
})

function fileNewerSync(toFile, fromFile) {
  const toFiles = Array.isArray(toFile) ? toFile : [toFile]
  const newerToFile = toFiles.reduce((file1, file2) => {
    const file1Time = existsSync(file1) ? statSync(file1).mtimeMs : 0
    const file2Time = existsSync(file2) ? statSync(file2).mtimeMs : 0
    return file1Time > 0 && file1Time > file2Time ? file1 : file2
  })
  const newerToFileTime = existsSync(newerToFile) && statSync(newerToFile).mtimeMs
  const fromFileTime = existsSync(fromFile) && statSync(fromFile).mtimeMs
  return !!newerToFileTime && newerToFileTime > fromFileTime
}

function loadYamlFile(file) {
  return safeLoad(readFileSync(file, 'utf8'))
}

function parseDynamicYaml(yamlTemplate, config) {
  const yamlText = loadYamlFile(yamlTemplate)
  const template = Handlebars.compile(JSON.stringify(yamlText))
  const compiledYamlText = template(config)
  return JSON.parse(compiledYamlText)
}

module.exports = {
  fileNewerSync,
  loadYamlFile,
  parseDynamicYaml,
}
