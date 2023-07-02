import { isArray, isObject } from "@vue/shared";
import { createVNode, isVNode } from "./createVNode";
// h function will call createVNode
// 1) element, content
// 2) element, props, content
// 3) element, props, children
// 4) element, children


// createVNode 后续还有优化, 可以标记处哪些节点是静态的
export function h(type, propsOrChildren, children) {
    // check the length of arguments to match mode 
    const l = arguments.length;
    if (l === 2) {
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) { // 对象, 数组(肯定是children), props
            // 元素对象 or props
            if (isVNode(propsOrChildren)) {
                return createVNode(type, null, [propsOrChildren])
            } else {
                return createVNode(type, propsOrChildren, null)
            }
        } else {
            // propsOrChilden would be eight children or text child
            return createVNode(type, null, propsOrChildren)
        }
    } else if (l === 3) {
        if (isVNode(children)) {
            return createVNode(type, propsOrChildren, [children])
        } else {
            return createVNode(type, propsOrChildren, children)
        } 
    } else {
        children = Array.from(arguments).slice(2)
        return createVNode(type, propsOrChildren, children)
    }
}