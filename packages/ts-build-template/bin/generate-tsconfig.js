#!/bin/env node

'use strict'

const { generateTsConfigFile } = require('../lib/ts-build-template')

const projectDir = process.cwd()
const tsConfigTemplateFiles = process.argv.slice(2)
generateTsConfigFile(projectDir, tsConfigTemplateFiles)
