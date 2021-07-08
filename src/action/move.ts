/**
 * move action
 */
import { ImagePreview } from '../ts/image-preview'
import { showDebugger } from '../tools/index';

export class Move{
    handleMove(this: ImagePreview,e: TouchEvent & MouseEvent){
        e.preventDefault();

        // 双指缩放时的。
        if( e.touches.length == 2 ){
            clearTimeout( this.performerClick )
            this.handleZoom(e);
            // this.handleMoveEnlage(e); 
            return;
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
         **/
        if( this.fingerDirection ){
            if( this.actionExecutor.isEnlargement  ){
                // 放大了但是没有超出边界
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
                        this.handleMoveNormal(e);
                        const type = 'resetEnlargeMove';
                        const task = () => { this.isEnlargeMove = false }
                        this.addTouchEndTask(type,{
                            priority:1,
                            callback:task
                        });
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
                        this.handleMoveNormal(e);
                        const type = 'resetEnlargeMove';
                         this.addTouchEndTask(type,{
                             priority:1,
                             callback:() => (this.isEnlargeMove = false)
                         })
                    }else{
                        this.handleMoveEnlage(e);
                    }
                }
                
            }else{
                //正常情况下的移动是图片左右切换
                this.handleMoveNormal(e)
            }
        }else{
            // 放大之后的非长图，以及非放大的图片，这里可以直接派发操作
            if( 
                ( this.actionExecutor.isEnlargement &&  
                    (curItemViewLeft < 0 || curItemViewRight > conWidth)
                )
                    ||
                ( !this.actionExecutor.isEnlargement )
            ){
                // enlarge but not reach bonudry
                if( this.actionExecutor.isEnlargement && !isBoundary && !this.normalMoved ){
                    this.handleMoveEnlage(e);
                }else if( !this.actionExecutor.isEnlargement ){// not enlage
                    this.handleMoveNormal(e)
                }else if( isBoundary || this.normalMoved ){// 放大了到边界了
                    this.handleMoveNormal(e)
                }
                return;
            }
            // 长图收集手指方向
            this.getMovePoints( e );
            // 收集够一定数量的点才会执行下边的逻辑
            if( this.movePoints.length < this.maxMovePointCounts ){
                return;
            }
            this.decideMoveDirection();
        }     
    }
    handleMoveNormal(this: ImagePreview, e: TouchEvent & MouseEvent ){
        showDebugger(`
        moveNormal:${Date.now()}
        this.isAnimating :${this.isAnimating }
        this.touchStartX:${this.touchStartX}
        `)
        if( this.isAnimating){
            return;
        }
        if( this.isZooming ){
            return;
        }
        
        if( !this.isNormalMove ){
            this.touchStartX = this.startX = (e.touches[0].clientX);
            this.touchStartY = this.startY = (e.touches[0].clientY);
        }
        this.isNormalMove = true;
        const type = 'normalMove'
        this.addTouchEndTask(type, {
            priority:1,
            callback:() => (this.isNormalMove = false)
        })
        const eventsHanlder = this.actionExecutor.eventsHanlder;

        let curX: number = (e.touches[0].clientX);

        let offset = curX - this.touchStartX;
        this.imgContainerMoveX += offset;
        this.startX = curX;
        if( offset !== 0 ){
            this.normalMoved = true;
            const type = 'normalMoved';
            const task = (e) => {
                (this.normalMoved = false);
                this.handleTEndEnNormal.bind(this)(e)
            };
            this.addTouchEndTask(type,{
                priority:10,
                callback: task
            })
        }
       
        eventsHanlder.handleMoveNormal(e,offset);
        
    }
    handleMoveEnlage( this: ImagePreview,e: TouchEvent & MouseEvent ){;
        showDebugger(`
            handlemoveEnlarge:this.isZooming ${this.isZooming}
            this.isAnimating:${this.isAnimating}
             ${Date.now()}
        `)
        if( this.actionExecutor.isLoadingError() ){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        if( this.isZooming ){
            return;
        }
        if( !this.moveStartTime){
            this.moveStartTime = Date.now();
            this.touchStartX = this.startX = (e.touches[0].clientX);
            this.touchStartY = this.startY = (e.touches[0].clientY);
        }
        const { actionExecutor } = this
        const { eventsHanlder } = actionExecutor;
        // 放大的时候自由滑动的时候是可以被中断的
        if( eventsHanlder.curBehaviorCanBreak ){
            actionExecutor.curAimateBreaked = true;//直接中断当前动画
            if( this.isAnimating ){
                this.touchStartX  = (e.touches[0].clientX);
                this.touchStartY  = (e.touches[0].clientY);
                return;
            }
        }else{ // 不可中断动画进行时
            if( this.isAnimating ){
                return
            }
        }

        

        this.isNormalMove = false;

        this.actionExecutor.isBoudriedSide = false;
        const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;
        const conHeight: number = imgContainerRect.height;

        
        const curItemRect = actionExecutor.viewRect;

        const curItemHeihgt: number = curItemRect.height;
        const viewLeft: number = curItemRect.left;
        const viewRight: number = curItemRect.right;
        const viewTop = curItemRect.top;
        const viewBottom = curItemRect.bottom;

        let curX: number = (e.touches[0].clientX);
        let curY: number = (e.touches[0].clientY);

        let offsetX: number  = curX - this.startX;
        let offsetY: number  = curY - this.startY;

        let curTop: number ;
        let curLeft: number;
        // 如果容器内能完整展示图片就不需要移动
        if( Math.round( viewLeft ) < 0 ||  Math.round(viewRight) > conWidth ){
            curLeft = (offsetX);
        }else{
            curLeft = 0;
        }

        if( Math.round( viewTop ) < 0 ||  Math.round(viewBottom) > conHeight ){
            curTop = (offsetY)
        }else{
            curTop = 0
        }
        actionExecutor.eventsHanlder.handleMoveEnlage(e,curLeft,curTop,0);

        const type = 'handleTendEnlarte';
        this.addTouchEndTask(type,{
            priority: 10,
            callback:this.handleTEndEnlarge.bind(this)
        })

        this.startX = curX;
        this.startY = curY;

    }
    autoMove(this: ImagePreview,deg: number,startX:number,startY:number,{maxTop,minTop,maxLeft,minLeft}){
    
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
        let distance: number = 300;
        let offsetX: number = (distance * Math.cos( deg ))
        let offsetY: number = (distance * Math.sin(deg));

        let endX = startX + offsetX;
        let endY = startY + offsetY;

        if( endX > maxLeft ){
            endX = (maxLeft)
        }else if( endX < minLeft ){
            endX = (minLeft)
        }
// debugger;
        if( endY > maxTop){
            endY = ( maxTop )
        }else if( endY < minTop ){
            endY = (minTop )
        }
        // 容器宽度能容纳图片宽度，则水平方向不需要移动，
        // 容器高度能容纳图片高度，则垂直方向不需要移动。
        let x = 0;
        let y = 0;
        if( !(curItemViewLeft >= 0 && curItemViewRight <= conWidth) ){
            x = endX - startX;
        }
        if( !( curItemViewTop >= 0 && curItemViewBottom <= conHeight ) ){
            y = endY - startY;
        }

        return eventsHanlder.moveCurPlaneTo(x,y,0)
    }
}