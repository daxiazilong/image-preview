/**
 * image-preview 1.0.1
 * author:zilong
 * https://github.com/daxiazilong
 * Released under the MIT License
 */
enum client{
    pc = "pc",
    mobile = 'mobile'
}
export class ImagePreview{
    [key:string]: any;
    public showTools: boolean  = true;
    public lastClick: number = -Infinity;// 上次点击时间和执行单击事件的计时器
    public performerClick: any;// 单击事件执行计时器
    public threshold: number;//阈值 手指移动超过这个值则切换到下一屏
    public startX: number;//手指移动时的x起始坐标
    public touchStartX: number;//手指第一次点击时的x起点坐标
    public startY: number;//手指移动时的y起始坐标
    public touchStartY: number; //手指第一次点击时的y起点坐标
    public curIndex: number = 0;//当前第几个图片
    public imgContainerMoveX: number = 0;//图片容器x轴的移动距离
    public imgContainerMoveY: number = 0;//图片容器y轴的移动距离
    public screenWidth: number = window.innerWidth;//屏幕宽度
    public imgsNumber: number ;//图片数量
    public slideTime: number = 300; //切换至下一屏幕时需要的时间
    public zoomScale: number = 0.05;//缩放比例
    public isZooming: boolean = false; //是否在进行双指缩放

    public curPoint1: { x: number, y: number };//双指缩放时的第一个点
    public curPoint2: { x: number, y: number };//双指缩放的第二个点
    
    public curStartPoint1: { x: number, y: number };//双指缩放时的第一个起点
    public curStartPoint2: { x: number, y: number };//双指缩放的第二个起点

    public maxMoveX: number; // 滑动时的最大距离
    public minMoveX: number; // 滑动时的最小距离

    public isAnimating: boolean = false; // 是否在动画中
    public isMotionless: boolean = true;// 是否没有产生位移，用于左右切换图片或者拖动放大之后的图片
    public isEnlargeMove: boolean = false;// 大图下得切屏

    public prefix:string = "__"
    public ref: HTMLElement ;
    public imgContainer: HTMLElement;
    public imgItems: NodeListOf < HTMLElement >;
    public defToggleClass: string = 'defToggleClass';

    public movePoints: Array< {x:number,y:number} > = [];//收集移动点，判断滑动方向
    public fingerDirection: string = '';//当前手指得移动方向
    public performerRecordMove: any;

    public moveStartTime: number = 0;
    public moveEndTime: number = 0;

    public operateMaps: {
        [key: string]: string
    } = {
        rotateLeft: 'handleRotateLeft',
        rotateRight: 'handleRotateRight'
    }

    public envClient:client;
    
