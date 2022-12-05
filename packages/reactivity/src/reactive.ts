import { isObject } from "@vue/shared";
const reactiveMap = new WeakMap() // 弱引用, 不会内存泄漏
// v8 engine's garbage collection mechanism 标记删除, 引用计数

const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export function reactive(target) {
  if (!isObject(target)) {
    return target
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  const existing = reactiveMap.get(target)
  if (existing) return existing

  // es6's Proxy
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true 
      }
      console.log("Here we can record which effect is using this property ")
      return Reflect.get(target, key, receiver)
    }, 
    set(target, key, value, receiver) {
      console.log("Here can notify effect to re-evaluate") 
      return Reflect.set(target, key, value, receiver)
    }
  })
  reactiveMap.set(target, proxy)
  return proxy
}


