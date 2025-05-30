import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import flowEntry from 'rollup-plugin-flow-entry'

import packageJson from './package.json'

const extensions = ['.ts']
const babelOpts = {
  babelHelpers: 'bundled',
  babelrc: false,
  extensions,
  include: ['src/**/*'],
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['transform-regenerator'],
        loose: true
      }
    ],
    '@babel/typescript'
  ]
}
const resolveOpts = { extensions }

export default {
  input: 'src/index.ts',
  output: [
    { file: packageJson.main, format: 'cjs', sourcemap: true },
    { file: packageJson.module, format: 'esm', sourcemap: true }
  ],
  plugins: [
    resolve(resolveOpts),
    babel(babelOpts),
    flowEntry({ types: 'src/index.flow.js' }),
    filesize()
  ]
}
