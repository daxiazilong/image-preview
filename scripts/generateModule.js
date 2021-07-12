const childProcess = require('child_process')
const path = require('path');
let moduler = ['amd','cjs','esm','umd','iife']

const releasePath = path.resolve(__dirname,'../release/image-preview')
try{
    function compile(index){
        let mod = moduler[index];
        let filename = `${releasePath}\\image-preview-${mod}.js`;
        childProcess.exec(`..\\node_modules\\.bin\\rollup -c -f ${mod} -o ${filename}`,(err,stdout)=>{
            console.log(stdout)
            if(err){
                console.log(err)
                console.log('编译失败')
                return;
            }
            console.log(` ${filename} 编译成功`)
            if( index + 1 < moduler.length){
                compile(index+1)
            }else{
                console.log('全部编译成功')
            }
        })
    }
    

}catch(ex){
    console.log(ex)
    console.log('编译失败')
}

let index = 0;
compile(index)
