export const nodeOps = {
    createElement(tagName) {
        return document.createElement(tagName);
    }, 
    createTextNode(text) {
        return document.createTextNode(text); 
    }, 
    insert(child, container, anchor = null) {
        return container.insertBefore(child, anchor); // if anchor = null, insertBefore behaves like appendChild
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
    setText(node, text) { // 给文本节点设置内容
        node.nodeValue = text;
    }, 
    setElementText(element, text) { // 给元素节点设置内容
        element.textContent = text;
    }
}


// createElementNode 
// createTestElement 
// insert, delete, modify, replace ElementNode 
// search parent, children 
// We will use these ops to render element in a webpage