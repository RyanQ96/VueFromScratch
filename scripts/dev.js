const args = require('minimist')(process.argv.slice(2)) // minimist interpret parameter
const path = require('path')

const target = args._[0] || 'reactivity'

const format = args.f || 'global'

const entry = path.resolve(__dirname, `../packages/${target}/src/index.ts`)
const pkg = require(path.resolve(__dirname, `../packages/${target}/package.json`))

// iife 自执行函数 const vue = (function() {}) ()  增加一个全局变量
// cjs common js 
// esm es6 module
// umd 过去时 

const outputFormat = format.startsWith('global') 
  ? 'iife' 
  : format.startsWith('cjs') 
    ? 'cjs'
    : 'esm'

const outfile = path.resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

const {build} = require('esbuild')

build({
  entryPoints: [entry], 
  outfile, 
  bundle: true, 
  sourcemap: true, // what is sourcemap
  globalName: pkg.buildOptions?.name, 
  platform: format === 'cjs' ? 'node': 'browser', 
  watch: { // 监控文件变化
    onRebuild(error) {
      if (!error) console.log('rebuilt~~~')
    }
  }
}).then(() => {
  console.log('watching')
})
