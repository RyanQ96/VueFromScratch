import { isObject } from "@vue/shared";
import { activeEffect } from "./effect";
import { baseHandler, ReactiveFlags } from "./baseHandler";
const reactiveMap = new WeakMap(); // key of weakmap has to be an object
// v8's gabage collection mechanism 

export function reactive(target) {
  if (!isObject(target)) {
    return target
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  const existing = reactiveMap.get(target)
  if (existing) {
    return existing
  }

  const proxy = new Proxy(target, baseHandler)

  reactiveMap.set(target, proxy)
  return proxy
}

export function isReactive(object) {
  return !!(object && object[ReactiveFlags.IS_REACTIVE])
}