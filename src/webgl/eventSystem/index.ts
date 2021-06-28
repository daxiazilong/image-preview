import { webGl } from "../index";
import { matrix } from "../matrix";

export class events {
    viewInstance: webGl;
    constructor(viewInstance: webGl) {
        this.viewInstance = viewInstance;
    }
    handleSingleStart(e: TouchEvent & MouseEvent) {
        throw new Error('Method not implemented.');
    }
    handleDoubleClick(e: TouchEvent & MouseEvent){
        const { clientX, clientY } = e.touches[0];
        const { viewInstance } = this

        const curImgShape = viewInstance.imgShape[viewInstance.curIndex];
        const [natualWidth,natualHeight] = curImgShape;

        let curPointAt = viewInstance.curPointAt;
       
        const curWidth =  Math.abs(viewInstance.positions[curPointAt + 4] - viewInstance.positions[curPointAt]);
        const curHieght = Math.abs(viewInstance.positions[curPointAt+1] - viewInstance.positions[curPointAt+9]);
        viewInstance.decideScaleRatio(curWidth,curHieght,natualWidth,natualHeight)
        const scaleX = natualWidth  / curWidth - 1;
        const scaleY = natualHeight / curHieght - 1;

        const centerX: number = viewInstance.viewWidth / (2);
        const centerY: number = viewInstance.viewHeight / (2);

        let dx = 0, dy = 0;
        dx = -((clientX * viewInstance.dpr - centerX) * (scaleX ));
        dy = ((clientY * viewInstance.dpr - centerY) * (scaleY));

        viewInstance.scaleZPosition({scaleX,scaleY,dx,dy})

        // console.log(newPoint)
        // console.log(this.imgs)
        // console.log(this.textures)
        // console.log(this.indinces)

    }
    handleMoveEnlage(e: TouchEvent & MouseEvent,x:number,y:number,z:number) {
        const { viewInstance } = this
        x *= viewInstance.dpr;
        y *= -viewInstance.dpr;
        z *= viewInstance.dpr;

        viewInstance.curPlane = viewInstance.positions.slice(viewInstance.curPointAt, viewInstance.curPointAt + 16)
        viewInstance.transformCurplane(
            matrix.translateMatrix(x,y,0)
        )
        viewInstance.bindPostion()
        viewInstance.drawPosition()

    }

    handleMoveNormal(e: TouchEvent & MouseEvent, offset: number) {
        let deg = -offset * 0.01;
        const { viewInstance } = this
        viewInstance.rotatePosition(deg);
        viewInstance.bindPostion();
        viewInstance.drawPosition();
    }
    handleZoom(e: TouchEvent & MouseEvent) {
    }

    async handleTEndEnNormal(e: TouchEvent & MouseEvent, offset: number) {

        let degX = -offset * 0.01;
        let throldDeg = Math.PI * 0.15;
        const plusOrMinus = degX / Math.abs(degX);
        const {viewInstance} = this;
        if (Math.abs(degX) >= throldDeg) {// 左右切换
            let beforeIndex = viewInstance.curIndex;
            let nextIndex = viewInstance.curIndex + (plusOrMinus * 1)
            if (nextIndex == -1 || nextIndex == viewInstance.imgUrls.length) {// 第一张左切换或最后一张右切换时 也是复原
                viewInstance.curIndex = beforeIndex;
                viewInstance.rotate(0 - degX)
            } else {
                let res = await viewInstance.rotate(plusOrMinus * Math.PI / 2 - degX);
                viewInstance.curIndex = nextIndex;
                viewInstance.draw(nextIndex)
            }

        } else {// 复原
            viewInstance.rotate(0 - degX)
        }
    }
    handleTEndEnlarge(e: TouchEvent & MouseEvent,x:number,y:number,z:number){
        const { viewInstance } = this

        x *= viewInstance.dpr;
        y *= -viewInstance.dpr;
        z *= viewInstance.dpr;

        viewInstance.moveCurPlane(x,y,0)

    }
}