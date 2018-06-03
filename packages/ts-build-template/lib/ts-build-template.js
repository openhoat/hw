'use strict'

const { join, dirname } = require('path')
const { writeFileSync } = require('fs')
const { loadYamlFile, fileNewerSync, parseDynamicYaml } = require('./helper')

const defaults = {
  buildConfigFilename: '.buildrc.yml',
  packageScriptsTemplateFilename: 'package-scripts.tpl.yml',
}

function generateTsConfigFile(projectDir, tsConfigTemplateFiles, options) {
  const { buildConfigFilename } = Object.assign({
    buildConfigFilename: defaults.buildConfigFilename,
  }, options)
  const projectConfigFile = join(projectDir, buildConfigFilename)
  const projectConfig = loadYamlFile(projectConfigFile)
  tsConfigTemplateFiles.map(tsConfigTemplateFile => join(projectDir, tsConfigTemplateFile))
    .forEach(tsConfigTemplateFile => {
      const tsConfigFile = join(dirname(tsConfigTemplateFile), 'tsconfig.json')
      const newer = fileNewerSync([projectConfigFile, tsConfigTemplateFile], tsConfigFile)
      if (!newer) {
        return
      }
      const tsConfig = parseDynamicYaml(tsConfigTemplateFile, projectConfig)
      writeFileSync(tsConfigFile, JSON.stringify(tsConfig, null, 2))
    })
}

function getPackageScripts(projectDir, options) {
  const { buildConfigFilename, packageScriptsTemplateFilename } = Object.assign({
    buildConfigFilename: defaults.buildConfigFilename,
    packageScriptsTemplateFilename: defaults.packageScriptsTemplateFilename,
  }, options)
  const packageScriptTemplateFile = join(projectDir, packageScriptsTemplateFilename)
  const projectConfigFile = join(projectDir, buildConfigFilename)
  const projectConfig = loadYamlFile(projectConfigFile)
  return parseDynamicYaml(packageScriptTemplateFile, projectConfig)
}

module.exports = { generateTsConfigFile, getPackageScripts, defaults }
