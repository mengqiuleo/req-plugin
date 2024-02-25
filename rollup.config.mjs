import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'

import path from 'path'
import { fileURLToPath } from 'url'

const pkg = process.env.TARGET

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const resolve = (p) => {
  return path.resolve(`${__dirname}/packages/${pkg}`, p)
}

const createConfig = (name) => {
  return {
    input: resolve('src/index.js'),
    output:[
      {
        file: resolve(`dist/index.esm.js`),
        format: 'esm'
      },
      {
        file: resolve(`dist/index.cjs.js`),
        format: 'cjs'
      },
      {
        file: resolve(`dist/index.js`),
        format: 'umd',
        name
      }
    ],
    plugins: [
      json(),
      nodeResolve()
    ]
  }
}
export default createConfig(pkg)