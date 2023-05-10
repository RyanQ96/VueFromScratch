import { isObject, isFunction } from "@vue/shared";
import { isReactive } from "./reactive";
import { ReactiveEffect } from "./effect";
function traverse(value, set = new Set()) {
  if (!isObject) return value
  if (set.has(value)) return
  set.add(value)
  for (let key in value) {
    traverse(value[key], set)
  }
  return value
}

export function watch(source, cb) {
  let getter;
  if (isReactive(source)) {
    getter = () => traverse(source)
  } else if (isFunction(source)) {
    getter = source
  } else {
    console.warn("source is not an reactive object or a function")
    return
  }
  let oldValue
  let waiting = false
  const job = () => {
    if (!waiting) {
      waiting = true
      Promise.resolve().then(() => {
        const newValue = effect.run()
        cb(newValue, oldValue)
        oldValue = newValue
        waiting = false
      })
    }
  }
  const effect = new ReactiveEffect(getter, job);
  oldValue = effect.run()
}