const fs = require('fs');
const version = process.env.npm_package_version;

let source = fs.readFileSync('./src/ts/image-preview.ts',{encoding:'utf-8'});

let versionReg = /(?<=\* image-preview \[)(\S+?)(?=\])/g;

source = source.replace(versionReg,version);

fs.writeFileSync('./src/ts/image-preview.ts',source)
console.log('source-code generate success!');

let exportReg = /export /g
source = source.replace(exportReg,'');
fs.writeFileSync('./src/ts/image-preview-prd.ts',source);

console.log('prd-source generate success!')

