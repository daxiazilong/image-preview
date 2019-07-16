export default class ImgPreview{
    // 上次点击时间和执行单击事件的计时器
    public lastClick: number = -Infinity;
    public performerClick: any;
    public threshold: number;//阈值 手指移动超过这个值则切换下一屏幕
    public startX: number;//手指移动的起始坐标
    public touchStartX: number;
    public curIndex: number = 0;//当前第几个图片
    public imgContainerMoveX: number = 0;//图片容器x轴的移动距离
    public imgContainerMoveY: number = 0;//图片容器y轴的移动距离
    public screenWidth: number ;//屏幕宽度
    public imgsNumber: number = 4;//图片数量
    public step: number = 10; //动画每帧的位移

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
        this.touchStartX = this.startX = Math.round(e.touches[0].pageX);

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
            curItem.dataset.top = `0`;
            curItem.dataset.left = `0`;
        }

        
        
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

        const curItem: HTMLElement = this.imgItems[this.curIndex];
        const curImg: HTMLImageElement = curItem.querySelector('img');

        if( curItem.dataset.isEnlargement == 'enlargement' ){
            // 放大的时候的移动

        }else{
            //正常情况下的移动

        }
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
    handleToucnEnd(e: TouchEvent & MouseEvent){
        if( this.isAnimating ){
            return;
        } 
       
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
        el.style.transform = `translateX( ${start + step}px )`;
        start += step;
        
        let move = () => {
            if( Math.abs(end - start) < Math.abs(step) ){
                step = end - start;
            }
            el.style.transform = `translateX( ${start + step}px )`;
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