import { isArray, isString } from "@vue/shared"

export function isVNode(vnode) {
    return !!vnode.__v_isVNode
}

export const Text = Symbol('Text') 

export function createVNode(type, props = null, children = null) {

    // 后续判断有不用类型的虚拟节点
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0 

    // 将当前的虚拟节点 和 自己儿子的虚拟节点映射起来
    const vNode = { // vNode要对应真实节点
        __v_isVNode: true, // indicate its a vNode
        type, 
        props, 
        children, 
        key: props && props.key, // indicate its uniqueness
        el: null, // indicate its corresponding real node
        shapeFlag, 
    }    

    if (children) {
        let temp = 0; 
        if (isArray(children)) { // 走到createVNode它要么是数组, 要么是字符串
            temp = ShapeFlags.ARRAY_CHILDREN 
        } else {
            children = String(children)
            temp = ShapeFlags.TEXT_CHILDREN
        }
        vNode.shapeFlag |= temp 
    }


    // shapeFlag 我想要知道这个虚拟节点的儿子是数组, 元素, 还是文本
    return vNode
}


export const enum ShapeFlags {
    ELEMENT = 1, // 1 << 0 
    FUNCTIONAL_COMPONENT = 1 << 1, // 1 << 1 
    STATEFUL_COMPONENT = 1 << 2, // 1 << 2 
    TEXT_CHILDREN = 1 << 3, // 1 << 3 
    ARRAY_CHILDREN = 1 << 4, // 1 << 4 
    SLOTS_CHILDREN = 1 << 5, // 1 << 5 
    TELEPORT = 1 << 6, 
    SUSPENSE = 1 << 7, 
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, 
    COMPONENT_KEPT_ALIVE = 1 << 9, 
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
// 权限组合