    constructor( 
        public options: {
            curImg?: string,
            imgs?:Array<string>,
            selector ?: string
        }
    ){
        if( options.selector ){
            this.bindTrigger();
        }

        this.envClient = this.testEnv();

        this.genFrame();
        this.handleReausetAnimate();//requestAnimationFrame兼容性

        this.threshold = this.screenWidth / 4;
        this.imgContainer = this.ref.querySelector(`.${this.prefix}imgContainer`);
        this.imgItems = this.imgContainer.querySelectorAll(`.${this.prefix}item`);
        this[this.envClient + 'RecordInitialData' ](this.imgItems);
        
        this.maxMoveX = this.screenWidth / 2;
        this.minMoveX = -this.screenWidth * (this.imgsNumber - 0.5);
        
        this[this.envClient + 'Initial' ]();

        
        
    }
    pcInitial(){
        this.ref.addEventListener('click',this.handlePcClick.bind(this));
        this.ref.querySelector(`.${this.prefix}close`).addEventListener('click',this.close.bind(this))
        let timer;
        window.addEventListener('resize', (e) => {
            clearTimeout(timer)
            setTimeout( ()=> {
                this.screenWidth = window.innerWidth;
                let index = this.curIndex ;
                this.imgContainerMoveX = -index * this.screenWidth;

                this.imgContainer.style.left = `${this.imgContainerMoveX}px`;
            },17)
        })
    }
    mobileInitial(){
        this.ref.addEventListener('touchstart',this.handleTouchStart.bind(this));
        this.ref.addEventListener('touchmove',this.handleMove.bind(this));
        this.ref.addEventListener('touchend',this.handleToucnEnd.bind(this));
        this.ref.querySelector(`.${this.prefix}close`).addEventListener('touchstart',this.close.bind(this))
    }
    bindTrigger(){
        let images: Array<string> = [];
        let triggerItems: NodeListOf < HTMLElement > = document.querySelectorAll( this.options.selector )
        if( !triggerItems.length ){
            // some operate
        }
        triggerItems.forEach( (element,index) => {
            images.push( element.dataset.src );
        })

        this.options.curImg = images[0];
        this.options.imgs = images;

        let imgPreviewer = this;
        triggerItems.forEach( (element,index) => {
            
            element.addEventListener('click',function(e){
                imgPreviewer.show(index)
            })
        })
        
    }
    mobileRecordInitialData( els:  NodeListOf < HTMLElement > ){
        /**
         * 记录并设置初始top，left值
         */
        let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
        let imgContainerHeight: number = imgContainerRect.height;
    
        els.forEach( ( el,key,parent) => {
            const img: HTMLImageElement = el.querySelector('img');
            const imgRect: ClientRect = img.getBoundingClientRect();
            if( img.complete ){
                let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
                let imgContainerHeight: number = imgContainerRect.height;
                let imgContainerWidth: number = imgContainerRect.width;
                let styleObj: ClientRect = el.getBoundingClientRect();
                if( imgContainerHeight < styleObj.height ){
                    el.style.cssText = `
                        height: 100%;
                        width: auto;
                    `;
                    img.style.cssText = `
                        height: 100%;
                        width: auto;
                    `;
                }
                
                styleObj = el.getBoundingClientRect();
                const top: number = (imgContainerHeight - styleObj.height) / 2;
                const left: number = (imgContainerWidth - styleObj.width) / 2;

                el.dataset.initialWidth = styleObj.width.toString();
                el.dataset.initialHeight =  styleObj.height.toString();
                el.dataset.top = top.toString();
                el.dataset.initialTop = top.toString();
                el.dataset.left = left.toString();
                el.dataset.initialLeft = left.toString();
                el.dataset.viewTopInitial = styleObj.top.toString();
                el.dataset.viewLeftInitial = styleObj.left.toString();
                el.dataset.loaded = "true";

                el.style.top = `${top}px`;
                el.style.left=`${left}px`;
            }else{
                el.dataset.loaded = "false";
                img.onload = (function(el){
                    
                    return function(){
                        
                        let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
                        let imgContainerHeight: number = imgContainerRect.height;
                        let imgContainerWidth: number = imgContainerRect.width;
                        let styleObj: ClientRect = el.getBoundingClientRect();
                        if( imgContainerHeight < styleObj.height ){
                            el.style.cssText = `
                                height: 100%;
                                width: auto;
                            `;
                            img.style.cssText = `
                                height: 100%;
                                width: auto;
                            `;
                        }
                        
                        styleObj = el.getBoundingClientRect();
                        const top: number = (imgContainerHeight - styleObj.height) / 2;
                        const left: number = (imgContainerWidth - styleObj.width) / 2;

                        el.dataset.initialWidth = styleObj.width.toString();
                        el.dataset.initialHeight =  styleObj.height.toString();
                        el.dataset.top = top.toString();
                        el.dataset.initialTop = top.toString();
                        el.dataset.left = left.toString();
                        el.dataset.initialLeft = left.toString();
                        el.dataset.viewTopInitial = styleObj.top.toString();
                        el.dataset.viewLeftInitial = styleObj.left.toString();
                        el.dataset.loaded = "true";

                        el.style.top = `${top}px`;
                        el.style.left=`${left}px`;

                    }
                    
                })(el).bind(this)
                img.onerror=(function(el){
                    return function(e: Event ){
                        
                        let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
                        let imgContainerHeight: number = imgContainerRect.height;
                        const styleObj: ClientRect = el.getBoundingClientRect();

                        const top: number = (imgContainerHeight - styleObj.height) / 2;

                        el.dataset.initialWidth = styleObj.width.toString();
                        el.dataset.initialHeight =  styleObj.height.toString();
                        el.dataset.top = top.toString();
                        el.dataset.initialTop = top.toString();
                        
                        el.dataset.loaded = "false";

                        el.style.top = `${top}px`;
                      
                        (<HTMLImageElement>(e.currentTarget)).alt = "图片加载错误"
                    }
                })(el).bind(this)
            }
            
            

        })

    }
    pcRecordInitialData( els:  NodeListOf < HTMLElement > ){
        /**
         * 记录并设置初始top，left值
         */
        let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
        let imgContainerHeight: number = imgContainerRect.height;
    
        els.forEach( ( el,key,parent) => {
            const img: HTMLImageElement = el.querySelector('img');
            if( img.complete ){
                let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
                let styleObj: ClientRect = el.getBoundingClientRect();
               
                
                styleObj = el.getBoundingClientRect();
                const top: number = 0;
                const left: number = 0;

                el.dataset.initialWidth = styleObj.width.toString();
                el.dataset.initialHeight =  styleObj.height.toString();
                el.dataset.top = top.toString();
                el.dataset.initialTop = top.toString();
                el.dataset.left = left.toString();
                el.dataset.initialLeft = left.toString();
                el.dataset.viewTopInitial = styleObj.top.toString();
                el.dataset.viewLeftInitial = styleObj.left.toString();
                el.dataset.loaded = "true";

                el.style.top = `${top}px`;
                el.style.left=`${left}px`;
            }else{
                el.dataset.loaded = "false";
                img.onload = (function(el){
                    
                    return function(){
                        

                        let styleObj: ClientRect = el.getBoundingClientRect();
                        
                        styleObj = el.getBoundingClientRect();
                        const top: number = 0;
                        const left: number = 0;

                        el.dataset.initialWidth = styleObj.width.toString();
                        el.dataset.initialHeight =  styleObj.height.toString();
                        el.dataset.top = top.toString();
                        el.dataset.initialTop = top.toString();
                        el.dataset.left = left.toString();
                        el.dataset.initialLeft = left.toString();
                        el.dataset.viewTopInitial = styleObj.top.toString();
                        el.dataset.viewLeftInitial = styleObj.left.toString();
                        el.dataset.loaded = "true";

                        el.style.top = `${top}px`;
                        el.style.left=`${left}px`;

                    }
                    
                })(el).bind(this)
                img.onerror=(function(el){
                    return function(e: Event ){
                        
                        let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
                        let imgContainerHeight: number = imgContainerRect.height;
                        const styleObj: ClientRect = el.getBoundingClientRect();

                        const top: number = (imgContainerHeight - styleObj.height) / 2;

                        el.dataset.initialWidth = styleObj.width.toString();
                        el.dataset.initialHeight =  styleObj.height.toString();
                        el.dataset.top = top.toString();
                        el.dataset.initialTop = top.toString();
                        
                        el.dataset.loaded = "false";

                        el.style.top = `${top}px`;
                      
                        (<HTMLImageElement>(e.currentTarget)).alt = "图片加载错误"
                    }
                })(el).bind(this)
            }
            
            

        })

    }
    handlePcClick(e:  MouseEvent): void{
        /**
         * 这里把操作派发
         */

        const type : string = (<HTMLElement>(e.target)).dataset.type;
    
        if( this.operateMaps[type] ){
            this[this.operateMaps[type]](e);
            return
        }
    }
    handleTouchStart(e: TouchEvent & MouseEvent){
        // preventDefault is very import, because if not do this, we will get 
        // an error last-Click-Time on wx.
        e.preventDefault();
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
    handleTwoStart(e: TouchEvent & MouseEvent ) :void{

        this.curPoint1 = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        this.curPoint2 = {
            x: e.touches[1].clientX,
            y: e.touches[1].clientY
        };
    }
    handleOneStart(e: TouchEvent & MouseEvent ) :void{
        /**
         * 这里把操作派发
         */

        const type : string = (<HTMLElement>(e.target)).dataset.type;
    
        if( this.operateMaps[type] ){
            this[this.operateMaps[type]](e);
            return
        }
        this.touchStartX = this.startX = Math.round(e.touches[0].clientX);
        this.touchStartY = this.startY = Math.round(e.touches[0].clientY);
        
        if( (new Date()).getTime() - this.lastClick < 300 ){
            /*
                启动一个定时器，如果双击事件发生后就
                取消单击事件的执行
             */
            clearTimeout( this.performerClick )
            this.handleDoubleClick(e);
        }else{
            this.performerClick = setTimeout(() => {
                this.handleClick(e);
            },300)
            
        }

        this.lastClick = (new Date()).getTime();
        this.getMovePoints(e);
    }
    handleRotateLeft(e: TouchEvent & MouseEvent ) :void{
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        let rotateDeg:number;
        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        if( curItem.dataset.rotateDeg ){
            rotateDeg = Number(curItem.dataset.rotateDeg)
        }else{
            rotateDeg = 0
        }
        rotateDeg -= 90;
        this.isAnimating = true;
        curItem.style.cssText += `
            transition: transform 0.5s;
            transform: rotateZ( ${rotateDeg}deg );
        `;
        
        
        setTimeout(()=>{
            curItem.dataset.rotateDeg = rotateDeg.toString();
        
            this.isAnimating = false;
        },550)

    }
    handleRotateRight(e: TouchEvent & MouseEvent ) :void{
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        let rotateDeg:number;

        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }

        if( curItem.dataset.rotateDeg ){
            rotateDeg = Number(curItem.dataset.rotateDeg)
        }else{
            rotateDeg = 0
        }
        rotateDeg += 90;
        this.isAnimating = true;

        curItem.style.cssText += `
            transition: transform 0.5s;
            transform: rotateZ( ${rotateDeg}deg );
        `
        setTimeout(()=>{
            curItem.dataset.rotateDeg = rotateDeg.toString();
            
            this.isAnimating = false;
        },550)
    }
    
