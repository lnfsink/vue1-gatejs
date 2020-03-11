import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'

const extensions = ['.js', '.ts']

export default {
  input: 'src/gate.ts',
  output: [{
    file: pkg.main,
    format: 'umd',
    name: 'Gate',
    compact: true
  }, {
    file: pkg.module,
    format: 'esm',
    compact: false,
    esModule: true
  }],
  plugins: [
    typescript(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: ["@babel/preset-env"],
      extensions,
      plugins: ["@babel/plugin-proposal-class-properties"]
    })
  ]
}
