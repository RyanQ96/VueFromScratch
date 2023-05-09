export let activeEffect = undefined
export class ReactiveEffect {
  public active = true
  public fn
  public parent = null
  public deps = new Set()
  constructor(fn) { //传递的fn会被放在fn上
    this.fn = fn
  }
  run() {
    if (!this.active) {
      return this.fn() 
    } else {
      // dependencies tracking 
      try {
        this.parent = activeEffect
        activeEffect = this
        this.fn()
      } finally {
        activeEffect = this.parent
        this.parent = null
      }
    }
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
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
    const shouldTrack = !deps.has(activeEffect) 
    if (shouldTrack) {
      deps.add(activeEffect)
      if (!activeEffect.deps.has(deps)) {
        activeEffect.deps.add(deps)
      }
    }
  }
}

export function trigger(target, key, value) {
  let depsMap = targetMap.get(target) 
  if (!depsMap) return  // key doesn't reply on any effect 
  const effects = depsMap.get(key) 
  effects && effects.forEach(effect => {
    effect.run() // re-execute effect
  })
}
