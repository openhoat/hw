import { PrivateData, PrivateMap } from './private-map'

const privateMap: PrivateMap<PrivateError> = new PrivateMap()

class PrivateError extends Error {
  protected readonly priv: PrivateData

  constructor(message?: string) {
    super(message)
    this.priv = privateMap.registerInstance(this)
  }
}

export { PrivateError }
