/**
 * move action
 */
import { ImagePreview } from '../ts/image-preview'
export class Move{
    handleMove(this: ImagePreview,e: TouchEvent & MouseEvent){
        e.preventDefault();
        if( this.isAnimating ){
            return;
        } 

        // 双指缩放时的处理
        if( e.touches.length == 2 ){
            clearTimeout(this.performerRecordMove); 
            clearTimeout( this.performerClick )

            this.performerRecordMove = 0;
            this.handleZoom( e );
            return;
        }

        if( this.isZooming ){
            // 执行了缩放操作，则不进行任何移动
            // 这个值会在手指全部离开屏幕后重置
            return;
        }
        let curTouchX: number = e.touches[0].clientX;
        let curTouchY: number = e.touches[0].clientY;
        if( (this.touchStartX - curTouchX) > 2 && Math.abs( this.touchStartY - curTouchY ) > 2 ){
            clearTimeout( this.performerClick )
        }
       

        const curItem: HTMLElement = this.imgItems[this.curIndex];
     
        let isBoundaryLeft: boolean = curItem.dataset.toLeft == 'true';
        let isBoundaryRight: boolean = curItem.dataset.toRight == 'true'
        let direction: string = e.touches[0].clientX - this.startX > 0 ? 'right':'left';

        const curItemViewLeft: number = curItem.getBoundingClientRect().left;
        const curItemViewRight: number = curItem.getBoundingClientRect().right;
        const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;

        /* 收集一段时间之内得移动得点，用于获取当前手指得移动方向
         * 如果手指方向已经确定了 则按手指方向做出操作，否则 启动开始收集手指移动得点
         * 并启动一个计时器 一定时间之后处理移动方向
         **/
        if( this.fingerDirection ){
            this.performerRecordMove = 0;
            if( curItem.dataset.isEnlargement == 'enlargement' ){
                // 放大的时候的移动是查看放大后的图片

                // 放大的时候,如果到达边界还是进行正常的切屏操作
                // 重置是否已到达边界的变量,如果容器内能容纳图片则不需要重置
                
                // 对于长图单独处理，长图就是宽度可以容纳在当前容器内，但是高度很高的图片

                if( curItemViewLeft >= 0 && curItemViewRight <= conWidth ){
                    if( 
                        (
                            (isBoundaryLeft && direction == 'right') ||
                             (isBoundaryRight && direction == 'left') || 
                             (this.isEnlargeMove)
                        ) && 
                        (this.fingerDirection == 'horizontal')  ){
                        this.isEnlargeMove = true;
                        this.handleMoveNormal(e)
                    }else{
                        this.handleMoveEnlage(e);
                    }
                }else{
                    if( (isBoundaryLeft && direction == 'right') || (isBoundaryRight && direction == 'left') || (this.isEnlargeMove) ){
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
                ( curItem.dataset.isEnlargement == 'enlargement' &&  curItemViewLeft < 0 && curItemViewRight > conWidth )
                 ||
                ( curItem.dataset.isEnlargement !== 'enlargement' )
            
            ){
                if( curItem.dataset.isEnlargement == 'enlargement' &&  curItemViewLeft < 0 && curItemViewRight > conWidth ){
                    this.handleMoveEnlage(e);
                }else if(curItem.dataset.isEnlargement !== 'enlargement'){
                    this.handleMoveNormal(e)

                }
                this.isMotionless = false;

                return;
            }

            this.getMovePoints( e );
            if( this.performerRecordMove ){
                return;
            }
            this.performerRecordMove = setTimeout( () => {
                let L: number = this.movePoints.length;
                if( L == 0 ) return;
                let endPoint:{x:number,y:number} = this.movePoints[L-1];
                let startPoint: { x:number,y:number } = this.movePoints[0];

                let dx: number = endPoint.x - startPoint.x;
                let dy:number = endPoint.y - startPoint.y;

                let degree: number = Math.atan2(dy, dx) * 180 / Math.PI;
                
                if( Math.abs( 90 - Math.abs(degree) ) < 30 ){
                    this.fingerDirection = 'vertical'
                }else{
                    this.fingerDirection ='horizontal'
                }
                if( curItem.dataset.isEnlargement == 'enlargement' ){
                    // 放大的时候的移动是查看放大后的图片

                    // 放大的时候,如果到达边界还是进行正常的切屏操作
                    // 重置是否已到达边界的变量,如果容器内能容纳图片则不需要重置
                    const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
                    const conWidth: number = imgContainerRect.width;

                    const curItemViewLeft: number = curItem.getBoundingClientRect().left;
                    const curItemViewRight: number = curItem.getBoundingClientRect().right;
                    // 对于长图单独处理，长图就是宽度可以容纳在当前容器内，但是高度很高的图片

                    if( curItemViewLeft >= 0 && curItemViewRight <= conWidth ){
                        if( 
                            (
                                (isBoundaryLeft && direction == 'right') ||
                                (isBoundaryRight && direction == 'left') || 
                                (this.isEnlargeMove)
                            ) && 
                            (this.fingerDirection == 'horizontal')  ){
                            this.isEnlargeMove = true;
                            this.handleMoveNormal(e)
                        }else{
                            this.handleMoveEnlage(e);
                        }
                    }else{
                        if( (isBoundaryLeft && direction == 'right') || (isBoundaryRight && direction == 'left') || (this.isEnlargeMove) ){
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
            },25)
        }     
    }
    handleMoveNormal(this: ImagePreview, e: TouchEvent & MouseEvent ){
        let curX: number = Math.round(e.touches[0].clientX);

        let offset = curX - this.startX;
        this.imgContainerMoveX += offset;
        if( this.imgContainerMoveX > this.maxMoveX  ){
            this.imgContainerMoveX = this.maxMoveX;
        }else if( this.imgContainerMoveX < this.minMoveX ){
            this.imgContainerMoveX = this.minMoveX;
        }
        this.startX = curX;

        this.imgContainer.style.left = `${ this.imgContainerMoveX }px`
    }
    handleMoveEnlage( this: ImagePreview,e: TouchEvent & MouseEvent ){
        
        if( !this.moveStartTime){
            this.moveStartTime = (new Date).getTime();
        }
        const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;
        const conHeight: number = imgContainerRect.height;
        const curItem: HTMLElement = this.imgItems[this.curIndex];

        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }

        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeihgt: number = curItem.getBoundingClientRect().height;

        const viewLeft: number = curItem.getBoundingClientRect().left;
        const viewRight: number = curItem.getBoundingClientRect().right;
        let curX: number = Math.round(e.touches[0].clientX);
        let curY: number = Math.round(e.touches[0].clientY);

        let offsetX: number  = curX - this.startX;
        let offsetY: number  = curY - this.startY;

        const curItemTop: number  = Number(curItem.dataset.top);
        const curItemLeft: number  = Number(curItem.dataset.left);

        

        let curTop: number ;
        let curLeft: number;
        // 如果容器内能完整展示图片就不需要移动
        if( viewLeft < 0 || viewRight > conWidth ){
            curLeft = curItemLeft + offsetX;
        }else{
            curLeft = curItemLeft;
        }

        if( curItemHeihgt > conHeight ){
            curTop = curItemTop + offsetY
        }else{
            curTop = curItemTop
        }

        curItem.style.cssText += `
            top: ${curTop}px;
            left: ${ curLeft }px;
        `
        curItem.dataset.top = (curTop).toString();
        curItem.dataset.left = (curLeft).toString();
        this.startX = curX;
        this.startY = curY;

        

    }
    autoMove(this: ImagePreview,curItem:HTMLElement,deg: number,startX:number,startY:number,{maxTop,minTop,maxLeft,minLeft}):void{
        const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;
        const conHeight: number = imgContainerRect.height;

        const curItemViewTop: number = curItem.getBoundingClientRect().top;
        const curItemViewBottom: number = curItem.getBoundingClientRect().bottom;
        const curItemViewLeft: number = curItem.getBoundingClientRect().left;
        const curItemViewRight: number = curItem.getBoundingClientRect().right;
        deg = (deg / 180) * Math.PI;
        let distance: number = 500;
        let offsetX: number = Math.round(distance * Math.cos( deg ))
        let offsetY: number = Math.round(distance * Math.sin(deg));

        let endX = startX + offsetX;
        let endY = startY + offsetY;
        if( endX > maxLeft ){
            endX = maxLeft
        }else if( endX < minLeft ){
            endX = minLeft
        }

        if( endY > maxTop){
            endY = maxTop
        }else if( endY < minTop ){
            endY = minTop
        }

        let stepX: number = this.computeStep( startX - endX,300 );
        let stepY: number = this.computeStep( startY - endY ,300 );

        // 容器宽度能容纳图片宽度，则水平方向不需要移动，
        // 容器高度能容纳图片高度，则垂直方向不需要移动。

        let moveStyles: Array<{
            prop: string,
            start: number,
            end: number,
            step: number
        }> = [];
        if( !(curItemViewLeft >= 0 && curItemViewRight <= conWidth) ){
            moveStyles.push({
                prop: 'left',
                start: startX,
                end: endX,
                step: -stepX
            })
            curItem.dataset.left = `${endX}`;
        }
        if( !( curItemViewTop >= 0 && curItemViewBottom <= conHeight ) ){
            moveStyles.push({
                prop:'top',
                start: startY,
                end: endY,
                step: -stepY
            })
            curItem.dataset.top = `${endY}`;
        }
        this.animateMultiValue(curItem,moveStyles)
        if( endX == maxLeft ){
            //toLeft 即为到达左边界的意思下同
            curItem.dataset.toLeft = 'true';
            curItem.dataset.toRight = 'false';
            
        }else if( endX == minLeft ){
            curItem.dataset.toLeft = 'false';
            curItem.dataset.toRight = 'true';
        }

        if( endY == maxTop ){
            curItem.dataset.toTop = 'true';
            curItem.dataset.toBottom = 'false';
        }else if( endY == minTop ){
            curItem.dataset.toTop = 'false';
            curItem.dataset.toBottom = 'true';
        }

    }
}