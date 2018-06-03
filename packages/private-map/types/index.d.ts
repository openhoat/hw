export interface PrivateErrorAble {
  readonly priv: PrivateDataAble
}

export interface PrivateDataAble {
  set(name: string, value: any): PrivateDataAble

  get(name: string, defaultValue?: any): any
}

export interface PrivateMapAble<K extends object> {
  map: WeakMap<K, PrivateDataAble>

  registerInstance(instance: K, defaults?: any): PrivateDataAble

  getInstance(instance: K): PrivateDataAble | undefined
}
