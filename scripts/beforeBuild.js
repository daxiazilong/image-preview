const fs = require('fs');
const path = require('path')
const childProcess = require('child_process')
const version = process.env.npm_package_version;

const imagePreviewSrc = (path.resolve(__dirname,'../src/core/image-preview.ts')  )
//  version generated
let source = fs.readFileSync(imagePreviewSrc,{encoding:'utf-8'});
let versionReg = /(?<=\* image-preview \[)(\S+?)(?=\])/g;
source = source.replace(versionReg,version);

fs.writeFileSync(imagePreviewSrc,source)
console.log('source-code generate success!');
console.log('prd-source generate success!')

// replace shader File by ts
const webglDir = path.resolve(__dirname,'../src/webgl')

const fragSource = fs.readFileSync(`${webglDir}/shaders/fragment-shader.frag`,{encoding:'utf-8'})
const verTexSource = fs.readFileSync(`${webglDir}/shaders/vertext-shader.vert`,{encoding:'utf-8'})

const webglSource = fs.readFileSync(`${webglDir}/index.ts`,{encoding:'utf-8'})
let copiedWebglSource = webglSource;
const replaceReg = /'####'(\s|\S)+'####'/g
copiedWebglSource = copiedWebglSource.replace(replaceReg,`
const sourceFrag = \`${fragSource}\`;
const sourceVer = \`${verTexSource}\`;
`)
fs.writeFileSync(`${webglDir}/index.ts`,copiedWebglSource)

childProcess.exec(`npm run compileTs`,(err)=>{
    // fs.writeFileSync(`${webglDir}/index.ts`,webglSource)
    if(err){
        console.log(err)
        console.log('编译失败')
        return;
    }
    console.log('typescript compile complete!')
})