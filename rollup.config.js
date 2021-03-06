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
    filesize(),
    mjs()
  ]
}

/**
 * Tiny plugin to generate .mjs wrappers for each entry point.
 */
function mjs() {
  return {
    name: 'rollup-plugin-mjs',
    generateBundle(options, bundle) {
      if (options.format !== 'cjs') return
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName]
        if (chunk.type !== 'chunk' || !chunk.isEntry) continue
        const names = chunk.exports.join(',\n  ')
        this.emitFile({
          type: 'asset',
          fileName: fileName.replace(/\.js$/, '') + '.mjs',
          source: `import cjs from './${fileName}';\n\nexport const {\n  ${names}\n} = cjs;\n`
        })
      }
    }
  }
}
