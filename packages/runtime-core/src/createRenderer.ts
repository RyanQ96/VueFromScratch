import { isString, isNumber } from "@vue/shared";
import { ShapeFlags, Text, createVNode } from "./createVNode";

export function createRenderer(options) {
    // options is the user's custom renderer options

    // User can call this function and pass in render options 
    console.log(options)

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
    } = options // destructure the options and rename to indicate that 
    // these are the host's apis, not only for DOM but also for other platforms


    function normalize(children, i) {
        if (isString(children[i]) || isNumber(children[i])) {
            children[i] = createVNode(Text, null, children[i])
        }
        return children[i]
    }

    function mountChildren(el, children) {
        // children could be text, or an array of vnodes
        for (let i = 0; i < children.length; i++) {
            let child = normalize(children, i)
            patch(null, child, el)
        }
    }

    function mountElement(vnode, container) {
        let {
            type,
            props,
            children,
            shapeFlag
        } = vnode; // destructure the vnode to get the type, props, children, and shapeFlag
        // 后续需要对比虚拟节点的差异更新真实节点, 所以需要保留对应的真实节点
        let el = vnode.el = hostCreateElement(type) // create the element node and save it to the vnodekl
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children)
        } else if (shapeFlag * ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(el, children)
        }

        hostInsert(el, container)
    }

    function processText(prevVNode, nextVNode, container) {
        if (prevVNode == null) {
            let el = nextVNode.el = hostCreateTextNode(nextVNode.children) 
            hostInsert(el, container)
        } else {
            // update text node
        }
    }

    function processElement(prevVNode, nextVNode, container) {
        // debugger
        if (prevVNode == null) {
            mountElement(nextVNode, container)
        } else {
            // diff algorithm
        }
    }

    function patch(prevVNode, nextVNode, container) { // patch function is used to update the container's content
        const { type, shapeFlag } = nextVNode;
        switch (type) {
            case Text:
                processText(prevVNode, nextVNode, container)
                break;

            default:
                if (shapeFlag & ShapeFlags.ELEMENT) { 
                    processElement(prevVNode, nextVNode, container)
                }
        }

        // if (prevNode == null) {// No existing node 
        //     // mount element 
        //     mountElement(nextVNode, container)
        // } else {
        //     // diff algorithm 
        // }
    }


    function render(vnode, container) {
        // we need to render vnode into the container by calling the api in options
        if (vnode == null) {
            // 卸载元素 if vnode is null, we will remove the container's content

        } else {
            // 更新 or 初始化
            patch(container._vnode || null, vnode, container)

        }
        // 第一次渲染就将vnode保存到了container上面
        container._vnode = vnode; // store the vnode in container so that we can use it to update the container's content

        console.log(vnode, container)
    }
    return {
        render
    }
} 
