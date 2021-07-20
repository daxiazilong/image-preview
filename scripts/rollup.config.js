
import { terser } from 'rollup-plugin-terser'

const plugins = [];
const isMini = process.argv.some( item => item === '--compact')
if(isMini ){
  plugins.push(terser())
}
export default {
    input: '../release/source/core/image-preview.js',
    output: {
      file: 'release/image-preview-umd.js',
      format: 'umd',
      name:'imagePreviewModule'
    },
    plugins,
  };