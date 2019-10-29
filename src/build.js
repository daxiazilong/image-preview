const fs = require('fs')
const childProcess = require('child_process')

let originName = './ts/image-preview.ts';
let moduler = ['CommonJS','AMD','UMD','ES6']
let curName = ``

try{
    function compile(index){
        let mod = moduler[index];
        let filename = './ts/image-preview.ts';
        if(index){
            filename = `./ts/image-preview-${moduler[index-1]}.ts`
        }
        curName = `./ts/image-preview-${mod}.ts`;
        console.log(`正在编译 ./ts/image-preview-${mod}.ts`)
        fs.renameSync(filename,`./ts/image-preview-${mod}.ts`)
        childProcess.exec(`..\\node_modules\\.bin\\tsc -m ${mod} -t ES5 --outDir ../release/image-preview ./ts/image-preview-${mod}.ts`,(err)=>{
            if(err){
                console.log(err)
                console.log('编译失败')
                fs.renameSync(curName,originName)

                return;
            }
            console.log(` ./ts/image-preview-${mod}.ts 编译成功`)
            if( index + 1 < moduler.length){
                compile(index+1)
            }else{
                fs.renameSync(curName,originName)
                console.log('success')
            }
        })
    }
    

}catch(ex){
    console.log(ex)
    console.log('编译失败')
    fs.renameSync(curName,originName)
}
let index = 0;
compile(index)
