const fs = require('fs');
const version = process.env.npm_package_version;

let source = fs.readFileSync('./src/core/image-preview.ts',{encoding:'utf-8'});

let versionReg = /(?<=\* image-preview \[)(\S+?)(?=\])/g;

source = source.replace(versionReg,version);

fs.writeFileSync('./src/ts/image-preview.ts',source)
console.log('source-code generate success!');
console.log('prd-source generate success!')

