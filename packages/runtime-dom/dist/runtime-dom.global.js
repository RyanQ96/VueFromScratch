var VueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b ||= {})
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    computed: () => computed,
    createRenderer: () => createRenderer,
    createVNode: () => createVNode,
    effect: () => effect,
    h: () => h,
    reactive: () => reactive,
    ref: () => ref,
    render: () => render,
    renderOptions: () => renderOptions,
    watch: () => watch
  });

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createTextNode(text) {
      return document.createTextNode(text);
    },
    insert(child, container, anchor = null) {
      return container.insertBefore(child, anchor);
    },
    remove(child) {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    querySelector(selector) {
      return document.querySelector(selector);
    },
    parentNode(child) {
      return child.parentNode;
    },
    nextSibling(child) {
      return child.nextSibling;
    },
    setText(node, text) {
      node.nodeValue = text;
    },
    setElementText(element, text) {
      element.textContent = text;
    }
  };

  // packages/runtime-dom/src/modules/patchClass.ts
  function patchClass(el, nextValue) {
    if (nextValue == null) {
      el.removeAttribute("class");
    } else {
      el.className = nextValue;
    }
  }

  // packages/runtime-dom/src/modules/patchEvent.ts
  function patchEvent(el, eventName, nextValue) {
    const invokers = el._vei || (el._vei = {});
    const eName = eventName.slice(2).toLowerCase();
    const existingInvoker = invokers[eventName];
    if (existingInvoker && nextValue) {
      existingInvoker.value = nextValue;
    } else {
      if (nextValue) {
        const invoker = createInvoker(nextValue);
        invokers[eventName] = invoker;
        el.addEventListener(eName, invoker);
      } else if (existingInvoker) {
        el.removeEventListener(eName, existingInvoker);
        invokers[eventName] = null;
      }
    }
  }
  function createInvoker(preValue) {
    const invoker = (e) => {
      invoker.value(e);
    };
    invoker.value = preValue;
    return invoker;
  }

  // packages/runtime-dom/src/modules/patchStyle.ts
  function patchStyle(el, preValue, nextValue) {
    const style = el.style;
    for (let key in nextValue) {
      style[key] = nextValue[key];
    }
    if (preValue) {
      for (let key in preValue) {
        if (nextValue[key] == null) {
          style[key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/modules/patchAttr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue == null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }

  // packages/runtime-dom/src/patchProp.ts
  var patchProp = (el, key, preValue, nextValue) => {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  };

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isFunction = (value) => {
    return typeof value === "function" && value != null;
  };
  var isArray = (value) => {
    return value != null && Array.isArray(value);
  };
  var isString = (value) => {
    return typeof value === "string";
  };
  var isNumber = (value) => {
    return typeof value === "number";
  };

  // packages/runtime-core/src/createVNode.ts
  function isVNode(vnode) {
    return !!vnode.__v_isVNode;
  }
  var Text = Symbol("Text");
  function createVNode(type, props = null, children = null) {
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
    const vNode = {
      __v_isVNode: true,
      type,
      props,
      children,
      key: props && props.key,
      el: null,
      shapeFlag
    };
    if (children) {
      let temp = 0;
      if (isArray(children)) {
        temp = ShapeFlags.ARRAY_CHILDREN;
      } else {
        children = String(children);
        temp = ShapeFlags.TEXT_CHILDREN;
      }
      vNode.shapeFlag |= temp;
    }
    return vNode;
  }
  var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
    ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags2[ShapeFlags2["FUNCTIONAL_COMPONENT"] = 2] = "FUNCTIONAL_COMPONENT";
    ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 4] = "STATEFUL_COMPONENT";
    ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 8] = "TEXT_CHILDREN";
    ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 16] = "ARRAY_CHILDREN";
    ShapeFlags2[ShapeFlags2["SLOTS_CHILDREN"] = 32] = "SLOTS_CHILDREN";
    ShapeFlags2[ShapeFlags2["TELEPORT"] = 64] = "TELEPORT";
    ShapeFlags2[ShapeFlags2["SUSPENSE"] = 128] = "SUSPENSE";
    ShapeFlags2[ShapeFlags2["COMPONENT_SHOULD_KEEP_ALIVE"] = 256] = "COMPONENT_SHOULD_KEEP_ALIVE";
    ShapeFlags2[ShapeFlags2["COMPONENT_KEPT_ALIVE"] = 512] = "COMPONENT_KEPT_ALIVE";
    ShapeFlags2[ShapeFlags2["COMPONENT"] = 6] = "COMPONENT";
    return ShapeFlags2;
  })(ShapeFlags || {});

  // packages/runtime-core/src/h.ts
  function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l === 2) {
      if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        } else {
          return createVNode(type, propsOrChildren, null);
        }
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else if (l === 3) {
      if (isVNode(children)) {
        return createVNode(type, propsOrChildren, [children]);
      } else {
        return createVNode(type, propsOrChildren, children);
      }
    } else {
      children = Array.from(arguments).slice(2);
      return createVNode(type, propsOrChildren, children);
    }
  }

  // packages/runtime-core/src/createRenderer.ts
  function createRenderer(options) {
    console.log(options);
    let {
      createElement: hostCreateElement,
      createTextNode: hostCreateTextNode,
      insert: hostInsert,
      remove: hostRemove,
      querySelector: hostQuerySelector,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setText: hostSetText,
      setElementText: hostSetElementText,
      patchProp: hostPatchProp
    } = options;
    function normalize(children, i) {
      if (isString(children[i]) || isNumber(children[i])) {
        children[i] = createVNode(Text, null, children[i]);
      }
      return children[i];
    }
    function mountChildren(el, children) {
      for (let i = 0; i < children.length; i++) {
        let child = normalize(children, i);
        patch(null, child, el);
      }
    }
    function mountElement(vnode, container) {
      let {
        type,
        props,
        children,
        shapeFlag
      } = vnode;
      let el = vnode.el = hostCreateElement(type);
      if (shapeFlag & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      } else if (shapeFlag * 16 /* ARRAY_CHILDREN */) {
        mountChildren(el, children);
      }
      hostInsert(el, container);
    }
    function processText(prevVNode, nextVNode, container) {
      if (prevVNode == null) {
        let el = nextVNode.el = hostCreateTextNode(nextVNode.children);
        hostInsert(el, container);
      } else {
      }
    }
    function processElement(prevVNode, nextVNode, container) {
      if (prevVNode == null) {
        mountElement(nextVNode, container);
      } else {
      }
    }
    function patch(prevVNode, nextVNode, container) {
      const { type, shapeFlag } = nextVNode;
      switch (type) {
        case Text:
          processText(prevVNode, nextVNode, container);
          break;
        default:
          if (shapeFlag & 1 /* ELEMENT */) {
            processElement(prevVNode, nextVNode, container);
          }
      }
    }
    function render2(vnode, container) {
      if (vnode == null) {
      } else {
        patch(container._vnode || null, vnode, container);
      }
      container._vnode = vnode;
      console.log(vnode, container);
    }
    return {
      render: render2
    };
  }

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

  // packages/runtime-dom/src/index.ts
  var renderOptions = __spreadProps(__spreadValues({}, nodeOps), {
    patchProp
  });
  function render(vnode, container) {
    let { render: render2 } = createRenderer(renderOptions);
    render2(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
