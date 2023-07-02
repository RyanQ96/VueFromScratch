- npm feature: when install bootstrap -> install animate.css automatically (goast dependencies)

- Packages:
  - runtime-dom: common dom api, set attribs
  - runtime-core: virtual dom, diff algo  
  

- Vue structure:
  - runtime-dom - based on - runtime-core - leverage - reactivity (But this pipeline requires user to write virtual DOM object) 
  - compiler-dom - based on - compiler-core

- Vue 包含两部分:
  - 编译时 (将模版编译成render函数 compiler-dom compiler-core) 返回的依旧是虚拟节点
  - 运行时 (将虚拟节点变成真实节点, 可能是web, 也可能不是 runtime-dom(提供DOM操作, domapi, domapi会传递给runtime-core使用) rumtime-core(虚拟节点) runtime-core基于reactivity 内部用的是响应式原理)
  - 挂载是runtime-core调用runtime-dom, runtime-dom提供对应的方法, runtime-core去生成. 


- vue-loader 是在webpack做的, 用的不多了, 现在多用vite @vite/vue-plugin
  - 
