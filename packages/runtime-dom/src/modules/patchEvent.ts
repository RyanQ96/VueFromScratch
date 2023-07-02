// click fn1 => fn2 
// Way 1. unbound fn1 and bound fn2? -> low efficiency
// Way 2. bound a function that can call fn1() or fn2() 
export function patchEvent(el, eventName, nextValue) {
    // vue bind ._vei to el to indicate that el has event listener
    const invokers = el._vei || (el._vei = {})
    const eName = eventName.slice(2).toLowerCase()
    const existingInvoker = invokers[eventName]
    if (existingInvoker && nextValue) {
        existingInvoker.value = nextValue
    } else {
        if (nextValue) {
            // for the first time
            const invoker = createInvoker(nextValue)
            invokers[eventName] = invoker
            el.addEventListener(eName, invoker)
        } else if (existingInvoker) {
            // 没有nextValue，说明要移除事件
            el.removeEventListener(eName, existingInvoker)
            invokers[eventName] = null
        }
    }
}


function createInvoker(preValue) {
    const invoker = (e) => {
        invoker.value(e)
    }
    invoker.value = preValue // later on, we just need to change value's reference
    return invoker
}

