import { ImagePreview } from '../core/image-preview'

export class Rotate{
    async handleRotateLeft(this: ImagePreview,e: TouchEvent & MouseEvent ) :Promise<any>{
        if(this.isAnimating) return;
        if( this.actionExecutor.isLoadingError() ){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        let changeDeg = -1 * Math.PI / 2;
        this.isAnimating = true;
        await this.actionExecutor.rotateZ(changeDeg)
        this.isAnimating = false;

    }
    async handleRotateRight(this: ImagePreview,e: TouchEvent & MouseEvent ) :Promise<any>{
        if(this.isAnimating) return;
        if( this.actionExecutor.isLoadingError() ){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        let changeDeg = 1 * Math.PI / 2;
        this.isAnimating = true;
        await this.actionExecutor.rotateZ(changeDeg);
        this.isAnimating = false;
    }
    handleRotate(this: ImagePreview,e: TouchEvent & MouseEvent,changeDeg:number){
        
    }
    
}