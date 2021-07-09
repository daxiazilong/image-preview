import { ImagePreview } from '../core/image-preview'

export class Matrix{
    matrixMultipy(a,b,...res){
        let r = a.length;
        let col = a[0].length;
        let result = [];
        for( let i = 0; i < r; i++ ){
            let row = a[i];
            result[i] = [];
            for( let j = 0; j < r; j++){
                let count = 0;
                for( let x = 0;x < col; x++ ){
                    let item1 = row[x];
                    let item2 = b[x][j]
                    count += (item1*item2)
                }
                result[i].push(count)
            }
        }
        if(res.length){
            return this.matrixMultipy(result,res.splice(0,1)[0],...res)
        }
        return result;
    }
    matrixTostr(arr:Array<Array<number>>){
        let ans = '';
        const lastIndex = arr.length - 1;
        arr.forEach( (item,index) => {
            item.forEach((item,innerIndex) => {
                ans += ( item + (index == innerIndex && index == lastIndex ? '' : ',') ) 
            })
        })
        return `matrix3d(${ans})`
    }
    getTranslateMatrix({x,y,z}){
        return [
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [x,y,z,1],
        ]
    }
    getRotateZMatrix(deg:number){
        return [
            [Math.cos(deg) , Math.sin(deg),0,0],
            [-Math.sin(deg), Math.cos(deg),0,0],
            [      0,          0,          1,0],
            [      0,          0,          0,1],
        ]
    }
    getScaleMatrix({x,y,z}){
        return [
            [x,0,0,0],
            [0,y,0,0],
            [0,0,z,0],
            [0,0,0,1],
        ]
    }

}