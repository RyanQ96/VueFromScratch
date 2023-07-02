import { patchClass } from "./modules/patchClass";
import { patchEvent } from "./modules/patchEvent";
import { patchStyle } from "./modules/patchStyle";
import { patchAttr } from "./modules/patchAttr";


export const patchProp = (el, key, preValue, nextValue) => { // need to compare preValue and nextValue
    if (key === 'class') {
        patchClass(el, nextValue)
    }
    else if (key === 'style') {
        patchStyle(el, preValue, nextValue)
    }
    else if (/on[^a-z]/.test(key)){
        patchEvent(el, key, nextValue) 
    } 
    else {
        patchAttr(el, key, nextValue)
    }
}