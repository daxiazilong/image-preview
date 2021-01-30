/**
 * zoom action
 */
import { ImagePreview } from '../ts/image-preview'

export class Zoom{
    [key:string]: any;
    setToNaturalImgSize(this: ImagePreview,
        toWidth:number,toHeight:number, 
        scaleX: number , scaleY: number,
        e: TouchEvent & MouseEvent
    ) :void{
        /**
         * 踩坑记
         * transform-origin 的参考点始终时对其初始位置来说的
         * scale之后的元素, 实际的偏移路径等于 translate 的位移等于 位移 * scale
         */
        let mouseX: number = e.touches[0].clientX;
        let mouseY: number = e.touches[0].clientY;

        const curItem: HTMLElement = this.imgItems[this.curIndex];

        // 以下为旋转之后缩放时需要用到的参数
        const curItemViewTop: number = curItem.getBoundingClientRect().top;//当前元素距离视口的top
        const curItemViewLeft: number = curItem.getBoundingClientRect().left;//当前元素距离视口的left

        const curItemTop: number = Number(curItem.dataset.top) || 0;
        const curItemLeft: number = Number(curItem.dataset.left) || 0;

        let rotateDeg: number = Number(curItem.dataset.rotateDeg || '0');

        const centerX: number =  Number(curItem.dataset.initialWidth) / 2;
        const centerY: number = Number(curItem.dataset.initialHeight) / 2;

        const originWidth = curItem.style.width;
        const originHeight = curItem.style.height;
        switch( rotateDeg % 360 ){
            case 0:
                let translateX = ( -(mouseX - curItemViewLeft- centerX) * (scaleX-1 ) ) / scaleX ;
                if( toWidth == this.containerWidth ){
                    translateX = 0
                }
                curItem.style.cssText = `;
                    top:${curItemTop}px;
                    left:${curItemLeft}px;
                    width:${originWidth};
                    height:${originHeight};
                    transform-origin: ${ centerX }px ${ centerY }px;
                    transform: 
                        rotateZ(${rotateDeg}deg) 
                        scale3d(${ scaleX },${ scaleY },1) 
                        translateY(${ ( -(mouseY - curItemViewTop - centerY) * (scaleY -1 ) ) / scaleY }px) 
                        translateX(${ translateX }px) 
                    ;
                `;
                break;
            case -180:
            case 180:
                curItem.style.cssText = `;
                    top:${curItemTop}px;
                    left: ${curItemLeft}px;
                    width:${originWidth};
                    height:${originHeight};
                    transform-origin: ${ centerX }px ${ centerY }px;
                    transform: 
                        rotateZ(${rotateDeg}deg) scale3d(${ scaleX },${ scaleY },1) 
                        translateY(${ ( (mouseY - curItemViewTop  - centerY) * (scaleY -1 ) ) / scaleY   }px) 
                        translateX(${ ( (mouseX - curItemViewLeft -  centerX) * (scaleX-1 ) ) / scaleX   }px) 
                    ;
                `;
                break;
            case -90:
            case 270:
                /**
                 * 笔记：
                 * 以 y轴偏移举例，因为旋转 -90或270度之后，
                 * y轴的位移实际由translateX控制，所以需要translateX控制其偏移
                 * (mouseY - curItemViewTop - centerX) * (scaleX -1 ) 是一个点缩放前后产生的位移偏差
                 * 再除以scaleX是因为啥呢，是因为上边可能讲过 translate x px 实际效果是 x * scaleX 的大小
                 */
                curItem.style.cssText = `;
                    top: ${curItemTop}px;
                    left: ${curItemLeft}px;
                    width:${originWidth};
                    height:${originHeight};
                    transform-origin: ${ centerX }px ${ centerY }px ; 
                    transform: 
                        rotateZ(${rotateDeg}deg) 
                        scale3d(${ scaleX },${ scaleY },1) 
                        translateX(${ ( (mouseY - curItemViewTop - centerX) * (scaleX -1 ) ) / scaleX   }px) 
                        translateY(${ ( -(mouseX - curItemViewLeft- centerY) * (scaleY -1 ) ) / scaleY   }px) 
                    ;
                    
                `;
                
        
                break;
                
            case -270:
            case 90:
                    curItem.style.cssText = `;
                        top: ${curItemTop}px;
                        left: ${curItemLeft}px;
                        width:${originWidth};
                        height:${originHeight};
                        transform-origin: ${ centerX }px ${ centerY }px ; 
                        transform: 
                            rotateZ(${rotateDeg}deg) 
                            scale3d(${ scaleX },${ scaleY },1) 
                            translateX(${ ( -(mouseY - curItemViewTop - centerX) * (scaleX -1 ) ) / scaleX   }px) 
                            translateY(${ ( (mouseX - curItemViewLeft- centerY) * (scaleY -1 ) ) / scaleY   }px) 
                        ;
                        
                    `;
                break;
            default:
                break;
        } 

        // 放大之后 图片相对视口位置不变

        let scaledX: number ;
        let scaledY: number ;

        

        if( Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270 ){
            scaledX = (mouseX - curItemLeft) * scaleY;
            scaledY = ( mouseY - curItemTop ) * scaleX;
        }else{
            scaledX = (mouseX - curItemLeft )* scaleX;
            scaledY =( mouseY - curItemTop ) * scaleY;
            // 以y轴偏移的计算为例，以下是setTimout 计算时公式的推导
            //- (( mouseY - curItemTop ) * (scaleY - 1) - curItemTop)
            // = curItemTop -  (mouseY - curItemTop)  * (scaleY - 1)   ;
            // = curItemTop - ( mouseY- curItemTop)*scaleY + (mouseY - curItemTop)   
            // = mouseY - ( mouseY- curItemTop)*scaleY
            //  = - (scaledY - mouseY)
        }
        if( this.supportTransitionEnd ){
            let end:string = <string>this.supportTransitionEnd;
            curItem.addEventListener(end,() => {

                let left =  -(scaledX - mouseX);

                if( Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270 ){
                    curItem.style.cssText = `;
                        transform: rotateZ(${rotateDeg}deg);
                        width: ${ toHeight }px;
                        height: ${ toWidth }px;
                        left: ${ left }px;
                        top: ${ -(scaledY - mouseY)  }px;
                        transition: none;
                    `;
                }else{
                    if( toWidth == this.containerWidth ){
                        left = 0
                    }
                    curItem.style.cssText = `;
                        transform: rotateZ(${rotateDeg}deg);
                        width: ${ toWidth }px;
                        height: ${ toHeight }px;
                        left: ${ left }px;
                        top: ${ -(scaledY - mouseY)  }px;
                        transition: none;
                    `;
                }
                
                curItem.dataset.top = `${ -(scaledY - mouseY)  }`;
                curItem.dataset.left = `${ left }`;
                curItem.dataset.isEnlargement = 'enlargement';
                
                this.isAnimating = false;
            },{once:true})
            return;
        }
        setTimeout(() => {
            if( Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270 ){
                curItem.style.cssText = `;
                    transform: rotateZ(${rotateDeg}deg);
                    width: ${ toHeight }px;
                    height: ${ toWidth }px;
                    left: ${ -(scaledX - mouseX)  }px;
                    top: ${ -(scaledY - mouseY)  }px;
                    transition: none;
                `;
            }else{
                curItem.style.cssText = `;
                    transform: rotateZ(${rotateDeg}deg);
                    width: ${ toWidth }px;
                    height: ${ toHeight }px;
                    left: ${ -(scaledX - mouseX)  }px;
                    top: ${ -(scaledY - mouseY)  }px;
                    transition: none;
                `;
            }
            
            curItem.dataset.top = `${ -(scaledY - mouseY)  }`;
            curItem.dataset.left = `${ -(scaledX -mouseX)  }`;
            curItem.dataset.isEnlargement = 'enlargement';
            
            this.isAnimating = false;
        },550)
    }
    setToInitialSize( scaleX: number , scaleY: number,e: TouchEvent & MouseEvent ){

        const curItem: HTMLElement = this.imgItems[this.curIndex];
        let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeight: number = curItem.getBoundingClientRect().height;

        // 以下为旋转之后缩放时需要用到的参数
        const curItemViewTop: number = curItem.getBoundingClientRect().top;//当前元素距离视口的top
        const curItemViewLeft: number = curItem.getBoundingClientRect().left;//当前元素距离视口的left

        let rotateDeg: number = Number(curItem.dataset.rotateDeg || '0');

        let toWidth: number ;
        let toHeight: number ;

        if( Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270 ){
            toWidth = curItemHeight
            toHeight = curItemWidth;
            
        }else{
            toWidth = curItemWidth
            toHeight = curItemHeight;
            
        }
        switch( rotateDeg % 360 ){
            case 0:
                const centerX: number =  curItemWidth / 2;
                const centerY: number = curItemHeight / 2;

                let top: number = Number(curItem.dataset.top) || 0;
                let left: number = Number(curItem.dataset.left) || 0;

                const viewTopInitial:number =   Number(curItem.dataset.initialTop);
                const viewLeftInitial:number =  Number(curItem.dataset.initialLeft);

                let disteanceY: number =  curItemViewTop  + ( centerY )*(1 - scaleY) - top - viewTopInitial;
                let distanceX:number = curItemViewLeft + (centerX)*( 1 - scaleX)  - left - viewLeftInitial;
                curItem.style.cssText = `;
                    top:${curItem.dataset.top}px;
                    left:${curItem.dataset.left}px;
                    width: ${toWidth}px;
                    height: ${toHeight}px;
                    transform-origin: ${ centerX }px ${ centerY }px;
                    transform: 
                        rotateZ(${rotateDeg}deg) 
                        scale3d(${ scaleX },${ scaleY },1) 
                        translateX(${ -(left + distanceX) / scaleX  }px) 
                        translateY(${ -(  top + disteanceY )/scaleY }px)
                    ;
                `;
                break;
            case 180:
            case -180:
                {
                    const centerX: number =  curItemWidth / 2;
                    const centerY: number = curItemHeight / 2;

                    const viewTopInitial:number = Number(curItem.dataset.initialTop);
                    const viewLeftInitial:number = Number(curItem.dataset.initialLeft);

                    let top: number = Number(curItem.dataset.top);
                    let left: number = Number(curItem.dataset.left) || 0;

                    let disteanceY: number =  curItemViewTop  + ( centerY )*(1 - scaleY) - top - viewTopInitial;
                    let distanceX:number = curItemViewLeft + (centerX)*( 1 - scaleX)  - left - viewLeftInitial;
                    
                    curItem.style.cssText = `;
                        top:${top}px;
                        left:${left}px;
                        width: ${toWidth}px;
                        height: ${toHeight}px;
                        transform-origin: ${ centerX }px ${ centerY }px;
                        transform: 
                            rotateZ(${rotateDeg}deg) 
                            scale3d(${ scaleX },${ scaleY },1) 
                            translateX(${ (left + distanceX) / scaleX  }px) 
                            translateY(${ (  top + disteanceY )/scaleY }px)
                        ;
                    `;
                }
                break;
            case -90:
            case 270:
                {  
                    const centerX: number =  curItemHeight / 2;
                    const centerY: number = curItemWidth / 2;

                    let intialItemWidth: number = Number(curItem.dataset.initialWidth);
                    let intialItemHeight: number = Number( curItem.dataset.initialHeight);
                    let conWidth : number = imgContainerRect.width;
                    let conHeight: number = imgContainerRect.height;
                    // 90 and 270 deg is derived from 0 deg state
                    // next case-expression is same.
                    const viewTopInitial:number =  (conHeight - intialItemWidth) / 2;
                    const viewLeftInitial:number = (conWidth - intialItemHeight) / 2;

                    let top: number = Number(curItem.dataset.top);
                    let left: number = Number(curItem.dataset.left);

                    /**
                     * 缩小的时候要时的图像的位置向原始位置靠近
                     * 以y轴得位移举例
                     * 放大之后 再缩小时 图像顶部移动的距离  centerX*(1-scaleY)
                     *  这个式子是这么推导而来的  Math.abs(centerX* scaleY - centerX)
                     * (这是缩放前后产生的位移距离)，
                     * 减去top（这是使用translate抵消top时产生的y轴位移，使其位置和top等于0时的位置一样）
                     * 这个时候就能得到缩小之后图像距离视口顶部的距离，然后再减去原始的高度（变形前的高度）
                     * 就得到了我们最终需要使其在y轴上偏移的距离
                     */
                    let disteanceY: number =  curItemViewTop  + ( centerX )* (1 -scaleY )  - top - viewTopInitial;
                    let distanceX:number = curItemViewLeft + (centerY)*(1-scaleX) - left - viewLeftInitial;
                    curItem.style.cssText = `;
                        top:${top}px;
                        left:${left}px;
                        width: ${toWidth}px;
                        height: ${toHeight}px;
                        transform-origin: ${centerX}px ${centerY}px 0;
                        transform: 
                            rotateZ(${rotateDeg}deg) 
                            scale3d(${ scaleX },${ scaleY },1) 
                            translateX(${ (  top + disteanceY )/scaleY }px) 
                            translateY(${ -(left + distanceX) / scaleX  }px)
                        ;

                    `;
                    }
                break;
            case 90:   
            case -270:
                {
                    const centerX: number =  curItemHeight / 2;
                    const centerY: number = curItemWidth / 2;

                    let intialItemWidth: number = Number(curItem.dataset.initialWidth);
                    let intialItemHeight: number = Number( curItem.dataset.initialHeight);
                    let conWidth : number = imgContainerRect.width;
                    let conHeight: number = imgContainerRect.height;
                    
                    const viewTopInitial:number =  (conHeight - intialItemWidth) / 2;
                    const viewLeftInitial:number = (conWidth - intialItemHeight) / 2;

                    let top: number = Number(curItem.dataset.top);
                    let left: number = Number(curItem.dataset.left);

                    let disteanceY: number =  curItemViewTop  + ( centerX )*( 1 - scaleY ) - top - viewTopInitial;
                    let distanceX:number = curItemViewLeft + (centerY)*( 1 -scaleX ) - left - viewLeftInitial;

                    curItem.style.cssText = `;
                        top:${top}px;
                        left:${left}px;
                        width: ${toWidth}px;
                        height: ${toHeight}px;
                        transform-origin: ${centerX}px ${centerY}px 0;
                        transform: 
                            rotateZ(${rotateDeg}deg) 
                            scale3d(${ scaleX },${ scaleY },1) 
                            translateX(${ -(  top + disteanceY )/scaleY }px) 
                            translateY(${ (left + distanceX) / scaleX  }px)
                        ;

                    `;
                }
                break;
            default:
                break;
        }  
        curItem.dataset.top = curItem.dataset.initialTop;
        curItem.dataset.left =  curItem.dataset.initialLeft;

        if( this.supportTransitionEnd ){
                let end:string = <string>this.supportTransitionEnd;
                curItem.addEventListener(end,(e) => {
                    curItem.style.cssText = `;
                        transform: rotateZ(${rotateDeg}deg);
                        top:${Number(curItem.dataset.initialTop)}px;
                        left: ${Number(curItem.dataset.initialLeft)}px;
                        width: ${curItem.dataset.initialWidth}px;
                        height: ${curItem.dataset.initialHeight}px;
                        transition: none; 
                        `
                    ;
                    {
                        /**
                         * bug fix on ios,
                         * frequent zoom with double-click may
                         * cause img fuzzy
                         */
                        let curImg: HTMLElement = curItem.querySelector(`img`);
                        let preImgStyle: string = curImg.style.cssText;

                        curImg.style.cssText = `
                            width: 100%;
                            height: 100%;
                        `            
                        setTimeout(function(){ 
                            curImg.style.cssText = preImgStyle; 
                        },10)
                    }
                    curItem.dataset.isEnlargement = 'shrink';
                    this.isAnimating = false;
            },{once:true})
            return;
        }
        setTimeout(() => {
            curItem.style.cssText = `;
                                transform: rotateZ(${rotateDeg}deg);
                                top:${Number(curItem.dataset.initialTop)}px;
                                left: ${Number(curItem.dataset.initialLeft)}px;
                                width: ${curItem.dataset.initialWidth}px;
                                height: ${curItem.dataset.initialHeight}px;
                                transition: none; 
                                `
            ;
            {
                /**
                 * bug fix on ios,
                 * frequent zoom with double-click may
                 * cause img fuzzy
                 */
                let curImg: HTMLElement = curItem.querySelector(`img`);
                let preImgStyle: string = curImg.style.cssText;

                curImg.style.cssText = `
                    width: 100%;
                    height: 100%;
                `            
                setTimeout(function(){ 
                    curImg.style.cssText = preImgStyle; 
                },10)
            }
            curItem.dataset.isEnlargement = 'shrink';
            this.isAnimating = false;
        },550)
    }
   