    handleClick(e ? :TouchEvent & MouseEvent){
        let close: HTMLElement = <HTMLElement> (this.ref.querySelector(`.${this.prefix}close`));
        let bottom: HTMLElement = <HTMLElement>(this.ref.querySelector(`.${this.prefix}bottom`));
        this.showTools = !this.showTools

        if( this.showTools ){
            close.style.display = 'block';
            bottom.style.display = 'block';
        }else{
            close.style.display = 'none';
            bottom.style.display = 'none';
        }
    }
    handleDoubleClick(e: TouchEvent & MouseEvent){
        if( this.isAnimating ) return;
        this.isAnimating = true;

        const curItem: HTMLElement = this.imgItems[this.curIndex];
        const curImg: HTMLImageElement = curItem.querySelector('img');

        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            this.isAnimating = false;
            return;
        }
        
        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeight: number = curItem.getBoundingClientRect().height;

        let rotateDeg: number = Number(curItem.dataset.rotateDeg || '0');

        let toWidth: number ;
        let toHeight: number ;

        if( Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270 ){
            if( curImg.naturalWidth > curItemHeight ){
                toWidth = curImg.naturalHeight
            }else{
                toWidth = curItemHeight
            }
            if( curImg.naturalHeight > curItemWidth ){
                toHeight = curImg.naturalWidth;
            }else{
                toHeight = curItemWidth;
            }
        }else{
            if( curImg.naturalWidth > curItemWidth ){
                toWidth = curImg.naturalWidth
            }else{
                toWidth = curItemWidth
            }
            if( curImg.naturalHeight > curItemHeight ){
                toHeight = curImg.naturalHeight;
            }else{
                toHeight = curItemHeight;
            }
        }
        
