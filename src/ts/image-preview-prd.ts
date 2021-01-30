/**
 * image-preview [1.0.2]
 * author:zilong
 * https://github.com/daxiazilong
 * Released under the MIT License
 */
import { Move } from '../action/move';
import { Zoom } from '../action/zoom';

class ImagePreview implements Move,Zoom {
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

    public envClient:string;
    public supportTransitionEnd: String;
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
        this.supportTransitionEnd = this.transitionEnd();
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
    setToNaturalImgSize(toWidth:number,toHeight:number,scaleX: number, scaleY: number, e: TouchEvent & MouseEvent): void {}
    setToInitialSize(scaleX: number, scaleY: number, e: TouchEvent & MouseEvent): void {}
    handleZoom(e: TouchEvent & MouseEvent): void {}
    handleMove(e: TouchEvent & MouseEvent): void {}
    handleMoveNormal(e: TouchEvent & MouseEvent): void {}
    handleMoveEnlage(e: TouchEvent & MouseEvent): void {}
    autoMove(curItem: HTMLElement, deg: number, startX: number, startY: number, { maxTop, minTop, maxLeft, minLeft }: { maxTop: any; minTop: any; maxLeft: any; minLeft: any; }): void {}
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
        let triggerItems: NodeListOf < HTMLElement & HTMLImageElement > = document.querySelectorAll( this.options.selector )
        if( !triggerItems.length ){
            // some operate
        }
        triggerItems.forEach( (element,index) => {
            images.push( element.dataset.src ||  element.src /** bug fix 2020.07.26 by luffy */ );
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
        if( this.isAnimating ){
            return;
        }
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        let rotateDeg:number;
        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        this.isAnimating = true;

        if( curItem.dataset.rotateDeg ){
            rotateDeg = Number(curItem.dataset.rotateDeg)
        }else{
            rotateDeg = 0
        }

        rotateDeg -= 90;
        curItem.style.cssText += `
            transition: transform 0.5s;
            transform: rotateZ( ${rotateDeg}deg );
        `;
        if( this.supportTransitionEnd ){
            let end:string = <string>this.supportTransitionEnd;
            curItem.addEventListener(end,() => {
                curItem.dataset.rotateDeg = rotateDeg.toString();
                this.isAnimating = false;
            },{once:true})
            return;
        }

        setTimeout(()=>{
            curItem.dataset.rotateDeg = rotateDeg.toString();
            this.isAnimating = false;
        },550)

    }
    handleRotateRight(e: TouchEvent & MouseEvent ) :void{
        if( this.isAnimating ){
            return;
        }
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        let rotateDeg:number;
        
        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        this.isAnimating = true;
        if( curItem.dataset.rotateDeg ){
            rotateDeg = Number(curItem.dataset.rotateDeg)
        }else{
            rotateDeg = 0
        }
        rotateDeg += 90;

        curItem.style.cssText += `
            transition: transform 0.5s;
            transform: rotateZ( ${rotateDeg}deg );
        `
        if( this.supportTransitionEnd ){
            let end:string = <string>this.supportTransitionEnd;
            curItem.addEventListener(end,() => {
                curItem.dataset.rotateDeg = rotateDeg.toString();
        
                this.isAnimating = false;
            },{once:true})
            return;
        }
        setTimeout(()=>{
            curItem.dataset.rotateDeg = rotateDeg.toString();
            
            this.isAnimating = false;
        },550)
    }
    
    handleClick(e ? :TouchEvent & MouseEvent){
        let close: HTMLElement = <HTMLElement> (this.ref.querySelector(`.${this.prefix}close`));
        let bottom: HTMLElement = <HTMLElement>(this.ref.querySelector(`.${this.prefix}bottom`));
        this.showTools = !this.showTools
        if( this.isAnimating){
            return;
        }
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
             // 竖直状态下 长图的双击放大放大至设备的宽度大小，
             if( toHeight > toWidth ){
                if( toWidth >= this.screenWidth){
                    toWidth = this.screenWidth;
                    toHeight = (curImg.naturalHeight / curImg.naturalWidth) * toWidth
                }
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

            this.setToNaturalImgSize( toWidth,toHeight,scaleX,scaleY,e);  
            
        }else if( scaleX < 1 && scaleY < 1 ){ 
            this.setToInitialSize( scaleX,scaleY,e);
        }else{
            this.isAnimating = false;
        }
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
            // bug fix: on android , there dx,dy is 0,still trigger moveEvent, since add distance restrict
            // 上边确定的degree时 Math.atan2会返回这个向量相对原点的偏移角度，我们借此拿到直线的斜率进而根据直线方程确定
            // 要滑动的x y的值
            if( touchTime < 90 && ((Math.abs(dx) + Math.abs(dy)) > 5) ){
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
    slideNext(){
        let endX:number = -(this.curIndex * this.screenWidth);
        if( endX < -(this.screenWidth * this.imgsNumber - 1) ){
            endX = -(this.screenWidth * this.imgsNumber - 1);
            this.curIndex = this.imgsNumber -1 ;
        }
        let step: number = this.computeStep( Math.abs( endX - this.imgContainerMoveX ),this.slideTime )
        if( this.imgContainerMoveX < endX ){/* infinite move */
            this.slideSelf();
            return;
        }
        this.animate( this.imgContainer, 'transform',this.imgContainerMoveX, endX, -step )
    }
    slidePrev(){
        let endX:number = -(this.curIndex * this.screenWidth);
        if( endX > 0 ){
            endX = 0;
            this.curIndex = 0;
        }
        if( this.imgContainerMoveX > endX ){/* infinite move */
            this.slideSelf();
            return;
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
                        
                case 'item-text-align':
                    if( this.envClient == 'pc'  ) {
                        return 'center '
                    }else{
                        return 'initial'
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
                        <svg data-type="rotateRight"  t="1563884064737" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1251" width="200" height="200"><path d="M503.466667 285.866667L405.333333 226.133333c-8.533333-8.533333-12.8-21.333333-8.533333-29.866666 8.533333-8.533333 21.333333-12.8 29.866667-8.533334l145.066666 89.6c8.533333 4.266667 12.8 17.066667 8.533334 29.866667l-89.6 145.066667c-4.266667 8.533333-17.066667 12.8-29.866667 8.533333-8.533333-4.266667-12.8-17.066667-8.533333-29.866667l64-102.4c-123.733333 4.266667-226.133333 106.666667-226.133334 234.666667s106.666667 234.666667 234.666667 234.666667c85.333333 0 162.133333-46.933333 204.8-119.466667 4.266667-8.533333 17.066667-12.8 29.866667-8.533333 8.533333 4.266667 12.8 17.066667 8.533333 29.866666-51.2 85.333333-140.8 140.8-238.933333 140.8-153.6 0-277.333333-123.733333-277.333334-277.333333 0-145.066667 110.933333-264.533333 251.733334-277.333333z" p-id="1252" fill="#ffffff"></path></svg>
                    </div>
                </div>
        `;
        let isIPhoneX:boolean = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812;
        // iPhone XS Max
        let isIPhoneXSMax:boolean = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896;
        // iPhone XR
        let isIPhoneXR:boolean = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896;
        let needHigher: boolean = isIPhoneX || isIPhoneXSMax || isIPhoneXR;
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
                text-align: ${genStyle('item-text-align')};
                white-space: normal;
                transition: transform 0.5s;
            }
            .${this.prefix}imagePreviewer .${this.prefix}item img{
                width: ${ genStyle('imgWidth') };
                height: auto;
            }
            .${this.prefix}imagePreviewer .${this.prefix}bottom{
                position: absolute;
                bottom: ${needHigher ? 20 : 0}px;
                left: 20px;
                right: 20px;
                padding: 0 10px;
                text-align: center;
                border-top: 1px solid rgba(255, 255, 255, .2);
            }
            .${this.prefix}imagePreviewer .${this.prefix}bottom .${this.prefix}item{
                display:inline-block;
                width: 42px;
                height: 42px;
                cursor:pointer;
            }
            .${this.prefix}imagePreviewer .${this.prefix}bottom .${this.prefix}item svg{
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                padding:10px;
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
    testEnv(): string{
        if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            return 'mobile'
        } else {
            return 'pc'
        }
    }
    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

   transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd otransitionend',
        'transition'       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return  transEndEventNames[name];
            }
        }

        return '' // explicit for ie8 (  ._.)
    }
}
applyMixins(ImagePreview, [Move, Zoom]);

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    });
}
