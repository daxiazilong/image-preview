/**
 * zoom action
 */
import { ImagePreview } from '../core/image-preview'
import { showDebugger } from '../tools/index';

export class Zoom {
    handleZoom(this: ImagePreview, e: TouchEvent & MouseEvent): void {
        if( this.isNormalMove && this.normalMoved ){
            return;
        }
        if( this.isAnimating ){
            return;
        }
        if( this.actionExecutor.isLoadingError() ){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        if (!this.isZooming) {
            this.curStartPoint1 = {
                x: this.curPoint1.x,
                y: this.curPoint1.y
            }
            this.curStartPoint2 = {
                x: this.curPoint2.x,
                y: this.curPoint2.y
            }
        }
        this.isZooming = true;
        this.isAnimating = true;
        
        const { actionExecutor } = this;

        const distaceBefore: number =
            (Math.pow(this.curPoint1.x - this.curPoint2.x, 2) + Math.pow(this.curPoint1.y - this.curPoint2.y, 2));

        const distanceNow: number =
            (Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));

        const centerFingerX = (this.curStartPoint1.x + this.curStartPoint2.x) / 2 ;
        const centerFingerY = (this.curStartPoint1.y + this.curStartPoint2.y) / 2 ;
        const centerImgCenterX = actionExecutor.viewWidth / (2 * actionExecutor.dpr)
        const centerImgCenterY = actionExecutor.viewHeight / (2 *actionExecutor.dpr)


        this.curPoint1.x = e.touches[0].clientX;
        this.curPoint1.y = e.touches[0].clientY;
        this.curPoint2.x = e.touches[1].clientX;
        this.curPoint2.y = e.touches[1].clientY;

        let x = 0,y = 0,sx = 1.0,sy = 1.0;
     
        if (distaceBefore > distanceNow) {//缩小 retu

            y =  (centerFingerY - centerImgCenterY) * this.zoomScale;
            x =  (centerFingerX - centerImgCenterX) * this.zoomScale;

            sx = 1 - this.zoomScale
            sy = 1 - this.zoomScale;
            
        } else if (distaceBefore < distanceNow) {//放大
            // scaleX = 1 + scaleRatio
            // x*scaleX - x
            // x(scaleX-1) = x * scaleRatio
            y = -((centerFingerY - centerImgCenterY)) * this.zoomScale;
            x = -((centerFingerX - centerImgCenterX)) * this.zoomScale;
            
            sx = 1 + this.zoomScale
            sy = 1 + this.zoomScale;
        }else{
            this.isZooming = false;
            this.isAnimating = false;
            return;
        }
        actionExecutor.eventsHanlder.handleZoom(e,sx,sy,x,y)
        this.isZooming = false;
        this.isAnimating = false;
    }
}