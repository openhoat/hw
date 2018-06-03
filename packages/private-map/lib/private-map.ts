import { set, get } from 'lodash'

class PrivateData {
  constructor(defaults?: any) {
    if (typeof defaults === 'object') {
      Object.assign(this, defaults)
    }
  }

  set(name: string, value: any) {
    set(this, name, value)
    return this
  }

  get(name: string, defaultValue?: any): any {
    return get(this, name, defaultValue)
  }
}

class PrivateMap<K extends object> {
  private map: WeakMap<K, PrivateData> = new WeakMap()

  registerInstance(instance: K, defaults?: any): PrivateData {
    const privateData = new PrivateData(defaults)
    this.map.set(instance, privateData)
    return privateData
  }

  getInstance(instance: K): PrivateData | undefined {
    return this.map.get(instance)
  }
}

export { PrivateMap, PrivateData }
