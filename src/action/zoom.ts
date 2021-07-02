/**
 * zoom action
 */
import { ImagePreview } from '../ts/image-preview'
import { showDebugger } from '../tools/index';

export class Zoom {
    [key: string]: any;
    setToNaturalImgSize(this: ImagePreview,
        toWidth: number, toHeight: number,
        scaleX: number, scaleY: number,
        e: TouchEvent & MouseEvent
    ): void {
        /**
         * 踩坑记
         * transform-origin 的参考点始终时对其初始位置来说的
         * scale之后的元素, 实际的偏移路径等于 translate 的位移等于 位移 * scale
         */
        let mouseX: number = e.touches[0].clientX;
        let mouseY: number = e.touches[0].clientY;

        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;

        // 以下为旋转之后缩放时需要用到的参数
        const curItemRect = curItem.getBoundingClientRect();
        const curItemViewTop: number = curItemRect.top;//当前元素距离视口的top
        const curItemViewLeft: number = curItemRect.left;//当前元素距离视口的left

        const centerX: number = (curItemRect.width) / 2 + curItemViewLeft;
        const centerY: number = (curItemRect.height) / 2 + curItemViewTop;

        let x = 0, y = 0;
        x = -((mouseX - centerX) * (scaleX - 1));
        y = -((mouseY - centerY) * (scaleY - 1));

        if (toWidth == this.containerWidth) {
            x = 0
        }
        curItem.matrix = this.matrixMultipy(
            this.getScaleMatrix({ x: scaleX, y: scaleY, z: 1 }),
            curItem.matrix,
            this.getTranslateMatrix({ x, y, z: 1 })
        )
        this.animate({
            el: curItem,
            prop:'transform',
            endStr: `${this.matrixTostr(curItem.matrix)}`,
            callback: () => {
                curItem.dataset.isEnlargement = 'enlargement';
                this.isAnimating = false;
            }
        })
        
    }
    setToInitialSize(this: ImagePreview, scaleX: number, scaleY: number, e: TouchEvent & MouseEvent) {
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;
        let rotateDeg: number = curItem.rotateDeg;;
        curItem.matrix = this.matrixMultipy(
            this.getRotateZMatrix(rotateDeg * Math.PI / 180),
            curItem.intialMatrix
        )
        this.animate({
            el: curItem,
            endStr:  `${this.matrixTostr(curItem.matrix)}`,
            prop:'transform',
            callback:() => {
                curItem.dataset.isEnlargement = 'shrink';
                this.isAnimating = false;
            }
        })
    }

    handleZoom(this: ImagePreview, e: TouchEvent & MouseEvent): void {
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

        // if (curItem.dataset.loaded == 'false') {
        //     // 除了切屏之外对于加载错误的图片一律禁止其他操作
        //     this.isAnimating = false;
        //     return;
        // }

        const { actionExecutor } = this;
        const curItemRect = actionExecutor.viewRect;
        const curItemWidth: number = curItemRect.width;
        const curItemHeihgt: number = curItemRect.height;

        const distaceBefore: number =
            Math.sqrt(Math.pow(this.curPoint1.x - this.curPoint2.x, 2) + Math.pow(this.curPoint1.y - this.curPoint2.y, 2));

        const distanceNow: number =
            Math.sqrt(Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));

        let top: number = curItemRect.top;
        let left: number = curItemRect.left;

        const centerFingerX: number = (this.curStartPoint1.x + this.curStartPoint2.x) / 2;
        const centerFingerY: number = (this.curStartPoint1.y + this.curStartPoint2.y) / 2;
        const centerImgCenterX = curItemWidth / 2 + left;
        const centerImgCenterY = curItemHeihgt / 2 + top;


        this.curPoint1.x = e.touches[0].clientX;
        this.curPoint1.y = e.touches[0].clientY;
        this.curPoint2.x = e.touches[1].clientX;
        this.curPoint2.y = e.touches[1].clientY;

        let x = 0,y = 0,sx = 1.0,sy = 1.0;
     
        if (distaceBefore > distanceNow) {//缩小 retu

            y = ((this.zoomScale) * (centerFingerY - centerImgCenterY));
            x = ((this.zoomScale) * (centerFingerX - centerImgCenterX));

            sx = 1 - this.zoomScale
            sy = 1 - this.zoomScale;
            
        } else if (distaceBefore < distanceNow) {//放大
            // biggest width for zoom in
            let maxWidth = this.containerWidth * 4;
            if (curItemWidth * (1 + this.zoomScale) > maxWidth) {
                this.isAnimating = false;
                return;
            }
            y = -((this.zoomScale) * (centerFingerY - centerImgCenterY));
            x = -((this.zoomScale) * (centerFingerX - centerImgCenterX));
            sx = 1 + this.zoomScale
            sy = 1 + this.zoomScale;
        }
        showDebugger(`
            x:${x}
            y:${y}
            sx:${sx}
            sy:${sy}
            curItemWidth:${curItemWidth}
            curItemHeihgt:${curItemHeihgt}
        `)
        actionExecutor.eventsHanlder.handleZoom(e,sx,sy,x,y)


        this.isAnimating = false;
    }
}