//@ts-nocheck
import { ImagePreview } from "../core/image-preview";

class htmlExecutor{
    ref: Array<HTMLDivElement>;
    public prefix: string = "__"
    curIndex: any;
    imgItems: any;
    isAnimating: boolean;
    containerWidth: number;

    constructor(){
        this.ref = this.intialView([]);

    }
    intialView(images: Array<string>){
        let imagesNodes: Array<HTMLDivElement> = [];

        function genrateStyle(){
            let genStyle = (prop: string) => {
                switch (prop) {
                    case 'conBackground':
                        if (this.envClient == 'pc') {
                            return 'rgba(0,0,0,0.8)'
                        } else {
                            return 'rgba(0,0,0,1)'
                        }
                    case 'imgWidth':
                        if (this.envClient == 'pc') {
                            return '100%'
                        } else {
                            return '100%'
                        };
    
                    case 'itemHeight':
                        if (this.envClient == 'pc') {
                            return '100%'
                        } else {
                            return 'auto'
                        };
                    case 'itemScroll':
                        if (this.envClient == 'pc') {
                            return 'auto '
                        } else {
                            return 'hidden'
                        };
    
                    case 'item-text-align':
                        if (this.envClient == 'pc') {
                            return 'center '
                        } else {
                            return 'initial'
                        };
                    default: return ''
                }
            }
            `.${this.prefix}imagePreviewer .${this.prefix}itemWraper{
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
                top:0;left:0;
                width: 100% ;
                height: ${genStyle('itemHeight')};
                overflow-x: ${genStyle('itemScroll')};
                overflow-y:${genStyle('itemScroll')};
                font-size: 0;
                text-align: ${genStyle('item-text-align')};
                white-space: normal;
                z-index:1;
                transform-style: preserve-3d;
                backface-visibility: hidden;
                will-change:transform;
            }
            .${this.prefix}imagePreviewer .${this.prefix}imgContainer .${this.prefix}item::-webkit-scrollbar {
                width: 5px;
                height: 8px;
                background-color: #aaa;
            }
            .${this.prefix}imagePreviewer .${this.prefix}imgContainer .${this.prefix}item::-webkit-scrollbar-thumb {
                background: #000;
            }`
        }
        images.forEach(src => {
        
            const div = document.createElement('div')
            div.className = `${this.prefix}itemWraper`;
            div.innerHTML = `<img class="${this.prefix}item" src="${src}">`

            imagesNodes.push(div)
        })
        return imagesNodes;
    }
    handleDoubleClick(e: TouchEvent & MouseEvent) {
        // if (this.isAnimating) return;
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;
        const curImg: HTMLImageElement = curItem as unknown as HTMLImageElement;

        

        const curItemWidth: number = curItem.getBoundingClientRect().width;
        const curItemHeight: number = curItem.getBoundingClientRect().height;

        let rotateDeg: number = curItem.rotateDeg;

        let toWidth: number;
        let toHeight: number;

        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {
            if (curImg.naturalWidth > curItemHeight) {
                toWidth = curImg.naturalHeight
            } else {
                toWidth = curItemHeight
            }
            if (curImg.naturalHeight > curItemWidth) {
                toHeight = curImg.naturalWidth;
            } else {
                toHeight = curItemWidth;
            }
        } else {
            if (curImg.naturalWidth > curItemWidth) {
                toWidth = curImg.naturalWidth
            } else {
                toWidth = curItemWidth
            }
            if (curImg.naturalHeight > curItemHeight) {
                toHeight = curImg.naturalHeight;
            } else {
                toHeight = curItemHeight;
            }

            // 竖直状态下 长图的双击放大放大至设备的宽度大小，
            if ((curItemWidth * 1.5) < this.containerWidth)//长图的初始宽度应该小于屏幕宽度
                if (toHeight > toWidth) {
                    if (toWidth >= this.containerWidth) {
                        toWidth = this.containerWidth;
                        toHeight = (curImg.naturalHeight / curImg.naturalWidth) * toWidth
                    }
                }
        }

        let scaleX: number;
        let scaleY: number;

        let isBigSize = curItem.dataset.isEnlargement == "enlargement";

        if (isBigSize) {//当前浏览元素为大尺寸时执行缩小操作，小尺寸执行放大操作
            switch (Math.abs(rotateDeg % 360)) {
                case 0:
                case 180:
                    scaleX = Number(curItem.dataset.initialWidth) / curItemWidth;
                    scaleY = Number(curItem.dataset.initialHeight) / curItemHeight;
                    break;
                case 90:
                case 270:
                    scaleX = Number(curItem.dataset.initialWidth) / curItemHeight;
                    scaleY = Number(curItem.dataset.initialHeight) / curItemWidth;
                    break;
                default:
                    break;
            }

        } else {

            scaleX = toWidth / curItemWidth;
            scaleY = toHeight / curItemHeight;

        };


        if (scaleX > 1 || scaleY > 1) {//放大

            this.setToNaturalImgSize(toWidth, toHeight, scaleX, scaleY, e);

        } else if (scaleX < 1 || scaleY < 1) {
            this.setToInitialSize(scaleX, scaleY, e);
        } else {
            this.isAnimating = false;
        }
    }
    setToInitialSize(scaleX: number, scaleY: number, e: TouchEvent & MouseEvent) {
        throw new Error("Method not implemented.");
    }
    setToNaturalImgSize(toWidth: number, toHeight: number, scaleX: number, scaleY: number, e: TouchEvent & MouseEvent) {
        throw new Error("Method not implemented.");
    }
    get IsBoundaryLeft(){
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        return curItem.dataset.toLeft == 'true';
    }
    get isBoundaryRight(){
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        return curItem.dataset.toRight == 'true';
    }
    get viewRect(){
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        return curItem.getBoundingClientRect();
    }
    get isEnlargement(){
        const curItem: HTMLElement = this.imgItems[this.curIndex];
        return curItem.dataset.isEnlargement == 'enlargement'
    }
    handleMove(this: ImagePreview,e: TouchEvent & MouseEvent){
        e.preventDefault();
        // if( this.isAnimating ){
        //     return;
        // } 
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
                    if( 
                        ((isBoundaryLeft && direction == 'right') 
                            || 
                        (isBoundaryRight && direction == 'left') 
                            || 
                        (this.isEnlargeMove)) 
                    ){
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
    handleMoveNormal(this: ImagePreview,e: TouchEvent & MouseEvent,offset:number){
        this.setTransitionProperty({
            el: this.imgContainer,
            time: 0,
            timingFunction: ''
        })
        this.imgContainer.matrix = this.matrixMultipy( this.imgContainer.matrix,this.getTranslateMatrix({x:offset,y:0,z:0}))
        this.imgContainer.style.transform = `${this.matrixTostr(this.imgContainer.matrix)}`
    }
    handleMoveEnlage( this: ImagePreview,e: TouchEvent & MouseEvent ){
        if( !this.moveStartTime){
            this.moveStartTime = (new Date).getTime();
        }
        const imgContainerRect : ClientRect  = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;
        const conHeight: number = imgContainerRect.height;
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;

        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }

        const curItemRect = curItem.getBoundingClientRect();

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

        this.setTransitionProperty({
            el: curItem,
            time: 0,
            timingFunction: ''
        })
        curItem.matrix = this.matrixMultipy( curItem.matrix , this.getTranslateMatrix({x:curLeft,y:curTop,z:1}))
        curItem.style.transform = `${ this.matrixTostr(curItem.matrix) }`
  
        this.startX = curX;
        this.startY = curY;

    }
    handleTEndEnNormal(this: ImagePreview,e: TouchEvent & MouseEvent): void {
        // if (this.isAnimating) {
        //     return
        // }
        let endX: number = (e.changedTouches[0].clientX);
        let offset = endX - this.touchStartX;
        if (endX - this.touchStartX >= this.threshold) {//前一张
            if (this.curIndex == 0) {//第一张
                this.slideSelf();
                return;
            }
            this.curIndex--;
            this.slidePrev();
        } else if (endX - this.touchStartX <= -this.threshold) {//后一张
            if (this.curIndex + 1 == this.imgsNumber) {//最后一张
                this.slideSelf();
                return;
            }
            this.curIndex++;
            this.slideNext();
        } else {//复原
            this.slideSelf();
        }
    }
    slideNext() {
        let endX: number = -(this.curIndex * this.containerWidth);
        if (endX < -(this.containerWidth * (this.imgsNumber - 1))) {
            endX = -(this.containerWidth * (this.imgsNumber - 1));
            this.curIndex = this.imgsNumber - 1;
        }
        if (this.imgContainerMoveX < endX) {/* infinite move */
            this.slideSelf();
            return;
        }
        

        this.imgContainer.matrix = this.matrixMultipy(this.imgContainer.matrix, this.getTranslateMatrix({ x: endX - this.imgContainerMoveX, y: 0, z: 0 }))
        this.imgContainerMoveX = endX;
        this.animate({
            el: this.imgContainer,
            prop: 'transform',
            duration: 0.3,
            endStr: this.matrixTostr(this.imgContainer.matrix),
            callback: () => {
            }
        })
    }
    slidePrev() {
        let endX = -(this.curIndex * this.containerWidth);
        if (endX > 0) {
            endX = 0;
            this.curIndex = 0;
        }
        if (this.imgContainerMoveX > endX) {/* infinite move */
            this.slideSelf();
            return;
        }
        let x = endX - this.imgContainerMoveX
        this.imgContainer.matrix = this.matrixMultipy(this.imgContainer.matrix, this.getTranslateMatrix({ x, y: 0, z: 0 }))
        this.imgContainerMoveX = endX;
        this.animate({
            el: this.imgContainer,
            prop: 'transform',
            duration: 0.3,
            endStr: this.matrixTostr(this.imgContainer.matrix),
            callback: () => {
            }
        })
    }
    slideSelf() {
        let endX = -(this.curIndex * this.containerWidth);
        let x =  endX - this.imgContainerMoveX;
        this.imgContainer.matrix = this.matrixMultipy(this.imgContainer.matrix, this.getTranslateMatrix({ x, y: 0, z: 0 }))
        this.imgContainerMoveX = endX;
        this.animate({
            el: this.imgContainer,
            duration: 0.3,
            prop: 'transform',
            endStr: this.matrixTostr(this.imgContainer.matrix),
            callback: () => {
            }
        })

    }
    
    handleTEndEnlarge(e: TouchEvent & MouseEvent): void {
        // ;debugger;
        this.isAnimating = false;
        const imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
        const conWidth: number = imgContainerRect.width;
        const conHeight: number = imgContainerRect.height;

        const { actionExecutor } = this
        // 这里是curIttem
        const curItemRect = actionExecutor.viewRect;
        const curItemWidth: number = curItemRect.width;
        const curItemHeihgt: number = curItemRect.height;
        const curItemViewTop = curItemRect.top;
        const curItemViewLeft: number = curItemRect.left;
        const curItemViewRight: number = curItemRect.right;

        const maxTop: number = 0;
        const minTop: number = conHeight - curItemHeihgt;
        const maxLeft: number = 0;
        const minLeft: number = conWidth - curItemWidth;
        // debugger;
        const curItemTop: number = curItemRect.top;
        const curItemLeft: number = curItemRect.left;

        let recoverY: boolean = false;
        let recoverX: boolean = false;


        let endX: number = 0;
        let endY: number = 0;

        if (curItemLeft > maxLeft) {
            endX = maxLeft - curItemLeft;
            recoverX = true;
        } else if (curItemLeft < minLeft) {
            endX = minLeft - curItemLeft;
            recoverX = true;
        }

        if (curItemTop > maxTop) {
            endY = maxTop - curItemTop;
            recoverY = true;

        } else if (curItemTop < minTop) {
            endY = minTop - curItemTop;
            recoverY = true;
        }

        // 如果容器内能完整展示图片就不需要移动至边界
        if (curItemViewLeft >= 0 && curItemViewRight <= conWidth) {
            recoverX = false;
            curItem.dataset.toLeft = 'true';
            curItem.dataset.toRight = 'true';
        }
        if (curItemHeihgt <= conHeight) {
            recoverY = false;
            curItem.dataset.toTop = 'true';
            curItem.dataset.toBottom = 'true';
        }

        if (recoverX || recoverY) {
            curItem.matrix = this.matrixMultipy(
                curItem.matrix,
                this.getTranslateMatrix({
                    x: endX,
                    y: endY,
                    z: 1
                })
            );
            this.animate({
                el: curItem,
                prop: 'transform',
                endStr: this.matrixTostr(curItem.matrix),
                timingFunction: 'cubic-bezier(0, 0, 0, 0.93)'
            })

            if (endX == maxLeft - curItemLeft ) {
                //toLeft 即为到达左边界的意思下同
                curItem.dataset.toLeft = 'true';
                curItem.dataset.toRight = 'false';

            } else if (endX == minLeft - curItemLeft) {
                curItem.dataset.toLeft = 'false';
                curItem.dataset.toRight = 'true';
            }

            if (endY == maxTop) {
                curItem.dataset.toTop = 'true';
                curItem.dataset.toBottom = 'false';
            } else if (endY == minTop - curItemTop) {
                curItem.dataset.toTop = 'false';
                curItem.dataset.toBottom = 'true';
            }
        } else {
            // 如果容器内能完整展示图片就不需要移动至边界
            if (curItemViewLeft >= 0 && curItemViewRight <= conWidth) {
                curItem.dataset.toLeft = 'true';
                curItem.dataset.toRight = 'true';
            } else {
                curItem.dataset.toLeft = 'false';
                curItem.dataset.toRight = 'false';
            }

            curItem.dataset.toTop = 'false';
            curItem.dataset.toBottom = 'false';

            this.moveEndTime = (new Date).getTime();
            let endPoint: { x: number, y: number } = {
                x: this.startX,
                y: this.startY
            };
            let startPoint: { x: number, y: number } = {
                x: this.touchStartX,
                y: this.touchStartY
            };


            let dx: number = endPoint.x - startPoint.x;
            let dy: number = endPoint.y - startPoint.y;
            let degree: number = Math.atan2(dy, dx) * 180 / Math.PI;
            let touchTime = this.moveEndTime - this.moveStartTime;
            // 手指移动时间较短的时候，手指离开屏幕时，会滑动一段时间
            // bug fix: on android , there dx,dy is 0,still trigger moveEvent, since add distance restrict
            // 上边确定的degree时 Math.atan2会返回这个向量相对原点的偏移角度，我们借此拿到直线的斜率进而根据直线方程确定
            // 要滑动的x y的值
            if (touchTime < 90 && ((Math.abs(dx) + Math.abs(dy)) > 5)) {
                let boundryObj = { maxTop, minTop: minTop - curItemViewTop, maxLeft, minLeft: minLeft - curItemViewLeft }
                this.autoMove(curItem, degree, 0, 0, boundryObj)
            }

        }
        this.moveStartTime = 0;


    }
    autoMove(this: ImagePreview,deg: number,startX:number,startY:number,{maxTop,minTop,maxLeft,minLeft}){
        curItem.matrix = this.matrixMultipy(curItem.matrix,this.getTranslateMatrix({x,y,z:1}))
        this.animate({
            el:curItem,
            prop:'transform',
            timingFunction:'cubic-bezier(0, 0, 0, 0.93)',
            endStr:this.matrixTostr(curItem.matrix),
            duration: 1
        })
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
    handleRotateLeft(this: ImagePreview,e: TouchEvent & MouseEvent ) :void{
        let changeDeg = -1 * Math.PI / 2;
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;
        curItem.rotateDeg -= 90;
        this.handleRotate(e,changeDeg)
        this.actionExecutor.rotateZ(changeDeg)
    }
    handleRotateRight(this: ImagePreview,e: TouchEvent & MouseEvent ) :void{
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;
        curItem.rotateDeg += 90;
        let changeDeg = 1 * Math.PI / 2;
        this.handleRotate(e,changeDeg)
    }
    handleRotate(this: ImagePreview,e: TouchEvent & MouseEvent,changeDeg:number){
        if( this.isAnimating ){
            return;
        }
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;
        if( curItem.dataset.loaded == 'false'){
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        this.isAnimating = true;

        this.setTransitionProperty({
            el: curItem,
            time: 0.3,
            timingFunction:'linear'
        })
        curItem.matrix = this.matrixMultipy(this.getRotateZMatrix( changeDeg ),curItem.matrix)
        curItem.style.transform = `${ this.matrixTostr(curItem.matrix) }`;

        let end:string = <string>this.supportTransitionEnd;
        curItem.addEventListener(end,() => {
            this.isAnimating = false;
        },{ once: true })
    }
    handleZoom(this: ImagePreview, e: TouchEvent & MouseEvent): void {
        if (!this.isZooming) {
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
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;

        if (curItem.dataset.loaded == 'false') {
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            this.isAnimating = false;
            return;
        }

        const curItemRect = curItem.getBoundingClientRect();
        const curItemWidth: number = curItemRect.width;
        const curItemHeihgt: number = curItemRect.height;

        const distaceBefore: number =
            Math.sqrt(Math.pow(this.curPoint1.x - this.curPoint2.x, 2) + Math.pow(this.curPoint1.y - this.curPoint2.y, 2));

        const distanceNow: number =
            Math.sqrt(Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));

        let top: number = curItemRect.top;
        let left: number = curItemRect.left;

        const centerFingerX: number = (this.curStartPoint1.x + this.curStartPoint2.x) / 2;
        const centerFingerY: number = (this.curStartPoint1.y + this.curStartPoint2.y) / 2;
        const centerImgCenterX = curItemWidth / 2 + left;
        const centerImgCenterY = curItemHeihgt / 2 + top;


        this.curPoint1.x = e.touches[0].clientX;
        this.curPoint1.y = e.touches[0].clientY;
        this.curPoint2.x = e.touches[1].clientX;
        this.curPoint2.y = e.touches[1].clientY;
     
        if (distaceBefore > distanceNow) {//缩小 retu

            let y = ((this.zoomScale) * (centerFingerY - centerImgCenterY));
            let x = ((this.zoomScale) * (centerFingerX - centerImgCenterX));
            
            curItem.matrix = this.matrixMultipy(
                this.getScaleMatrix({ x: 1 - this.zoomScale, y: 1 - this.zoomScale, z: 1 }),
                curItem.matrix,
                this.getTranslateMatrix({ x, y, z: 1 })
            )
            const intialMatrix = this.matrixMultipy(this.getRotateZMatrix( curItem.rotateDeg * Math.PI / 180),curItem.intialMatrix);
            // 缩放系数已经小于初始矩阵了 就让他维持到初始矩阵的样子
            if( intialMatrix[0][0] >= curItem.matrix[0][0] ){
                curItem.matrix = intialMatrix
                curItem.dataset.isEnlargement = 'shrink';
            }
            
        } else if (distaceBefore < distanceNow) {//放大

            curItem.dataset.isEnlargement = 'enlargement';

            // biggest width for zoom in
            let maxWidth = this.containerWidth * 4;
            if (curItemWidth * (1 + this.zoomScale) > maxWidth) {
                this.isAnimating = false;
                return;
            }

            let y = -((this.zoomScale) * (centerFingerY - centerImgCenterY));
            let x = -((this.zoomScale) * (centerFingerX - centerImgCenterX));
            
            curItem.matrix = this.matrixMultipy(
                this.getScaleMatrix({ x: 1 + this.zoomScale, y: 1 + this.zoomScale, z: 1 }),
                curItem.matrix,
                this.getTranslateMatrix({ x, y, z: 1 })
            )

        }

        curItem.style.transform = `${this.matrixTostr(curItem.matrix)}`


        this.isAnimating = false;
    }
    setToNaturalImgSize(this: ImagePreview,
        toWidth: number, toHeight: number,
        scaleX: number, scaleY: number,
        e: TouchEvent & MouseEvent
    ): void {
        let mouseX: number = e.touches[0].clientX;
        let mouseY: number = e.touches[0].clientY;

        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;

        // 以下为旋转之后缩放时需要用到的参数
        const curItemRect = curItem.getBoundingClientRect();
        const curItemViewTop: number = curItemRect.top;//当前元素距离视口的top
        const curItemViewLeft: number = curItemRect.left;//当前元素距离视口的left

        const centerX: number = (curItemRect.width) / 2 + curItemViewLeft;
        const centerY: number = (curItemRect.height) / 2 + curItemViewTop;

        let x = 0, y = 0;
        x = -((mouseX - centerX) * (scaleX - 1));
        y = -((mouseY - centerY) * (scaleY - 1));

        if (toWidth == this.containerWidth) {
            x = 0
        }
        curItem.matrix = this.matrixMultipy(
            this.getScaleMatrix({ x: scaleX, y: scaleY, z: 1 }),
            curItem.matrix,
            this.getTranslateMatrix({ x, y, z: 1 })
        )
        this.animate({
            el: curItem,
            prop:'transform',
            endStr: `${this.matrixTostr(curItem.matrix)}`,
            callback: () => {
                curItem.dataset.isEnlargement = 'enlargement';
                this.isAnimating = false;
            }
        })
        
    }
    setToInitialSize(this: ImagePreview, scaleX: number, scaleY: number, e: TouchEvent & MouseEvent) {
        const curItem = this.imgItems[this.curIndex] as interFaceElementMatrix;
        let rotateDeg: number = curItem.rotateDeg;;
        curItem.matrix = this.matrixMultipy(
            this.getRotateZMatrix(rotateDeg * Math.PI / 180),
            curItem.intialMatrix
        )
        this.animate({
            el: curItem,
            endStr:  `${this.matrixTostr(curItem.matrix)}`,
            prop:'transform',
            callback:() => {
                curItem.dataset.isEnlargement = 'shrink';
                this.isAnimating = false;
            }
        })
    }
}