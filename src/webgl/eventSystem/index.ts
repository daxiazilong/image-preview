import { showDebugger } from "../../tools/index";
import { webGl } from "../index";
import { matrix } from "../matrix";

export class events {
    viewInstance: webGl;
    curBehaviorCanBreak: boolean = false;
    throldDeg: number = Math.PI * 0.15;
    constructor(viewInstance: webGl) {
        this.viewInstance = viewInstance;
    }
    handleSingleStart(e: TouchEvent & MouseEvent) {
        throw new Error('Method not implemented.');
    }
    handleDoubleClick(e: TouchEvent & MouseEvent){

        const { clientX, clientY } = e.touches[0];
        const { viewInstance } = this

        const [scaleX,scaleY,dx,dy] = viewInstance.decideScaleRatio(clientX,clientY)
        return viewInstance.scaleZPosition({scaleX,scaleY,dx,dy})
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
    handleZoom(e: TouchEvent & MouseEvent,sx:number,sy:number,dx:number,dy:number) {
        const { viewInstance } = this;

        let [nw,nh] = viewInstance.imgShape[viewInstance.curIndex]
        let [iW,iH] = viewInstance.imgShapeInitinal[viewInstance.curIndex]

        nw = Math.abs(nw)
        nh = Math.abs(nh)
        iW = Math.abs(iW)
        iH = Math.abs(iH)

        const curItemRect = viewInstance.viewRect;
        const curItemWidth = curItemRect.width * viewInstance.dpr;

         // biggest width for zoom in
         const maxWidth = nw * 4;
         if (curItemWidth * sx > maxWidth) {
             return;
         }

         const minWidth = iW;
         if (curItemWidth * sx < minWidth) {
            return;
        }

        dx *= viewInstance.dpr;
        dy *= -viewInstance.dpr;

        viewInstance.zoomCurPlan(sx,sy,dx,dy)
    }

    async handleTEndEnNormal(e: TouchEvent & MouseEvent, offset: number) {

        let degX = -offset * 0.01;
        const plusOrMinus = degX / Math.abs(degX);
        const {viewInstance} = this;

        if (Math.abs(degX) >= this.throldDeg) {// 左右切换
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
    async handleTEndEnlarge(e: TouchEvent & MouseEvent,x:number,y:number,z:number){;
        const { viewInstance } = this

        x *= viewInstance.dpr;
        y *= -viewInstance.dpr;
        z *= viewInstance.dpr;

        this.curBehaviorCanBreak = true;
        await viewInstance.moveCurPlane(x,y,0)
        this.curBehaviorCanBreak = false;

        if( x !== 0 ){
            viewInstance.isBoudriedSide = true;
        }

    }
    async moveCurPlaneTo(x:number,y:number,z:number){
        const { viewInstance } = this

        x *= viewInstance.dpr;
        y *= -viewInstance.dpr;
        z *= viewInstance.dpr;

        this.curBehaviorCanBreak = true;
        await viewInstance.moveCurPlane(x,y,0)
        this.curBehaviorCanBreak = false;

    }
}