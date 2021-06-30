/**
 * move action
 */
import { ImagePreview } from '../ts/image-preview'
import { showDebugger } from '../tools/index';

export class Move{
    handleMove(this: ImagePreview,e: TouchEvent & MouseEvent){
        e.preventDefault();

        if( this.isAnimating ){
            return;
        }
        // 双指缩放时的 处理 只移动和缩放。
        if( e.touches.length == 2 ){
            clearTimeout(this.performerRecordMove); 
            clearTimeout( this.performerClick )

            this.performerRecordMove = 0;
            this.handleZoom(e);
            this.handleMoveEnlage(e);
            return;
        }

        
        
        let curTouchX: number = e.touches[0].clientX;
        let curTouchY: number = e.touches[0].clientY;
        const overDistanceBeMoeve = 2;
        if( 
            Math.abs(this.touchStartX - curTouchX) > overDistanceBeMoeve 
                || 
            Math.abs( this.touchStartY - curTouchY ) > overDistanceBeMoeve ){
            clearTimeout( this.performerClick )
        }
        let isBoundaryLeft: boolean =  this.actionExecutor.IsBoundaryLeft;
        let isBoundaryRight: boolean = this.actionExecutor.isBoundaryRight;

        let isBoundary = isBoundaryLeft || isBoundaryRight;

        let direction: string = e.touches[0].clientX - this.startX > 0 ? 'right':'left';

        const viewRect = this.actionExecutor.viewRect;
        const curItemViewLeft: number = viewRect.left;
        const curItemViewRight: number = viewRect.right;
        const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;

        /* 收集一段时间之内得移动得点，用于获取当前手指得移动方向
         * 如果手指方向已经确定了 则按手指方向做出操作，否则 启动开始收集手指移动得点
         * 并启动一个计时器 一定时间之后处理移动方向
         **/
        if( this.fingerDirection ){
            this.performerRecordMove = 0;
            if( this.actionExecutor.isEnlargement  ){
                // 放大的时候的移动是查看放大后的图片
                // 放大的时候,如果到达边界还是进行正常的切屏操作
                // 重置是否已到达边界的变量,如果容器内能容纳图片则不需要重置
                // 对于长图单独处理，长图就是宽度可以容纳在当前容器内，但是高度很高的图片
                if( curItemViewLeft >= 0 && curItemViewRight <= conWidth ){
                    if( 
                        (
                            (direction == 'right') ||
                            (direction == 'left' ) || 
                            (this.isEnlargeMove)
                        ) && 
                        (this.fingerDirection == 'horizontal')
                    ){
                        this.isEnlargeMove = true;
                        this.handleMoveNormal(e)
                    }else{
                        this.handleMoveEnlage(e);
                    }
                }else{
                    if( 
                        ((isBoundaryLeft && direction == 'right') 
                            || 
                        (isBoundaryRight && direction == 'left') 
                            || 
                        (this.isEnlargeMove)) 
                    ){;
                        this.isEnlargeMove = true;
                        this.handleMoveNormal(e)
                    }else{
                        this.handleMoveEnlage(e);
                    }
                }
                
            }else{
                //正常情况下的移动是图片左右切换
                this.handleMoveNormal(e)
            }
            this.isMotionless = false;
        }else{
            // 放大之后的非长图，以及非放大的图片，这里可以直接派发操作
            if( 
                ( this.actionExecutor.isEnlargement &&  curItemViewLeft < 0 && curItemViewRight > conWidth )
                    ||
                ( !this.actionExecutor.isEnlargement )
            ){
                // enlarge but not reach bonudry
                if( this.actionExecutor.isEnlargement && !isBoundary ){
                    this.handleMoveEnlage(e);
                }else if( !this.actionExecutor.isEnlargement ){// not enlage
                    this.handleMoveNormal(e)
                }else if( isBoundary ){// 放大了到边界了
                    this.handleMoveNormal(e)
                }
                this.isMotionless = false;

                return;
            }

            this.getMovePoints( e );
            if( this.movePoints.length < this.maxMovePointCounts ){
                return;
            }
            this.decideMoveDirection(
                e,curItemViewLeft,curItemViewRight,isBoundaryLeft,
                isBoundaryRight,direction
            );
        }     
    }
    handleMoveNormal(this: ImagePreview, e: TouchEvent & MouseEvent ){
        showDebugger(`
        this.isAnimating:${this.isAnimating}
        `)
        
        this.isNormalMove = true;
        const eventsHanlder = this.actionExecutor.eventsHanlder;

        let curX: number = (e.touches[0].clientX);

        let offset = curX - this.startX;
        this.imgContainerMoveX += offset;
        
        this.startX = curX;
        eventsHanlder.handleMoveNormal(e,offset);
        
    }
    handleMoveEnlage( this: ImagePreview,e: TouchEvent & MouseEvent ){;
        if( !this.moveStartTime){
            this.moveStartTime = Date.now();
        }
        this.isNormalMove = false;

        this.actionExecutor.isBoudriedSide = false;
        const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;
        const conHeight: number = imgContainerRect.height;

        const { actionExecutor } = this
        if( actionExecutor.isLoadingError() ){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        const curItemRect = actionExecutor.viewRect;

        const curItemHeihgt: number = curItemRect.height;
        const viewLeft: number = curItemRect.left;
        const viewRight: number = curItemRect.right;

        let curX: number = (e.touches[0].clientX);
        let curY: number = (e.touches[0].clientY);

        let offsetX: number  = curX - this.startX;
        let offsetY: number  = curY - this.startY;

        let curTop: number ;
        let curLeft: number;
        // 如果容器内能完整展示图片就不需要移动
        showDebugger(`
            viewLeft:${viewLeft}
            viewRight:${viewRight}
        `)
        if( Math.round( viewLeft ) < 0 ||  Math.round(viewRight) > conWidth ){
            curLeft = (offsetX);
        }else{
            curLeft = 0;
        }

        if( curItemHeihgt > conHeight ){
            curTop = (offsetY)
        }else{
            curTop = 0
        }

        actionExecutor.eventsHanlder.handleMoveEnlage(e,curLeft,curTop,0)
       
  
        this.startX = curX;
        this.startY = curY;

    }
    autoMove(this: ImagePreview,deg: number,startX:number,startY:number,{maxTop,minTop,maxLeft,minLeft}):void{
        if( this.isAnimating ){
            return;
        }
        const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;
        const conHeight: number = imgContainerRect.height;
// debugger;
        const {viewRect,eventsHanlder} = this.actionExecutor
        const curItemRect = viewRect;
        const curItemViewTop: number = curItemRect.top;
        const curItemViewBottom: number = curItemRect.bottom;
        const curItemViewLeft: number = curItemRect.left;
        const curItemViewRight: number = curItemRect.right;
        deg = (deg / 180) * Math.PI;
        let distance: number = 200;
        let offsetX: number = (distance * Math.cos( deg ))
        let offsetY: number = (distance * Math.sin(deg));
// debugger;
        let endX = startX + offsetX;
        let endY = startY + offsetY;
        if( endX + curItemViewLeft > maxLeft ){
            endX = (maxLeft - curItemViewLeft)
        }else if( endX < minLeft ){
            endX = minLeft
        }
// debugger;
        if( endY > maxTop){
            endY = ( maxTop -curItemViewTop )
        }else if( endY < minTop ){
            endY = minTop
        }
        // 容器宽度能容纳图片宽度，则水平方向不需要移动，
        // 容器高度能容纳图片高度，则垂直方向不需要移动。
        let x = 0;
        let y = 0;
        if( !(curItemViewLeft >= 0 && curItemViewRight <= conWidth) ){
            x = endX;
        }
        if( !( curItemViewTop >= 0 && curItemViewBottom <= conHeight ) ){
            y = endY;
        }
        eventsHanlder.moveCurPlaneTo(x,y,0)
    }
}