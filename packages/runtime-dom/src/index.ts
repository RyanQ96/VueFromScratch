import { nodeOps } from './nodeOps'
import { patchProp } from "./patchProp";
import { createRenderer } from '@vue/runtime-core'

export * from '@vue/runtime-core'

export const renderOptions = {
    ...nodeOps,
    patchProp
};

export function render(vnode, container) {
    let { render } = createRenderer(renderOptions)
    render(vnode, container)
}
