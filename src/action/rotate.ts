import { ImagePreview } from '../core/image-preview'

export class Rotate{
    async handleRotateLeft(this: ImagePreview,e: TouchEvent & MouseEvent ) :Promise<any>{
        if(this.isAnimating) return;
        let changeDeg = -1 * Math.PI / 2;
        this.isAnimating = true;
        await this.actionExecutor.rotateZ(changeDeg)
        this.isAnimating = false;

    }
    async handleRotateRight(this: ImagePreview,e: TouchEvent & MouseEvent ) :Promise<any>{
        if(this.isAnimating) return;

        let changeDeg = 1 * Math.PI / 2;
        this.isAnimating = true;
        await this.actionExecutor.rotateZ(changeDeg);
        this.isAnimating = false;
    }
    handleRotate(this: ImagePreview,e: TouchEvent & MouseEvent,changeDeg:number){
        
    }
    
}