    handleZoom(e: TouchEvent & MouseEvent ) :void{
        if( !this.isZooming ){
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
        const curItem: HTMLElement = this.imgItems[this.curIndex];

        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            this.isAnimating = false;
            return;
        }

        
        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeihgt: number = curItem.getBoundingClientRect().height;

        const distaceBefore: number = 
            Math.sqrt( Math.pow( this.curPoint1.x - this.curPoint2.x,2) + Math.pow( this.curPoint1.y - this.curPoint2.y,2) );

        const distanceNow: number = 
            Math.sqrt( Math.pow( e.touches[0].clientX - e.touches[1].clientX,2) + Math.pow( e.touches[0].clientY - e.touches[1].clientY,2) );
        
        let top: number = Number(curItem.dataset.top) || 0;
        let left: number = Number(curItem.dataset.left) || 0;
        
        const centerX: number = ( this.curStartPoint1.x + this.curStartPoint2.x ) / 2 - left;
        const centerY: number = ( this.curStartPoint1.y + this.curStartPoint2.y ) / 2 - top;
        
        this.curPoint1.x = e.touches[0].clientX;
        this.curPoint1.y = e.touches[0].clientY;
        this.curPoint2.x = e.touches[1].clientX;
        this.curPoint2.y = e.touches[1].clientY;
        

        let rotateDeg: number = Number(curItem.dataset.rotateDeg || '0')

        /**
         * 踩坑记：
         * 因为双指所确定的中心坐标 其参考起点始终是
         * 相对于视口的，那么在图片不断放大之后 其所确定的中心坐标必然会较实际有所误差
         * 所以这里在  放大的时候 同时需要在xy坐标加上其实际已经偏移的距离
         * 因为放大之后偏移值必为负值，所以要减 负负得正嘛
         */
        if( distaceBefore > distanceNow ){//缩小
            const centerX: number = ( this.curStartPoint1.x + this.curStartPoint2.x ) / 2 - left;
            const centerY: number = ( this.curStartPoint1.y + this.curStartPoint2.y ) / 2 - top;
            
            curItem.dataset.top = (top + (this.zoomScale)*centerY ).toString();
            curItem.dataset.left = (left + (this.zoomScale)*centerX ).toString();
            let width: number = curItemWidth * (1 - this.zoomScale);
            let height: number = curItemHeihgt * (1 - this.zoomScale);
            
            
            switch( Math.abs(rotateDeg % 360) ){
                case 0:
                case 180:
                        if( width <= Number(curItem.dataset.initialWidth) ){
                            width = Number(curItem.dataset.initialWidth);
                            height = Number(curItem.dataset.initialHeight)
                            curItem.dataset.top = curItem.dataset.initialTop;
                            curItem.dataset.left = curItem.dataset.initialLeft;
                            curItem.dataset.isEnlargement = 'shrink';
                        }
                    
                    break;
                case 90:
                case 270:
                        if( height <= Number(curItem.dataset.initialWidth) ){
                            width = Number(curItem.dataset.initialHeight);
                            height = Number(curItem.dataset.initialWidth);
                            curItem.dataset.top = curItem.dataset.initialTop;
                            curItem.dataset.left = curItem.dataset.initialLeft;
                            curItem.dataset.isEnlargement = 'shrink';
                        }
                    
                    break;
            }
            
            
            
            /**
             * 采坑记：
             * 旋转 90 270 这些体位的时候 ，width和height得交换下位置
             * 下同
             */
            
            switch( Math.abs(rotateDeg % 360) ){
                case 0:
                case 180:
                    curItem.style.cssText = `
                            transform: rotateZ(${rotateDeg}deg); 
                            width: ${width}px;
                            height: ${height}px;
                            top: ${ curItem.dataset.top }px;
                            left: ${ curItem.dataset.left }px;
                    `
                    break;
                case 90:
                case 270:
                    curItem.style.cssText = `
                            transform: rotateZ(${rotateDeg}deg); 
                            height: ${width}px;
                            width: ${height}px;
                            left: ${ curItem.dataset.left }px;
                            top: ${ curItem.dataset.top }px;
                    `
                    ;
                    break;
                default:
                    break;
            }
            

        }else if( distaceBefore < distanceNow ){//放大
            
            curItem.dataset.isEnlargement = 'enlargement';

            switch( Math.abs(rotateDeg % 360) ){
                case 0:
                case 180:{
                    // biggest width for zoom in
                    let maxWidth = this.screenWidth * 4;
                    if( curItemWidth*(1+this.zoomScale) > maxWidth ){
                        this.isAnimating = false;
                        return;
                    }
                    curItem.dataset.top = (top - (this.zoomScale)*centerY ).toString();
                    curItem.dataset.left = (left - (this.zoomScale)*centerX ).toString();
                    curItem.style.cssText += `
                            width: ${curItemWidth*(1+this.zoomScale)}px;
                            height: ${curItemHeihgt*(1+this.zoomScale)}px;
                            top: ${ curItem.dataset.top }px;
                            left: ${ curItem.dataset.left }px;
                    `
                }
                    
                break;
                case 90:
                case 270:{
                    // biggest width for zoom in
                    let maxWidth = this.screenWidth * 4;
                    if( curItemHeihgt*(1+this.zoomScale) > maxWidth ){
                        this.isAnimating = false;
                        return;
                    }
                    curItem.dataset.top = (top - (this.zoomScale)*centerY ).toString();
                    curItem.dataset.left = (left - (this.zoomScale)*centerX ).toString();
                    curItem.style.cssText += `
                            height: ${curItemWidth*(1+this.zoomScale)}px;
                            width: ${curItemHeihgt*(1+this.zoomScale)}px;
                            left: ${ curItem.dataset.left }px;
                            top: ${ curItem.dataset.top }px;
                    `
                    ;
                }
                    
                break;
                default:
                    break;
            }
            
            

        }

        this.isAnimating = false;
    }
}