import { track, trigger } from "./effect";
export const enum  ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}
export const baseHandler = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    } else {
      // relate key and effect
      track(target, key)
      console.log(`logging: collect dependency for key: ${String(key)}`)
      return Reflect.get(target, key, receiver)
    }
  },
  set(target, key, value, receiver) {
    // based on key, find which effects need to change 
    let oldValue = target[key] 

    if (oldValue != value) {
      let result = Reflect.set(target, key, value, receiver)
      trigger(target, key, value) 
      return result; 
    }
  }
} 
