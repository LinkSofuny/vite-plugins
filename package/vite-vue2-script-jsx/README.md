<div align=center>
 <h1>vite-vue2-script-jsx</h1>
</div>

**请注意这是一个脚本, 不是vite的插件**, 这个脚本用于解决在`Vue2` + `Webpack`的项目迁移至`Vite`的时候, `Vite`无法识别JSX语法的场景.

具体抛错信息如下: 
> [Vite] The JSX syntax extension is not currently enabled

![error.png](https://github.com/LinkSofuny/vite-plugins/blob/master/package/images/error.png)

目前该抛错一下的解决办法: 
1. vite配置文件加上该plugin(对我无用)
```js
vite.config.js => plugins: [createVuePlugin({ jsx: true })]
```
2. 如果是在`js`文件中带有j`sx`语法, 则将改为`.jsx`扩展名文件
```js
.js(has jsx) => .jsx
```
3. 如果是在`.vue`文件中带有jsx语法, 则在`script`标签下增加该标识
```js
.vue(has jsx) => <script lang="jsx">
```

 如果你的文件特别少的话就可以手动通过上述更改解决, 无需下载本脚本. 如果你需要更改的文件同我一样, 有成百上千个, 那本脚本就可以帮你自动添加了.


# resolve

```js
<script>
export default {
    methods: {
        demo() {
            return (
                <div>test</div>
            )
        }
    }
}
</script>
```

**to**

```js
<script lang="jsx">
export default {
    methods: {
        demo() {
            return (
                <div>test</div>
            )
        }
    }
}
</script>
```
# Usage
 本脚本将一次性为带有jsx语法, 并以`.vue`解决的文件中的script标签自动加上 `lang="jsx"`

```js
$ npm i vite-vue2-script-jsx
```
在你项目的入口文件内, 引入该脚本, 并给它传入你需要处理的文件夹**绝对路径**
```js
// index.js
import vue2JSX from 'vite-vue2-script-jsx'
import { fileURLToPath } from 'url'
import path from 'path'
// 拿到当前文件的文件夹
const absolutePath = fileURLToPath(import.meta.url)
const basename = path.basename(absolutePath)
const aimPath = absolutePath.replace(`/${basename}`, '')
const aimFolder = aimPath + '/example'

vue2JSX({
    basePath: aimFolder, 
    includes: ['view', 'components']
})
```
## 参数介绍
|Name|Description|Default
|---|---|---|
|basePath|`required` `string`需要处理的文件夹绝对路径|null|
|includes| `array` 只处理该文件夹内的哪些文件夹|[]|

因为src文件夹下可能有很多无须处理的文件夹, 所以传入第二个参数, 可以提高效率.

**请注意这个插件将会实际的变更你的文件, 所以最好清空一下工作区, 方便看到执行后被变更的文件**
