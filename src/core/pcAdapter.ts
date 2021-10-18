import { ImagePreview } from "./image-preview"
export default ( constructor: typeof ImagePreview) => {
    return class extends constructor{
            mouseDown = false
            pcInitial() {
                this.ref.querySelector(`.${this.prefix}close`).addEventListener('mousedown', this.close.bind(this))

                this.ref.addEventListener('mousedown', this.handleMouseDown.bind(this));
                this.ref.addEventListener('mousemove', this.handleMouseMove.bind(this));
                this.ref.addEventListener('mouseup', this.handleMouseUp.bind(this));

                this.ref.addEventListener('wheel', this.handleWheel.bind(this));

                
                this.handleResize = this.handleResize.bind(this)
                window.addEventListener('resize',this.handleResize)
            }
            handleMouseUp(){
                this.mouseDown = false
                if(this.actionExecutor.isEnlargement){
                    this.ref.style.cursor = 'grab'
                }else{
                    this.ref.style.cursor = 'initial'
                }
            }
            handleMouseMove(e: MouseEvent){
                const { actionExecutor } = this
                if(!actionExecutor.isEnlargement){
                    return
                }
                if( !this.mouseDown ){
                    return
                }
                if( this.isAnimating ){
                    return
                }
                const curItemRect = actionExecutor.viewRect;
                const viewLeft: number = curItemRect.left;
                const viewRight: number = curItemRect.right;
                const viewTop = curItemRect.top;
                const viewBottom = curItemRect.bottom;

                let curX: number = (e.clientX);
                let curY: number = (e.clientY);
                const { eventsHanlder } = actionExecutor;

                const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
                const conWidth: number = imgContainerRect.width;
                const conHeight: number = imgContainerRect.height;

                const curItemHeihgt: number = curItemRect.height;


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
                actionExecutor.eventsHanlder.handleMoveEnlage(curLeft,curTop,0);
                this.startX = curX;
                this.startY = curY;
               
            }
            async handleWheel(e: WheelEvent){

                const centerFingerX = e.clientX ;
                const centerFingerY = e.clientY ;

                this.isZooming = true;
                this.isAnimating = true;
                
                const { actionExecutor } = this;
                const centerImgCenterX = actionExecutor.viewWidth / (2 * actionExecutor.dpr)
                const centerImgCenterY = actionExecutor.viewHeight / (2 *actionExecutor.dpr)

                let x = 0,y = 0,sx = 1.0,sy = 1.0;
                const zoomScale = this.zoomScale * 2;
                if( e.deltaY > 0 ){// zoom in
                    y = -((centerFingerY - centerImgCenterY)) * zoomScale;
                    x = -((centerFingerX - centerImgCenterX)) * zoomScale;
                    
                    sx = 1 + zoomScale
                    sy = 1 + zoomScale;

                }else{// zoom out
                    y =  (centerFingerY - centerImgCenterY) * zoomScale;
                    x =  (centerFingerX - centerImgCenterX) * zoomScale;

                    sx = 1 - zoomScale
                    sy = 1 - zoomScale;
                }
                actionExecutor.eventsHanlder.handleZoom(sx,sy,x,y)
                this.isZooming = false;
                this.isAnimating = false;

                if(this.actionExecutor.isEnlargement){
                    this.ref.style.cursor = 'grab'
                }else{
                    this.ref.style.cursor = 'initial'
                }
            }
            async handlePCDoubleClick(e:MouseEvent & TouchEvent){
                if( this.isAnimating ){
                    return;
                }
                this.isAnimating = true;
                await this.actionExecutor.eventsHanlder.handleDoubleClick({clientX: e.clientX, clientY: e.clientY});
                this.isAnimating = false;
                if(this.actionExecutor.isEnlargement){
                    this.ref.style.cursor = 'grab'
                }else{
                    this.ref.style.cursor = 'initial'
                }
            }
            handleMouseDown(e:MouseEvent & TouchEvent){
                const type: string = (<HTMLElement>(e.target)).dataset.type;
                if (this[type]) {
                    this[type](e);
                    return
                }
                // move event handle
                this.mouseDown = true;
                const { actionExecutor } = this
                if(actionExecutor.isEnlargement){
                    this.startX = e.clientX;
                    this.startY = e.clientY;
                    this.ref.style.cursor = 'grabbing'
                }else{
                    this.ref.style.cursor = 'initial'
                }
                // move event handle end
                if ( Date.now() - this.lastClick < this.doubleClickDuration) {
                    clearTimeout(this.performerClick)
                    this.handlePCDoubleClick(e);
                } else {
                    this.performerClick = setTimeout(() => {
                        this.handleClick(e);
                    }, this.doubleClickDuration)
        
                }
                this.lastClick = Date.now();
            }
            async slideBefore(){
                this.isAnimating = true;
                const [isFirst] = await this.actionExecutor.slideBefore();
                if( isFirst ){// change cursor
                    (this.
                    ref.
                    querySelectorAll(`.${this.prefix}bottom .${this.prefix}item `)[0] as HTMLElement
                    ).style
                    .cursor="not-allowed"
                }else{
                    (this.
                    ref.
                    querySelectorAll(`.${this.prefix}bottom .${this.prefix}item `)[1] as HTMLElement
                    ).style
                    .cursor="pointer"
                }
                this.isAnimating = false;
            }
            async slideNext(){
                this.isAnimating = true;
                const [isLast] = await this.actionExecutor.slideNext();
                if(isLast){
                    (this.
                    ref.
                    querySelectorAll(`.${this.prefix}bottom .${this.prefix}item `)[1] as HTMLElement
                    ).style
                    .cursor="not-allowed"
                }else{
                    (this.
                    ref.
                    querySelectorAll(`.${this.prefix}bottom .${this.prefix}item `)[0] as HTMLElement
                    ).style
                    .cursor="pointer"
                }
                this.isAnimating = false;
            }
    }
}