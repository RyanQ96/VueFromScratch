import { isArray, isObject } from "@vue/shared";
import { reactive } from "./reactive"
import { trackEffect, triggerEffects } from "./effect";

function toReactive(value) {
  return isObject(value) ? reactive(value) : value
}

class RefImpl {
  public deps = new Set()
  public _value
  public rawValue
  constructor(value) {
    this._value = toReactive(value)
    this.rawValue = value
  }
  get value() {
    trackEffect(this.deps)
    return this._value
  }
  set value(newVal) {
    if(newVal !== this._value) {
      this._value = toReactive(newVal)
      this.rawValue = newVal
      triggerEffects(this.deps)
    }
  }
}


class ObjectRefImpl {
  constructor(public object, public key) {}
  get value() {
    return this.object[this.key]
  }
  set value(newVal) {
    this.object[this.key] = newVal
  }
}

export function ref(val) {
  return new RefImpl(val)    
}

export function toRef(target, key) {
  return new ObjectRefImpl(target, key) 
}

export function toRefs(object) {
  let result = isArray(object) ? new Array(object.length) : {}
  for (let key in object) {
    result[key] = toRef(object, key) 
  }
  return result
}