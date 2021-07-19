import { webGl } from "../index";
import { matrix } from "../matrix";

export class events {
    viewInstance: webGl;
    curBehaviorCanBreak: boolean = false;
    throldDeg: number = Math.PI * 0.10;
    resizeTimer
    constructor(viewInstance: webGl) {
        this.viewInstance = viewInstance;
    }
    handleResize(){
        const {viewInstance,resizeTimer} = this
        clearTimeout(resizeTimer);
        const run = () => {;
            const canvas = viewInstance.ref;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            canvas.width = window.innerWidth * viewInstance.dpr;
            canvas.height = window.innerHeight * viewInstance.dpr;

            viewInstance.viewWidth = canvas.width;
            viewInstance.viewHeight = canvas.height;
            viewInstance.gl.viewport(0,0,viewInstance.viewWidth,viewInstance.viewHeight)

            const projectionMatrix = viewInstance.createPerspectiveMatrix();
            viewInstance.gl.uniformMatrix4fv(
                viewInstance.gl.getUniformLocation(viewInstance.shaderProgram, 'uProjectionMatrix'),
                false,
                projectionMatrix
            );

            viewInstance.draw(viewInstance.curIndex)
        }
        this.resizeTimer = setTimeout(run,100)
    }
    handleDoubleClick(e: TouchEvent & MouseEvent){

        const { clientX, clientY } = e.touches[0];
        const { viewInstance } = this;

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
        const { viewInstance } = this;
        const maxDeg = Math.PI / 2 ;
        let deg = -offset / (viewInstance.viewWidth/viewInstance.dpr) * maxDeg
        viewInstance.rotatePosition(deg);
    }
    handleZoom(e: TouchEvent & MouseEvent,sx:number,sy:number,dx:number,dy:number) {
        const { viewInstance } = this;

        let [nw,nh] = viewInstance.imgShape
        let [iW,iH] = viewInstance.imgShapeInitinal

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

        const { viewInstance } = this;
        const maxDeg = Math.PI / 2 ;
        let degX = -offset / (viewInstance.viewWidth/viewInstance.dpr) * maxDeg
        const plusOrMinus = degX / Math.abs(degX);

        viewInstance.baseModel = viewInstance.modelMatrix;

        if (Math.abs(degX) >= this.throldDeg) {// 左右切换
            let beforeIndex = viewInstance.curIndex;
            let nextIndex = viewInstance.curIndex + (plusOrMinus * 1)
            if (nextIndex == -1 || nextIndex == viewInstance.imgUrls.length) {// 第一张左切换或最后一张右切换时 也是复原
                viewInstance.curIndex = beforeIndex;
                await viewInstance.rotate(-degX);
            } else {
                await viewInstance.rotate(plusOrMinus * Math.PI / 2 - degX);
                viewInstance.curIndex = nextIndex;
                viewInstance.modelMatrix = viewInstance.baseModel = viewInstance.initialModel ;
                viewInstance.gl.uniformMatrix4fv(
                    viewInstance.gl.getUniformLocation(viewInstance.shaderProgram, 'uModelViewMatrix'),
                    false,
                    viewInstance.modelMatrix
                );
                await viewInstance.draw(nextIndex)
            }

        } else {// 复原
            await viewInstance.rotate(- degX)
        }

        viewInstance.modelMatrix = viewInstance.baseModel = viewInstance.initialModel ;

        return 'handled'
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