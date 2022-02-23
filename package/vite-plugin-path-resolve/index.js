import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

function joinFolderPath(unverifyPath, childFile = 'index.js') {
    const getFile = path.resolve(unverifyPath, childFile)
    try {
        // 尝试 js
        fs.statSync(getFile)
        return getFile
    } catch (error) {
        // 尝试 vue
        if (childFile === 'index.vue') return
        return joinFolderPath(unverifyPath, 'index.vue')
    }
}
// .vue .js .tsx .jsx
function joinFilePath(filePath, ext = '.vue') {
    try {
        // .vue 文件无法被vite自动解析
        fs.statSync(filePath + ext)
        return filePath + ext
    } catch (error) {
        return filePath
    }
}
function recurseTry(unverifyPath) {
    try {
        // 这里应该对凭借出来的第一个路径进行解析, 查看是文件夹,还是文件
        // 如果不存在这个位置会抛错
        const status = fs.statSync(unverifyPath)
        if (status.isDirectory()) {
            return joinFolderPath(unverifyPath)
        } else if (status.isFile()) {
            return unverifyPath
        }
    } catch (error) {
        const extArr = ['.vue', '.js', '.jsx', '.ts', '.tsx']
        const isFile = extArr.filter((ext) => unverifyPath.indexOf(ext) > 1)
        if (isFile.length > 0) throw error
        return joinFilePath(unverifyPath)
    }
}

export default function localResolve(alias = {}) {
    const aliasArray = Object.keys(alias)
    return {
        name: 'alias-defualt',
        resolveId(source, importer) {
            // 是否为 参数下的文件
            const localAlias = aliasArray.filter((k) => source.indexOf(k) > -1)[0]
            // 是否为 相对路径
            const isRelative = source.indexOf('./') > -1
            if (!localAlias && !isRelative) {
                return
            }
            if (!importer) {
                return
            }
            const basename = path.basename(importer)
            let directory = importer.split(basename)[0]
            // @todo 绝对路径
            if (!isRelative) {
                directory = alias[localAlias].replace(localAlias, '')
            }
            // 到这里解决第一个case 也就是文件在当前路径文件夹下, 拿到文件夹下的绝对路径
            const unverifyPath = path.resolve(directory, source)
            const aimPath = recurseTry(unverifyPath)
            return aimPath
        },
    }
}
