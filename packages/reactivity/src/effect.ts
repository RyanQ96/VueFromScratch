export let activeEffect = undefined
export class ReactiveEffect {
  public active = true
  public fn
  public parent = null
  public deps = new Set()
  constructor(fn, public scheduler?) { //传递的fn会被放在fn上
    this.fn = fn
  }
  run() {
    if (!this.active) {
      return this.fn()
    } else {
      // dependencies tracking 
      try {
        cleanEffect(this)
        this.parent = activeEffect
        activeEffect = this
        return this.fn()
      } finally {
        activeEffect = this.parent
        this.parent = null
      }
    }
  }
  stop() {
    if (this.active) {
      this.active = false
      cleanEffect(this)
    }
  }
}


export function cleanEffect(effect){ 
  console.log('effect cleaned')
  effect.deps.forEach(deps => {
    deps.delete(effect)
  })
  effect.deps.clear()
}

export function effect(fn, options = {} as any) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect //expose effect instance 
  return runner // User can mannually stop collect and runner 
}

const targetMap = new WeakMap()
// map {object: {key: [effect, effect2....]}}
export function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, (deps = new Set()))
    }
    trackEffect(deps)
  }
}

export function trackEffect(deps) {
  const shouldTrack = !deps.has(activeEffect)
    if (shouldTrack) {
      deps.add(activeEffect)
      if (!activeEffect.deps.has(deps)) {
        activeEffect.deps.add(deps)
      }
    }
}

export function trigger(target, key, value) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return  // key doesn't reply on any effect 
  const effects = depsMap.get(key)
  triggerEffects(effects)
}

export function triggerEffects(effects) {
  effects && Array.from(effects).forEach((effect: ReactiveEffect) => {
    if (effect !== activeEffect) {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    } // re-execute effect
  })
}