        let scaleX: number ;
        let scaleY: number ;

        let isBigSize = curItem.dataset.isEnlargement == "enlargement";

       if( isBigSize ){//当前浏览元素为大尺寸时执行缩小操作，小尺寸执行放大操作
        switch( Math.abs(rotateDeg % 360) ){
            case 0:
            case 180:
                scaleX =  Number(curItem.dataset.initialWidth) / curItemWidth;
                scaleY = Number(curItem.dataset.initialHeight) / curItemHeight;
                break;
            case 90:
            case 270:
                scaleX =  Number(curItem.dataset.initialWidth) / curItemHeight;
                scaleY = Number(curItem.dataset.initialHeight) / curItemWidth;
                break;
            default:
                break;
        }
            
       }else{

        scaleX = toWidth / curItemWidth;
        scaleY = toHeight / curItemHeight;  
            
       } ;
       

        if( scaleX > 1 && scaleY > 1 ){//放大

            this.setToNaturalImgSize( scaleX,scaleY,e);  
            
        }else if( scaleX < 1 && scaleY < 1 ){ 
            this.setToInitialSize( scaleX,scaleY,e);
        }else{
            this.isAnimating = false;
        }
    }
    setToNaturalImgSize( scaleX: number , scaleY: number,e: TouchEvent & MouseEvent) :void{
        /**
         * 踩坑记
         * transform-origin 的参考点始终时对其初始位置来说的
         * scale之后的元素, 实际的偏移路径等于 translate 的位移等于 位移 * scale
         */
        let mouseX: number = e.touches[0].clientX;
        let mouseY: number = e.touches[0].clientY;

        const curItem: HTMLElement = this.imgItems[this.curIndex];
        const curImg: HTMLImageElement = curItem.querySelector('img');

        // 以下为旋转之后缩放时需要用到的参数
        const curItemViewTop: number = curItem.getBoundingClientRect().top;//当前元素距离视口的top
        const curItemViewLeft: number = curItem.getBoundingClientRect().left;//当前元素距离视口的left

        const curItemTop: number = Number(curItem.dataset.top) || 0;
        const curItemLeft: number = Number(curItem.dataset.left) || 0;

        let rotateDeg: number = Number(curItem.dataset.rotateDeg || '0');

        const centerX: number =  Number(curItem.dataset.initialWidth) / 2;
        const centerY: number = Number(curItem.dataset.initialHeight) / 2;

        let toWidth: number ;
        let toHeight: number ;

        if( Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270 ){
                toWidth = curImg.naturalHeight
                toHeight = curImg.naturalWidth;
        }else{
            toWidth = curImg.naturalWidth
            toHeight = curImg.naturalHeight;
        }
       

        switch( rotateDeg % 360 ){
            case 0:
                curItem.style.cssText = `;
                    top:${curItemTop}px;
                    left:${curItemLeft}px;
                    transform-origin: ${ centerX }px ${ centerY }px;
                    transform: 
                        rotateZ(${rotateDeg}deg) 
                        scale3d(${ scaleX },${ scaleY },1) 
                        translateY(${ ( -(mouseY - curItemViewTop - centerY) * (scaleY -1 ) ) / scaleY }px) 
                        translateX(${ ( -(mouseX - curItemViewLeft- centerX) * (scaleX-1 ) ) / scaleX   }px) 
                    ;
                `;
                break;
            case -180:
            case 180:
                curItem.style.cssText = `;
                    top:${curItemTop}px;
                    left: ${curItemLeft}px;
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
                 * 以 y轴偏移距离，因为旋转 -90或270度之后，
                 * y轴的位移实际又translateX控制，所以需要translateX控制其偏移
                 * (mouseY - curItemViewTop - centerX) * (scaleX -1 ) 是一个点缩放前后产生的位移偏差
                 * 再除以scaleX是因为啥呢，是因为上边可能讲过 translate x px 实际效果是 x * scaleX 的大小
                 */
                curItem.style.cssText = `;
                    top: ${curItemTop}px;
                    left: ${curItemLeft}px;
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
            //- ( mouseY - curItemTop ) * (scaleY - 1) - curItemTop)
            // = curItemTop -  (mouseY - curItemTop)  * (scaleY - 1)   ;
            // = curItemTop - ( mouseY- curItemTop)*scaleY + (mouseY - curItemTop)   
            // = mouseY - ( mouseY- curItemTop)*scaleY
            //  = - (scaledY - mouseY)
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
    handleMove(e: TouchEvent & MouseEvent){
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
    handleMoveNormal( e: TouchEvent & MouseEvent ){
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
    handleMoveEnlage( e: TouchEvent & MouseEvent ){
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
    handleToucnEnd(e: TouchEvent & MouseEvent){
        e.preventDefault();
        this.movePoints = [];//重置收集手指移动时要收集得点
        this.performerRecordMove = 0;//重置收集收支移动点的计时器
        if( e.touches.length == 0 && this.isZooming){//重置是否正在进行双指缩放操作
            // someOperate;
            this.isZooming = false;
        }

        //动画正在进行时，或者不是单指操作时,或者根本没有产生位移，一律不处理
        if( this.isAnimating || e.changedTouches.length !== 1 || this.isMotionless ){
            
            return;
        }   
        const type : string = (<HTMLElement>(e.target)).dataset.type;
    
        if( this.operateMaps[type] ){
            return
        }


        const curItem: HTMLElement = this.imgItems[this.curIndex];

        this.isMotionless = true;
        this.isEnlargeMove = false;

        
        let isBoundary: boolean = curItem.dataset.toLeft == 'true' || curItem.dataset.toRight == 'true';
  
        if( curItem.dataset.isEnlargement == 'enlargement' ){
            // 放大的时候,如果到达边界还是进行正常的切屏操作
            // for long-img operate it solely
            if( isBoundary ){
                // 重置是否已到达边界的变量,如果容器内能容纳图片则不需要重置
                const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
                const conWidth: number = imgContainerRect.width;

                const curItemViewLeft: number = curItem.getBoundingClientRect().left;
                const curItemViewRight: number = curItem.getBoundingClientRect().right;
                
                if( curItemViewLeft < 0 || curItemViewRight > conWidth ){
                    curItem.dataset.toLeft = 'false';
                    curItem.dataset.toRight = 'false';
                    this.handleTEndEnNormal(e);

                }else{
                    if( this.fingerDirection == 'vertical'){
                        this.handleTEndEnlarge(e);
                    }else if( this.fingerDirection == 'horizontal'){
                        this.handleTEndEnNormal(e);

                    }
                }
                
            }else{
                this.handleTEndEnlarge(e);
            }
            
        }else{
            //正常情况下的
            this.handleTEndEnNormal(e)
        }
        this.fingerDirection = '';
       
        
    }
    handleTEndEnlarge ( e: TouchEvent & MouseEvent) : void{
        
        const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;
        const conHeight: number = imgContainerRect.height;

        const curItem: HTMLElement = this.imgItems[this.curIndex];
        const curImg: HTMLImageElement = curItem.querySelector('img');

        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeihgt: number = curItem.getBoundingClientRect().height;
        const curItemViewLeft: number = curItem.getBoundingClientRect().left;
        const curItemViewRight: number = curItem.getBoundingClientRect().right;
        /**
         * 旋转后会产生偏移值
         */
        let offsetX: number = 0;
        let offsetY:number = 0;

        let rotateDeg: number = Number(curItem.dataset.rotateDeg || '0');

        switch( Math.abs(rotateDeg % 360) ){
            case 90:
            case 270:
                /**
                 * 以x轴为例子
                 * curItemWidth / 2,为中心点的坐标，
                 * curitemHeight / 2,是顶部距离中心点的坐标
                 * 二者的差值即为x轴的偏移
                 */
                offsetX = (curItemWidth - curItemHeihgt )/ 2 ;
                offsetY = (curItemHeihgt - curItemWidth) / 2;
                break;
            default: 
                break;
        }

        const maxTop: number = offsetY;
        const minTop: number = conHeight - curItemHeihgt + offsetY;
        const maxLeft: number = offsetX;
        const minLeft: number = conWidth - curItemWidth + offsetX;

        const curItemTop: number  = Number(curItem.dataset.top);
        const curItemLeft: number  = Number(curItem.dataset.left);

        /**
         * 1s 60 次 
         * 我需要在0.3s 完成这项操作
         * 
         */
        
        let recoverY: boolean = false;
        let recoverX: boolean = false;

        let vy: number;
        let stepY: number;

        let vx: number;
        let stepX: number;

        let startX: number;
        let endX: number;

        let startY: number;
        let endY:number;

        if( curItemLeft > maxLeft ){
           
            stepX = this.computeStep( curItemLeft - maxLeft, this.slideTime);
            startX = curItemLeft;
            endX = maxLeft;

            recoverX = true;
            
        }else if( curItemLeft < minLeft ){
    
            stepX = this.computeStep( curItemLeft - minLeft, this.slideTime);
            startX = curItemLeft;
            endX = minLeft;
            
            recoverX = true;
            
        }

        if( curItemTop > maxTop ){
         
            stepY = this.computeStep( ( curItemTop - maxTop),this.slideTime );

            startY = curItemTop;
            endY = maxTop;
            recoverY = true;
           
        }else if( curItemTop < minTop ){
            
            stepY = this.computeStep( ( curItemTop - minTop),this.slideTime );

            startY = curItemTop;
            endY = minTop;
            recoverY = true;
            
        }

        // 如果容器内能完整展示图片就不需要移动至边界
        if( curItemViewLeft >= 0 && curItemViewRight <= conWidth ){
        
            recoverX = false;
            curItem.dataset.toLeft = 'true';
            curItem.dataset.toRight = 'true';
        }
        if( curItemHeihgt <= conHeight){
            recoverY = false;
            curItem.dataset.toTop = 'true';
            curItem.dataset.toBottom = 'true';
        }
        
        if( recoverX && recoverY ){
            this.animateMultiValue(curItem,[
                {
                    prop: 'left',
                    start: startX,
                    end: endX,
                    step: -stepX
                },{
                    prop:'top',
                    start: startY,
                    end: endY,
                    step: -stepY
                }
            ])
            curItem.dataset.left = `${endX}`;
            curItem.dataset.top = `${endY}`;
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
        }else if( recoverX ){
            this.animate( curItem, 'left', startX, endX, -stepX );
            curItem.dataset.left = `${endX}`;

            if( endX == maxLeft ){
                //toLeft 即为到达左边界的意思下同
                curItem.dataset.toLeft = 'true';
                curItem.dataset.toRight = 'false';
                
            }else if( endX == minLeft ){
                curItem.dataset.toLeft = 'false';
                curItem.dataset.toRight = 'true';
            }
        }else if( recoverY ){
            this.animate( curItem, 'top', startY, endY, -stepY );
            curItem.dataset.top = `${endY}`;
            if( endY == maxTop ){
                curItem.dataset.toTop = 'true';
                curItem.dataset.toBottom = 'false';
            }else if( endY == minTop ){
                curItem.dataset.toTop = 'false';
                curItem.dataset.toBottom = 'true';
            }
        }else{
            // 如果容器内能完整展示图片就不需要移动至边界
            if( curItemViewLeft >= 0 && curItemViewRight <= conWidth ){
                curItem.dataset.toLeft = 'true';
                curItem.dataset.toRight = 'true';
            }else{
                curItem.dataset.toLeft = 'false';
                curItem.dataset.toRight = 'false';
            }
            
            curItem.dataset.toTop = 'false';
            curItem.dataset.toBottom = 'false';

            this.moveEndTime = (new Date).getTime();
            let endPoint:{x:number,y:number} = {
                x: this.startX,
                y: this.startY
            };
            let startPoint: { x:number,y:number } = {
                x: this.touchStartX,
                y: this.touchStartY
            };


            let dx: number = endPoint.x - startPoint.x;
            let dy:number = endPoint.y - startPoint.y;

            let degree: number = Math.atan2(dy, dx) * 180 / Math.PI;
            let touchTime = this.moveEndTime - this.moveStartTime;
            // 手指移动时间较短的时候，手指离开屏幕时，会滑动一段时间
            // 上边确定的degree时以y轴上半轴 从0 - 180 变化，y轴下半轴从 0 - -180变化
            if( touchTime < 90 ){
                let boundryObj = {maxTop,minTop,maxLeft,minLeft}
                this.autoMove( curItem,degree,curItemLeft,curItemTop,boundryObj)
            }

        }
        this.moveStartTime = 0;


    }
    handleTEndEnNormal ( e: TouchEvent & MouseEvent) : void{
        let endX: number = Math.round(e.changedTouches[0].clientX);

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
    autoMove(curItem:HTMLElement,deg: number,startX:number,startY:number,{maxTop,minTop,maxLeft,minLeft}):void{
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
    slideNext(){
        let endX = -(this.curIndex * this.screenWidth);
        if( endX < -(this.screenWidth * this.imgsNumber - 1) ){
            endX = -(this.screenWidth * this.imgsNumber - 1);
            this.curIndex = this.imgsNumber -1 ;
        }
        let step: number = this.computeStep( Math.abs( endX - this.imgContainerMoveX ),this.slideTime )
        this.animate( this.imgContainer, 'transform',this.imgContainerMoveX, endX, -step )
    }
    slidePrev(){
        let endX = -(this.curIndex * this.screenWidth);
        if( endX > 0 ){
            endX = 0;
            this.curIndex = 0;
        }
        let step: number = this.computeStep( Math.abs( endX - this.imgContainerMoveX ),this.slideTime )
        this.animate( this.imgContainer, 'transform',this.imgContainerMoveX, endX, step )
    }
    slideSelf(){
 
        let endX = -(this.curIndex * this.screenWidth);
        if( endX < this.imgContainerMoveX ){
            let step: number = this.computeStep( Math.abs( endX - this.imgContainerMoveX ),this.slideTime )
            this.animate( this.imgContainer, 'transform',this.imgContainerMoveX, endX, -step )
        }else{
            let step: number = this.computeStep( Math.abs( endX - this.imgContainerMoveX ),this.slideTime )
            this.animate( this.imgContainer, 'transform',this.imgContainerMoveX, endX, step )
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
        function processStyle(){
            switch( prop ){
                case 'transform':
                        el.style.left = ` ${start + step}px`;;
                        break;
                case 'top':
                    el.style.top = `${start + step}px`;
                    break;
                case 'left':
                    el.style.left = `${start + step}px`;
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
                if( prop == 'transform'){
                    this.imgContainerMoveX = end;
                }
                this.isAnimating = false;
            }
        }

        
        
        if( start !== end ){
                requestAnimationFrame(move)
        }else{
            if( prop == 'transform'){
                this.imgContainerMoveX = end;
            }
            this.isAnimating = false;
        }

        

    }
    animateMultiValue(
        el: HTMLElement,
        options: Array<{
            prop: string,
            start: number,
            end: number,
            step: number
        }>
    ){
        if( this.isAnimating ){
            return;
        }
        this.isAnimating = true;
        let processStyle = () => {
            let isFullFilled: boolean = true;
            for( let i = 0, L = options.length; i < L ;i++ ){
                let item = options[i];
                if( Math.abs( item.start - item.end ) < Math.abs( item.step ) ){
                    item.step = item.end - item.start;
                }
                item.start += item.step;
                el.style[item.prop] = `${item.start}px`;
                if( item.start !== item.end ){
                    isFullFilled = false;
                }
            }
            if(isFullFilled){
                this.isAnimating = false;
            }else{
                requestAnimationFrame(processStyle)
            }
        }
        processStyle();
    }
    computeStep( displacement:number,time: number ): number{
        let v: number = displacement / time;
        let frequency: number = 1000 / 60;

        return v * frequency;
    }
    genFrame(){
        let curImg: string = this.options.curImg;
        let images: Array<string> = this.options.imgs;
        
        if( !images || !images.length ){
            console.error("没有图片哦!\n no pictures!");
            return;
        }

        this.imgsNumber = images.length;
        let index: number = images.indexOf(curImg);
        let imagesHtml: string = '';
        if( index == -1 ){
            index = 0;
        }
        this.curIndex = index;
        this.imgContainerMoveX = -(index * this.screenWidth);
        images.forEach( src => {
            imagesHtml += `
            <div class="${this.prefix}itemWraper">
                <div class="${this.prefix}item">
                    <img src="${src}">
                </div>
            </div>
            `
        } )

        let genStyle = ( prop: string)  =>  {
            switch( prop ){
                case 'conBackground':
                    if( this.envClient == 'pc'  ) {
                        return 'rgba(0,0,0,0.8)'
                    }else{
                        return 'rgba(0,0,0,1)'
                    }
                case 'imgWidth':
                    if( this.envClient == 'pc'  ) {
                        return '85%'
                    }else{
                        return '100%'
                    };
                    
                case 'itemHeight':
                    if( this.envClient == 'pc'  ) {
                        return '100%'
                    }else{
                        return 'auto'
                    };
                case 'itemScroll':
                        if( this.envClient == 'pc'  ) {
                            return 'auto '
                        }else{
                            return 'hidden'
                        };
                default: return ''
            }
        }
        let html : string = `
                <div class="${this.prefix}close">
                    <svg t="1563161688682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5430">
                        <path d="M10.750656 1013.12136c-13.822272-13.822272-13.822272-36.347457 0-50.169729l952.200975-952.200975c13.822272-13.822272 36.347457-13.822272 50.169729 0 13.822272 13.822272 13.822272 36.347457 0 50.169729l-952.200975 952.200975c-14.334208 14.334208-36.347457 14.334208-50.169729 0z" fill="#ffffff" p-id="5431"></path><path d="M10.750656 10.750656c13.822272-13.822272 36.347457-13.822272 50.169729 0L1013.633296 963.463567c13.822272 13.822272 13.822272 36.347457 0 50.169729-13.822272 13.822272-36.347457 13.822272-50.169729 0L10.750656 60.920385c-14.334208-14.334208-14.334208-36.347457 0-50.169729z" fill="#ffffff" p-id="5432">
                        </path>
                    </svg>
                </div>
                <div class="${this.prefix}imgContainer">
                    ${imagesHtml}
                </div>
                <div class="${this.prefix}bottom">
                    <div class="${this.prefix}item ">
                        <svg data-type="rotateLeft" t="1563884004339" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1099" width="200" height="200"><path d="M520.533333 285.866667c140.8 12.8 251.733333 132.266667 251.733334 277.333333 0 153.6-123.733333 277.333333-277.333334 277.333333-98.133333 0-192-55.466667-238.933333-140.8-4.266667-8.533333-4.266667-21.333333 8.533333-29.866666 8.533333-4.266667 21.333333-4.266667 29.866667 8.533333 42.666667 72.533333 119.466667 119.466667 204.8 119.466667 128 0 234.666667-106.666667 234.666667-234.666667s-98.133333-230.4-226.133334-234.666667l64 102.4c4.266667 8.533333 4.266667 21.333333-8.533333 29.866667-8.533333 4.266667-21.333333 4.266667-29.866667-8.533333l-89.6-145.066667c-4.266667-8.533333-4.266667-21.333333 8.533334-29.866667L597.333333 187.733333c8.533333-4.266667 21.333333-4.266667 29.866667 8.533334 4.266667 8.533333 4.266667 21.333333-8.533333 29.866666l-98.133334 59.733334z" p-id="1100" fill="#ffffff"></path></svg>
                    </div>
                    <div class="${this.prefix}item">
                        <svg data-type="rotateRight" t="1563884064737" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1251" width="200" height="200"><path d="M503.466667 285.866667L405.333333 226.133333c-8.533333-8.533333-12.8-21.333333-8.533333-29.866666 8.533333-8.533333 21.333333-12.8 29.866667-8.533334l145.066666 89.6c8.533333 4.266667 12.8 17.066667 8.533334 29.866667l-89.6 145.066667c-4.266667 8.533333-17.066667 12.8-29.866667 8.533333-8.533333-4.266667-12.8-17.066667-8.533333-29.866667l64-102.4c-123.733333 4.266667-226.133333 106.666667-226.133334 234.666667s106.666667 234.666667 234.666667 234.666667c85.333333 0 162.133333-46.933333 204.8-119.466667 4.266667-8.533333 17.066667-12.8 29.866667-8.533333 8.533333 4.266667 12.8 17.066667 8.533333 29.866666-51.2 85.333333-140.8 140.8-238.933333 140.8-153.6 0-277.333333-123.733333-277.333334-277.333333 0-145.066667 110.933333-264.533333 251.733334-277.333333z" p-id="1252" fill="#ffffff"></path></svg>
                    </div>
                </div>
        `;
        let style: string =`
            .${this.prefix}imagePreviewer{
                position: fixed;
                top:0;
                left: 100%;
                width: 100%;
                height: 100%;
                background: ${genStyle('conBackground')};
                color:#fff;
                transform: translate3d(0,0,0);
                transition: left 0.5s;
                overflow:hidden;
                user-select: none;
            }
            .${this.prefix}imagePreviewer.${this.defToggleClass}{
                left: 0%;
            }
            .${this.prefix}imagePreviewer .${this.prefix}close{
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 1;
                box-sizing: border-box;
                width: 22px;
                height: 22px;
                cursor:pointer;
            }
            .${this.prefix}imagePreviewer .${this.prefix}close svg{
                width: 100%;
                height: 100%;             
            }
            .${this.prefix}imagePreviewer svg{
                overflow:visible;
            }
            .${this.prefix}imagePreviewer svg path{
                stroke: #948888;
                stroke-width: 30px;
            }
            
            .${this.prefix}imagePreviewer ${this.prefix}.close.${this.prefix}scroll{
                height: 0;
            }
            .${this.prefix}imagePreviewer .${this.prefix}imgContainer{
                position: relative;
                transform: translateX( ${this.imgContainerMoveX}px );
                height: 100%;
                font-size: 0;
                white-space: nowrap;
            }
            .${this.prefix}imagePreviewer .${this.prefix}itemWraper{
                box-sizing:border-box;
                position: relative;
                display:inline-block;
                width: 100% ;
                height: 100%;
                overflow: hidden;
            }
            .${this.prefix}imagePreviewer .${this.prefix}imgContainer .${this.prefix}item{
                box-sizing:border-box;
                position: absolute;
                width: 100% ;
                height: ${genStyle('itemHeight')};
                overflow-x: ${genStyle('itemScroll')};
                overflow-y:${genStyle('itemScroll')};
                font-size: 0;
                text-align: center;
                white-space: normal;
                transition: transform 0.5s;
            }
            .${this.prefix}imagePreviewer .${this.prefix}item img{
                width: ${ genStyle('imgWidth') };
                height: auto;
            }
            .${this.prefix}imagePreviewer .${this.prefix}bottom{
                position: absolute;
                bottom: 0;
                left: 20px;
                right: 20px;
                padding:10px;
                text-align: center;
                border-top: 1px solid rgba(255, 255, 255, .2);
            }
            .${this.prefix}imagePreviewer .${this.prefix}bottom .${this.prefix}item{
                display:inline-block;
                width: 22px;
                height: 22px;
                margin-right: 10px;
                cursor:pointer;
            }
            .${this.prefix}imagePreviewer .${this.prefix}bottom .${this.prefix}item svg{
                width: 100%;
                height: 100%;
            }
        `;
        this.ref = document.createElement('div');
        this.ref.className = `${this.prefix}imagePreviewer`;

        
        this.ref.innerHTML = html;
        if( !document.querySelector(`#${this.prefix}style`)){
            let styleElem = document.createElement('style');
            styleElem.id= `${this.prefix}style`;
            styleElem.innerHTML = style;
            
            document.querySelector('head').appendChild(styleElem);
        }
        

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
    close(e: MouseEvent & TouchEvent){
        e.stopImmediatePropagation();
        clearTimeout(this.performerClick)
        this[ this.envClient + 'BeforeClose']();
        this.toggleClass( this.ref, this.defToggleClass )
    }
    pcBeforeClose(){
        document.body.style['overflow'] = document.body.dataset['imgPreOverflow']
    }
    mobileBeforeClose(){}
    show( index: number ){
        this.curIndex = index;
        this.imgContainerMoveX = -index * this.screenWidth;

        this.imgContainer.style.left = `${this.imgContainerMoveX}px`;
        this[ this.envClient + 'ReadyShow' ]();
        this.toggleClass( this.ref,this.defToggleClass )
    }
    mobileReadyShow(){}
    pcReadyShow(){
        let styleDesc: CSSStyleDeclaration = window.getComputedStyle(document.body);
        document.body.dataset['imgPreOverflow'] = styleDesc.overflow;
        document.body.style['overflow'] = 'hidden';
    }
    toggleClass( ref:HTMLElement,className: string){
        let classes:Array<string> = ref.className.split(' ');
        let index: number = classes.indexOf(className);
        if(  index!== -1 ){
            classes.splice(index,1)
        }else{
            classes.push( className )
        }

        ref.className = classes.join(' ');

    }
    getMovePoints( e: MouseEvent & TouchEvent ){
        this.movePoints.push({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        })
    }
    destroy() : void{
        this.ref.parentNode.removeChild(this.ref);
    }
    testEnv(): client{
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            return client.mobile
        } else {
            return client.pc
        }
    }
}