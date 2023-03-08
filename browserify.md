# 在浏览器里可以运行

这个库不能正常在浏览器中工作，所以需要打下包。分别用rollup 和 esbuild来打包。

不管是rollup 还是 esbuild，都需要对tsc编译出来的代码做一些处理。

1. 确保tsconfig.json中module是ES6而不是CommonJS

2. 对tsc编译出来的代码做一些简单的替换处理

详见代码：

```js
//build/browserify.js

function replaceCode(code) {
  return code.replace('import * as XRegExp from "xregexp";', '')
             .replace("import * as XRegExp from 'xregexp';", '')
             .replace("import { Enum, EnumValue } from 'ts-enums';", 
             "import { Enum, EnumValue } from '../node_modules/ts-enums/dist/ts-enums.es5';")
}

function exportTransposeMethodToWindow(f, code) {
  if(!f.endsWith('index.js')) {
    return code
  }
  if(code.indexOf("window.transpose = (text) => new Transposer(text);") > -1) {
    return code;
  }
  return code + "\n" + "window.transpose = (text) => new Transposer(text);";
}

// 简单讲就是把外部依赖，不能编译到代码里的，就做成外部依赖；能编译进去的就直接编译到代码里。
// 比如ts-enums，库比较小，可以编译到代码里，那就import时用绝对路径，而不是路径查找。这样可以编译到最终代码里。
// xregexp本身比较大，自己又可以在浏览器里用。所以直接把相关的import给删掉。
```

## esbuild

```bash
.\node_modules\.bin\esbuild .\dist\index.js --bundle --outfile=dist\esbuild-bundle.js
或
npm run esbuild
```

esbuild非定快，也不需要写配置文件，只是需要很清楚自己在干啥。编译出来的代码不用放到 script type=module标签里。就像用普通代码一样。

## rollup

```bash
rollup -c --bundleConfigAsCjs
或
npm run rollup
```

## browserify

自己写的esbuild和rollup相关脚本就时为了browserify。
而`browserify.js`感觉不是趋势，文档读起来很费劲，所以不花费时间去研究了。
