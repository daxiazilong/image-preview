import { ImagePreview } from '../ts/image-preview'

export class Rotate{
    handleRotateLeft(this: ImagePreview,e: TouchEvent & MouseEvent ) :void{
        let changeDeg = -1 * Math.PI / 2;
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;
        curItem.rotateDeg -= 90;
        this.handleRotate(e,changeDeg)
    }
    handleRotateRight(this: ImagePreview,e: TouchEvent & MouseEvent ) :void{
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;
        curItem.rotateDeg += 90;
        let changeDeg = 1 * Math.PI / 2;
        this.handleRotate(e,changeDeg)
    }
    handleRotate(this: ImagePreview,e: TouchEvent & MouseEvent,changeDeg:number){
        if( this.isAnimating ){
            return;
        }
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;
        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        this.isAnimating = true;

        this.setTransitionProperty({
            el: curItem,
            time: 0.3,
            timingFunction:'linear'
        })
        curItem.matrix = this.matrixMultipy(this.getRotateZMatrix( changeDeg ),curItem.matrix)
        curItem.style.transform = `${ this.matrixTostr(curItem.matrix) }`;

        let end:string = <string>this.supportTransitionEnd;
        curItem.addEventListener(end,() => {
            this.isAnimating = false;
        },{ once: true })
    }
    
}