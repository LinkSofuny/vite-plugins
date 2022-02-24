<div align=center>
 <h1>vite-plugin-path-resolve</h1>
</div>

这个plugin主要是解决 vue2 + webpack 迁移至 vite 中的路径问题.

```js
case1: src/demo1/index.vue
case2: src/demo2/index.js
case3: src/demo3.vue
```
这在webpack是没问题的, 但是vite的话就会报错. 因为这个路径找不到对应文件
## Resolve
```js
// ❌ in vite ,👌 in webpack
import demo1 from 'src/demo1'
import demo2 from 'src/demo2'
import demo3 from 'src/demo3'
```
**to**
```js
// 🙆
import demo1 from 'src/demo1/index.vue'
import demo2 from 'src/demo2/index.js'
import demo3 from 'src/demo3.vue'
```
## Usage
```js
$ npm i vite-plugin-path-resolve -D
```
```js
// vite.config.js
import pathResolve from 'vite-plugin-path-resolve'
function getPath(dir) {
    return path.resolve(path.dirname(fileURLToPath(import.meta.url)), dir)
}

export default defineConfig({
    plugins: [
        pathResolve({ src: getPath('src') }),
    ]
})
```

### 参数介绍
|Name|Description|Default
|---|---|---|
|`Object`|`required` 需要处理的**绝对路径**对象集合|null|
- 传入这个对象, 这个plugin将会只处理这个路径集合下的文件

- **请务必注意**要绝对路径