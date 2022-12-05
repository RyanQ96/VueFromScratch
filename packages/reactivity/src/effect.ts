export function effect(fn) {
  // convert fn -> reactive fn 
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export class ReactiveEffect {
  public active = true
  constructor(public fn) { // 你传递的fn, 我帮你绑定到this上
  }
  run() {
    this.fn()
  }
} 