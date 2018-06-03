export enum defaults {
  buildConfigFilename = '.buildrc.yml',
  packageScriptsTemplateFilename = 'package-scripts.tpl.yml',
}

export interface GenerateTsConfigFileOptions {
  buildConfigFilename: string,
}

export interface GetPackageScriptsOptions extends GenerateTsConfigFileOptions {
  packageScriptsTemplateFilename: string,
}

export function generateTsConfigFile(projectDir: string, tsConfigTemplateFiles: string[], options?: GenerateTsConfigFileOptions): void

export function getPackageScripts(projectDir: string, options?: GetPackageScriptsOptions): any
