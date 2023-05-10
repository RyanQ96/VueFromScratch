var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    computed: () => computed,
    effect: () => effect,
    reactive: () => reactive,
    ref: () => ref,
    watch: () => watch
  });

  // packages/reactivity/src/effect.ts
  var activeEffect = void 0;
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.scheduler = scheduler;
      this.active = true;
      this.parent = null;
      this.deps = /* @__PURE__ */ new Set();
      this.fn = fn;
    }
    run() {
      if (!this.active) {
        return this.fn();
      } else {
        try {
          cleanEffect(this);
          this.parent = activeEffect;
          activeEffect = this;
          return this.fn();
        } finally {
          activeEffect = this.parent;
          this.parent = null;
        }
      }
    }
    stop() {
      if (this.active) {
        this.active = false;
        cleanEffect(this);
      }
    }
  };
  function cleanEffect(effect2) {
    console.log("effect cleaned");
    effect2.deps.forEach((deps) => {
      deps.delete(effect2);
    });
    effect2.deps.clear();
  }
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, key) {
    if (activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let deps = depsMap.get(key);
      if (!deps) {
        depsMap.set(key, deps = /* @__PURE__ */ new Set());
      }
      trackEffect(deps);
    }
  }
  function trackEffect(deps) {
    const shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
      deps.add(activeEffect);
      if (!activeEffect.deps.has(deps)) {
        activeEffect.deps.add(deps);
      }
    }
  }
  function trigger(target, key, value) {
    let depsMap = targetMap.get(target);
    if (!depsMap)
      return;
    const effects = depsMap.get(key);
    triggerEffects(effects);
  }
  function triggerEffects(effects) {
    effects && Array.from(effects).forEach((effect2) => {
      if (effect2 !== activeEffect) {
        if (effect2.scheduler) {
          effect2.scheduler();
        } else {
          effect2.run();
        }
      }
    });
  }

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isFunction = (value) => {
    return typeof value === "function" && value != null;
  };

  // packages/reactivity/src/baseHandler.ts
  var baseHandler = {
    get(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      } else {
        track(target, key);
        let res = Reflect.get(target, key, receiver);
        if (isObject(res)) {
          return reactive(res);
        } else {
          return res;
        }
      }
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      if (oldValue != value) {
        let result = Reflect.set(target, key, value, receiver);
        trigger(target, key, value);
        return result;
      }
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    const existing = reactiveMap.get(target);
    if (existing) {
      return existing;
    }
    const proxy = new Proxy(target, baseHandler);
    reactiveMap.set(target, proxy);
    return proxy;
  }
  function isReactive(object) {
    return !!(object && object["__v_isReactive" /* IS_REACTIVE */]);
  }

  // packages/reactivity/src/computed.ts
  var ComputedRefImpl = class {
    constructor(getter, setter) {
      this.getter = getter;
      this.setter = setter;
      this._dirty = true;
      this.deps = /* @__PURE__ */ new Set();
      this._effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerEffects(this.deps);
        }
      });
    }
    get value() {
      trackEffect(this.deps);
      if (this._dirty) {
        this._value = this._effect.run();
        this._dirty = false;
      }
      return this._value;
    }
    set value(newValue) {
      this.setter(newValue);
    }
  };
  function computed(getterOrOptions) {
    let getter;
    let setter;
    let isGetter = isFunction(getterOrOptions);
    const fn = () => console.warn("computed is read only");
    if (isGetter) {
      getter = getterOrOptions;
      setter = () => fn;
    } else {
      getter = getterOrOptions.getter;
      setter = getterOrOptions.setter || fn;
    }
    return new ComputedRefImpl(getter, setter);
  }

  // packages/reactivity/src/watch.ts
  function traverse(value, set = /* @__PURE__ */ new Set()) {
    if (!isObject)
      return value;
    if (set.has(value))
      return;
    set.add(value);
    for (let key in value) {
      traverse(value[key], set);
    }
    return value;
  }
  function watch(source, cb) {
    let getter;
    if (isReactive(source)) {
      getter = () => traverse(source);
    } else if (isFunction(source)) {
      getter = source;
    } else {
      console.warn("source is not an reactive object or a function");
      return;
    }
    let oldValue;
    let waiting = false;
    const job = () => {
      if (!waiting) {
        waiting = true;
        Promise.resolve().then(() => {
          const newValue = effect2.run();
          cb(newValue, oldValue);
          oldValue = newValue;
          waiting = false;
        });
      }
    };
    const effect2 = new ReactiveEffect(getter, job);
    oldValue = effect2.run();
  }

  // packages/reactivity/src/ref.ts
  function toReactive(value) {
    return isObject(value) ? reactive(value) : value;
  }
  var RefImpl = class {
    constructor(value) {
      this.deps = /* @__PURE__ */ new Set();
      this._value = toReactive(value);
      this.rawValue = value;
    }
    get value() {
      trackEffect(this.deps);
      return this._value;
    }
    set value(newVal) {
      if (newVal !== this._value) {
        this._value = toReactive(newVal);
        this.rawValue = newVal;
        triggerEffects(this.deps);
      }
    }
  };
  function ref(val) {
    return new RefImpl(val);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
