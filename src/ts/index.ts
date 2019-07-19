import { stat } from "fs";

export default class ImgPreview{
    // 上次点击时间和执行单击事件的计时器
    public lastClick: number = -Infinity;
    public performerClick: any;
    public threshold: number;//阈值 手指移动超过这个值则切换下一屏幕
    public startX: number;//手指移动时的x起始坐标
    public touchStartX: number;//手指第一次点击时的x起点坐标
    public startY: number;//手指移动时的y起始坐标
    public touchStartY: number; //手指第一次点击时的y起点坐标
    public curIndex: number = 0;//当前第几个图片
    public imgContainerMoveX: number = 0;//图片容器x轴的移动距离
    public imgContainerMoveY: number = 0;//图片容器y轴的移动距离
    public screenWidth: number ;//屏幕宽度
    public imgsNumber: number = 4;//图片数量
    public step: number = 10; //动画每帧的位移

    public curPoint1: { x: number, y: number };//双指缩放时的第一个点
    public curPoint2: { x: number, y: number };//双指缩放的第二个点

    public maxMoveX: number; // 滑动时的最大距离
    public minMoveX: number; // 滑动时的最小距离

    public isAnimating: boolean = false; // 是否在动画中

    public prefix:string = "__"
    public ref: HTMLElement ;
    public imgContainer: HTMLElement;
    public imgItems: NodeListOf < HTMLElement >;
    
