import { PrivateData, PrivateMap } from './private-map'

const privateMap: PrivateMap<PrivateObject> = new PrivateMap()

class PrivateObject extends Object {
  protected readonly priv: PrivateData

  constructor(defaults?: any) {
    super()
    this.priv = privateMap.registerInstance(this, defaults)
  }
}

export { PrivateObject }
