import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript2'
import banner from 'rollup-plugin-banner'

const extensions = ['.js', '.ts']

const bannerContent = `
<%= pkg.name %> v<%= pkg.version %> base on vue1.0
release at ${new Date().toLocaleDateString()}
by <%= pkg.author %>
gitlab http://git.augmentum.com.cn/knight.chen/oauth
`.trim()

export default {
  input: 'src/gate.ts',
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'Gate',
    compact: true
  },
  plugins: [
    typescript(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: ["@babel/preset-env"],
      extensions,
      plugins: ["@babel/plugin-proposal-class-properties"]
    }),
    uglify(),
    banner(bannerContent)
  ]
}
