import { isObject, isFunction } from "@vue/shared";
import { ReactiveEffect, trackEffect, triggerEffects } from "./effect";


class ComputedRefImpl { // computed basically is an effect
  private _value
  private _dirty = true
  private _effect
  public deps = new Set()
  constructor(public getter, public setter) {
    this._effect = new ReactiveEffect(getter, ()=>{
      if (!this._dirty) {
        this._dirty = true
        // notify collected effects to re-run
        triggerEffects(this.deps)
      }
    })
  }
  get value() {
    trackEffect(this.deps)
    if (this._dirty) {
      this._value = this._effect.run() 
      this._dirty = false
    }
    return this._value
  }
  set value(newValue) {
    this.setter(newValue) 
  }
}

export function computed(getterOrOptions) {
  let getter
  let setter
  let isGetter = isFunction(getterOrOptions) 
  const fn = () => console.warn('computed is read only')
  if (isGetter) {
    getter = getterOrOptions
    setter = () => fn 
  } else {
    getter = getterOrOptions.getter 
    setter = getterOrOptions.setter || fn
  }
  return new ComputedRefImpl(getter, setter)
}