    constructor( options: Object ){
        this.genFrame();
        
        this.screenWidth = this.ref.getBoundingClientRect().width;
        this.threshold = this.screenWidth / 4;
        this.imgContainer = this.ref.querySelector(`.${this.prefix}imgContainer`);
        this.imgItems = this.imgContainer.querySelectorAll(`.${this.prefix}item`)

        this.maxMoveX = this.screenWidth / 2;
        this.minMoveX = -this.screenWidth * (this.imgsNumber - 0.5);
        
        this.ref.addEventListener('touchstart',this.handleTouchStart.bind(this));
        this.ref.addEventListener('touchmove',this.handleMove.bind(this));
        this.ref.addEventListener('touchend',this.handleToucnEnd.bind(this));
    }
    handleTouchStart(e: TouchEvent & MouseEvent){
        switch( e.touches.length ){
            case 1:
                this.handleOneStart(e);
                break;
            case 2:
                this.handleTwoStart(e);
                break;
            default:
                break;
                
        }
        
    }
    handleOneStart(e: TouchEvent & MouseEvent ) :void{
        this.touchStartX = this.startX = Math.round(e.touches[0].pageX);
        this.touchStartY = this.startY = Math.round(e.touches[0].pageY);

        let now = (new Date()).getTime();

        if( now - this.lastClick < 500 ){
            /*
                启动一个定时器，如果双击事件发生后就
                取消单击事件的执行
             */
            clearTimeout( this.performerClick )
            this.handleDoubleClick(e);
            
        }else{
            this.performerClick = setTimeout(() => {
                this.handleClick(e);
            },500)
            
        }
        this.lastClick = (new Date()).getTime();
    }
    handleTwoStart(e: TouchEvent & MouseEvent ) :void{
        this.curPoint1 = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
        };
        this.curPoint2 = {
            x: e.touches[1].pageX,
            y: e.touches[1].pageY
        };
    }
    handleClick(e:MouseEvent){
        console.log('click')
    }
    handleDoubleClick(e: TouchEvent & MouseEvent){
        let mouseX: number = e.touches[0].pageX;
        let mouseY: number = e.touches[0].pageY;

        const curItem: HTMLElement = this.imgItems[this.curIndex];
        const curImg: HTMLImageElement = curItem.querySelector('img');

        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeight: number = curItem.getBoundingClientRect().height;


        let maxWidth: number ;
        if( curImg.naturalWidth > curItemWidth ){
            maxWidth = curImg.naturalWidth
        }else{
             maxWidth = curItemWidth
        }

        let maxHeight: number ;
        if( curImg.naturalHeight > curItemHeight ){
            maxHeight = curImg.naturalHeight;
        }else{
            maxHeight = curItemHeight;
        }

        let scaleX: number ;
        let scaleY: number ;
       if(curItem.dataset.isEnlargement == 'enlargement'){
            scaleX =  Number(curItem.dataset.initialWidth) / curItemWidth;
            scaleY = Number(curItem.dataset.initialHeight) / curItemHeight;
       }else{
            scaleX = maxWidth / curItemWidth;
            scaleY = maxHeight / curItemHeight;
       } ;
        if( scaleX > 1 ){//如果是放大，就把初始值保存下来
            curItem.dataset.initialWidth = curItemWidth.toString();
            curItem.dataset.initialHeight = curItemHeight.toString();

            curItem.style.cssText = `;
                                 transform: scale3d(${ scaleX },${ scaleY },1);
                                 transform-origin: ${ mouseX }px ${ mouseY }px;
                                `
        }else{
            curItem.style.cssText = `;
                                 top:${curItem.dataset.top}px;
                                 left:${curItem.dataset.left}px;
                                 width: ${maxWidth}px;
                                 height: ${maxHeight}px;
                                 transform: scale3d(${ scaleX },${ scaleY },1);
                                 transform-origin: ${ mouseX - Number(curItem.dataset.left) }px ${ mouseY - Number(curItem.dataset.top) }px;
                                `;
            curItem.dataset.top = '0';
            curItem.dataset.left = '0';
        }

        
        /**
         * 后续需要用width和height 以及定位实现
         * transform的模拟效果，因为transform不占据文档流
         * 当前放大的元素会与其他元素重叠
         */
        if( scaleX > 1 ){
            curItem.dataset.isEnlargement = 'enlargement';
            // 放大之后 图片相对视口位置不变
            let scaledX: number = mouseX * scaleX;
            let scaledY: number = mouseY * scaleY;
        
            setTimeout(() => {
                curItem.style.cssText = `;
                                    width: ${ maxWidth }px;
                                    height: ${ maxHeight }px;
                                    left: -${ scaledX -mouseX  }px;
                                    top: -${ scaledY - mouseY  }px;
                                    transition: none;
                                    `;
                curItem.dataset.top = `-${ scaledY - mouseY  }`;
                curItem.dataset.left = `-${ scaledX -mouseX  }`;
            },500)
        }else{
            curItem.dataset.isEnlargement = 'shrink';
            setTimeout(() => {
                curItem.style.cssText = `;
                                    transition: none;
                                    width: ${curItem.dataset.initialWidth}px;
                                    height: ${curItem.dataset.initialHeight}px;
                                    `
            },500)
        }

        
        
        

    }
    handleMove(e: TouchEvent & MouseEvent){

        clearTimeout( this.performerClick )
        if( this.isAnimating ){
            return;
        } 

        
        // 双指缩放时的处理
        if( e.touches.length == 2 ){
            
            this.handleZoom( e );
            return;
        }

        const curItem: HTMLElement = this.imgItems[this.curIndex];

        if( curItem.dataset.isEnlargement == 'enlargement' ){
            // 放大的时候的移动是查看放大后的图片
            this.handleMoveEnlage(e);
        }else{
            //正常情况下的移动是图片左右切换
            this.handleMoveNormal(e)
        }
        
        
    }
    handleZoom(e: TouchEvent & MouseEvent ) :void{
        if( !this.curPoint1 && !this.curPoint2 ){
            //双指开始滑动时 若起点还未初始化
            this.curPoint1 = {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY
            };
            this.curPoint2 = {
                x: e.touches[1].pageX,
                y: e.touches[1].pageY
            };
        }
        
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        const curImg: HTMLImageElement = curItem.querySelector('img');

        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeihgt: number = curItem.getBoundingClientRect().height;

        const distaceBefore: number = 
            Math.sqrt( Math.pow( this.curPoint1.x - this.curPoint2.x,2) + Math.pow( this.curPoint1.y - this.curPoint2.y,2) );

        const distanceNow: number = 
            Math.sqrt( Math.pow( e.touches[0].pageX - e.touches[1].pageX,2) + Math.pow( e.touches[0].pageY - e.touches[1].pageY,2) );
        
        const centerX: number = ( this.curPoint1.x + this.curPoint2.x ) / 2;
        const centerY: number = ( this.curPoint1.y + this.curPoint2.y ) / 2;
       
        this.curPoint1.x = e.touches[0].pageX;
        this.curPoint1.y = e.touches[0].pageY;
        this.curPoint2.x = e.touches[1].pageX;
        this.curPoint2.x = e.touches[1].pageY;

        
        if( distaceBefore > distanceNow ){//缩小

        }else if( distaceBefore < distanceNow ){//放大
            curItem.dataset.isEnlargement = 'enlargement';
            let top: number = Number(curItem.dataset.top) || 0;
            let left: number = Number(curItem.dataset.left) || 0;
            curItem.dataset.top = (top - (0.025)*centerY ).toString();
            curItem.dataset.left = (left - (0.025)*centerX ).toString();
            curItem.style.cssText += `
                    width: ${curItemWidth*1.025}px;
                    height: ${curItemHeihgt*1.025}px;
                    top: ${ curItem.dataset.top }px;
                    left: ${ curItem.dataset.left }px;
            `
            

        }


    }
    handleToucnEnd(e: TouchEvent & MouseEvent){
        if( this.isAnimating || e.touches.length !== 0 ){//动画正在进行时，或者不是单指操作时一律不处理
            return;
        } 
        
        if( e.changedTouches.length !== 1 ){
            
            return;
        }
        this.curPoint1 = undefined;
        this.curPoint2 = undefined;
        const curItem: HTMLElement = this.imgItems[this.curIndex];


        if( curItem.dataset.isEnlargement == 'enlargement' ){
            // 放大的时候
            this.handleTEndEnlarge(e);
        }else{
            //正常情况下的
            this.handleTEndEnNormal(e)
        }
       
        
    }
    handleTEndEnlarge ( e: TouchEvent & MouseEvent) : void{
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        const curImg: HTMLImageElement = curItem.querySelector('img');

        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeihgt: number = curItem.getBoundingClientRect().height;

        const maxTop: number = 0;
        const maxBottom: number = window.innerHeight - curItemHeihgt;
        const maxLeft: number = 0;
        const MaxRight: number = window.innerWidth - curItemWidth;

        const curItemTop: number  = Number(curItem.dataset.top);
        const curItemLeft: number  = Number(curItem.dataset.left);

        if( curItemTop > maxTop ){
            this.animate( curItem, 'top', curItemTop, 0, -this.step )
            curItem.dataset.top = "0"
        }
    }
    handleTEndEnNormal ( e: TouchEvent & MouseEvent) : void{
        console.log(e)
        let endX: number = Math.round(e.changedTouches[0].pageX);

        if(  endX - this.touchStartX >= this.threshold ){//前一张
            if( this.curIndex == 0){//第一张
                this.slideSelf();
                return;
            }
            this.curIndex--;
            this.slidePrev();
        }else if( endX - this.touchStartX <= -this.threshold ){//后一张
            if( this.curIndex + 1 == this.imgsNumber ){//最后一张
                this.slideSelf();
                return;
            }
            this.curIndex++;
            this.slideNext();
        }else{//复原
            this.slideSelf();
        }
    }
    slideNext(){
        let endX = -(this.curIndex * this.screenWidth);
        if( endX < -(this.screenWidth * this.imgsNumber - 1) ){
            endX = -(this.screenWidth * this.imgsNumber - 1);
            this.curIndex = this.imgsNumber -1 ;
        }
        this.animate( this.imgContainer, 'transform',this.imgContainerMoveX, endX, -this.step )
    }
    slidePrev(){
        let endX = -(this.curIndex * this.screenWidth);
        if( endX > 0 ){
            endX = 0;
            this.curIndex = 0;
        }
        this.animate( this.imgContainer, 'transform',this.imgContainerMoveX, endX, this.step )
    }
    slideSelf(){
 
        let endX = -(this.curIndex * this.screenWidth);
        if( endX < this.imgContainerMoveX ){
            this.animate( this.imgContainer, 'transform',this.imgContainerMoveX, endX, -this.step )
        }else{
            this.animate( this.imgContainer, 'transform',this.imgContainerMoveX, endX, this.step )
        }
        
    }
    handleMoveNormal( e: TouchEvent & MouseEvent ){
        let curX: number = Math.round(e.touches[0].pageX);

        let offset = curX - this.startX;
        this.imgContainerMoveX += offset;
        if( this.imgContainerMoveX > this.maxMoveX  ){
            this.imgContainerMoveX = this.maxMoveX;
        }else if( this.imgContainerMoveX < this.minMoveX ){
            this.imgContainerMoveX = this.minMoveX;
        }
        this.startX = curX;

        this.imgContainer.style.transform = `translateX(${ this.imgContainerMoveX }px)`
    }
    handleMoveEnlage( e: TouchEvent & MouseEvent ){
        
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        const curImg: HTMLImageElement = curItem.querySelector('img');

        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeihgt: number = curItem.getBoundingClientRect().height;

        let curX: number = Math.round(e.touches[0].pageX);
        let curY: number = Math.round(e.touches[0].pageY);

        let offsetX: number  = curX - this.startX;
        let offsetY: number  = curY - this.startY;

        const curItemTop: number  = Number(curItem.dataset.top);
        const curItemLeft: number  = Number(curItem.dataset.left);

        

        let curTop: number = curItemTop + offsetY;

        curItem.style.cssText += `
            top: ${curTop}px;
            left: ${ curItemLeft + offsetX }px;
        `
        curItem.dataset.top = (curTop).toString();
        curItem.dataset.left = (curItemLeft + offsetX).toString();
        this.startX = curX;
        this.startY = curY;

        

    }
    animate(
        el: HTMLElement,
        prop: string,
        start: number,
        end: number,
        step: number
    ){
        if( this.isAnimating ){
            return;
        } 
        this.isAnimating = true;
        if( Math.abs(end - start) < Math.abs(step) ){
            step = end - start;
        }
        function processStyle(){
            switch( prop ){
                case 'transform':
                        el.style.transform = `translateX( ${start + step}px )`;;
                        break;
                case 'top':
                    el.style.top = `${start + step}px`;
                    break;
                default:
                    break;
            }
        }
        
        processStyle();
        start += step;
        
        let move = () => {
            if( Math.abs(end - start) < Math.abs(step) ){
                step = end - start;
            }
            processStyle();
            start += step;
            if( start !== end ){
                requestAnimationFrame(move)
            }else{
                this.imgContainerMoveX = end;
                this.isAnimating = false;
            }
        }

        this.handleReausetAnimate();//requestAnimationFrame兼容性

        if( start !== end ){
                requestAnimationFrame(move)
        }else{
            this.imgContainerMoveX = end;
            this.isAnimating = false;
        }

        

    }
    genFrame(){
        let html : string = `
            <div class="${this.prefix}imagePreviewer">
                <svg class="${this.prefix}close" t="1563161688682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5430"><path d="M10.750656 1013.12136c-13.822272-13.822272-13.822272-36.347457 0-50.169729l952.200975-952.200975c13.822272-13.822272 36.347457-13.822272 50.169729 0 13.822272 13.822272 13.822272 36.347457 0 50.169729l-952.200975 952.200975c-14.334208 14.334208-36.347457 14.334208-50.169729 0z" fill="#ffffff" p-id="5431"></path><path d="M10.750656 10.750656c13.822272-13.822272 36.347457-13.822272 50.169729 0L1013.633296 963.463567c13.822272 13.822272 13.822272 36.347457 0 50.169729-13.822272 13.822272-36.347457 13.822272-50.169729 0L10.750656 60.920385c-14.334208-14.334208-14.334208-36.347457 0-50.169729z" fill="#ffffff" p-id="5432"></path></svg>
                <div class="${this.prefix}imgContainer">
                    <div class="${this.prefix}item">
                        <img src="/testImage/main_body3.png">
                    </div>
                    <div class="${this.prefix}item">
                        <img src="/testImage/main_body3.png">
                    </div>
                    <div class="${this.prefix}item">
                        <img src="/testImage/main_body3.png">
                    </div>
                    <div class="${this.prefix}item">
                        <img src="/testImage/more20190627.png">
                    </div>
                </div>
            </div>
        `;
        let style: string =`
            .${this.prefix}imagePreviewer{
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,1);
                color:#fff;
                transform: translate3d(0,0,0);
            }
            .${this.prefix}imagePreviewer .${this.prefix}close{
                position: absolute;
                top:20px;
                right:20px;
                width: 22px;
                height: 22px;
            }
            .${this.prefix}imagePreviewer ${this.prefix}.close.${this.prefix}scroll{
                height: 0;
            }
            .${this.prefix}imagePreviewer .${this.prefix}imgContainer{
                position: relative;
                height: 100%;
                font-size: 0;
                white-space: nowrap;
            }
            .${this.prefix}imagePreviewer .${this.prefix}imgContainer .${this.prefix}item{
                position: relative;
                display:inline-block;
                width: 100%;
                height: auto;
                font-size: 14px;
                white-space: normal;
                transition: transform 0.5s;
            }
            .${this.prefix}item img{
                width: 100%;
                height: auto;
            }
        `;
        this.ref = document.createElement('div');
        this.ref.innerHTML = html;

        let styleElem = document.createElement('style');
        styleElem.innerHTML = style;

        document.querySelector('head').appendChild(styleElem);
        document.body.appendChild( this.ref )
    }
    handleReausetAnimate(){
        if(!window['requestAnimationFrame']){
            window['requestAnimationFrame'] = (function(){
            return  window['webkitRequestAnimationFrame'] ||
                    function( callback: Function ){
                        window.setTimeout(callback, 1000 / 60);
                        return 0;
                    };
            })();
        }
        
    }
}