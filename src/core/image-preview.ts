/**
 * image-preview [2.0.0]
 * author:zilong
 * https://github.com/daxiazilong
 * Released under the MIT License
 */
import { Move, Zoom, Rotate } from '../action/index';
import { Animation } from '../animation/index'
import { Matrix } from '../matrix/index'
import { showDebugger } from '../tools/index';
import { webGl } from '../webgl/index'


class ImagePreview implements
    Move, Zoom, Animation,
    Matrix {
    public showTools: boolean = true;
    public lastClick: number = -Infinity;// 上次点击时间和执行单击事件的计时器
    public performerClick: any;// 单击事件执行计时器
    public threshold: number;//阈值 手指移动超过这个值则切换到下一屏

    public startX: number;//手指移动时的x坐标 会随手指坐标变化
    public touchStartX: number;//手指移动时的x起点坐标 不会变化
    public startY: number;//手指移动时的y起始坐标
    public touchStartY: number; //手指第一次点击时的y起点坐标

    public startXForDirection: number // 判断手指移动方向的点

    public curIndex: number = 0;//当前第几个图片
    public imgContainerMoveX: number = 0;//图片容器x轴的移动距离
    public imgContainerMoveY: number = 0;//图片容器y轴的移动距离
    public containerWidth: number = 0;//屏幕宽度
    public imgsNumber: number;//图片数量
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
    public isEnlargeMove: boolean = false;// 大图下得切屏 slide next/before img
           isNormalMove:  boolean = false;// is moveNormal
           normalMoved = false // 手指移动上下一张切换的时候有没有产生位移 双指缩放时若此值为true则不进行缩放

    maxMovePointCounts: number = 3; // max point count while collect moving point.

    public prefix: string = "__"
    public ref: HTMLElement;
    public imgContainer: HTMLElement & { matrix: Array<Array<number>> };
    public imgItems: NodeListOf<HTMLElement>;
    public defToggleClass: string = 'defToggleClass';

    public movePoints: Array<{ x: number, y: number }> = [];//收集移动点，判断滑动方向
    public fingerDirection: string = '';//当前手指得移动方向

    public moveStartTime: number = 0;
    public moveEndTime: number = 0;
    actionExecutor: webGl;
    taskExecuteAfterTEnd: Map<string,task>; // touchend之后需要执行的任务 commonly, it is reset sth,and so on.

    public operateMaps: {
        [key: string]: string
    } = {
            rotateLeft: 'handleRotateLeft',
            rotateRight: 'handleRotateRight'
        }

    public envClient: string;
    public supportTransitionEnd: string;
    public transitionEndPrefix: string;

    public initalMatrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 1],
    ];
    screenWidth: number;
    constructor(
        public options: {
            curImg?: string,
            imgs?: Array<string>,
            selector?: string
        }
    ) {
        if (options.selector) {
            // options里拿到图片
            this.bindTrigger();
        }
        this.actionExecutor = new webGl({
            images: this.options.imgs
        })
        this.taskExecuteAfterTEnd = new Map;
        this.envClient = this.testEnv();
        this.supportTransitionEnd = this.transitionEnd();
        this.genFrame();
        this.handleReausetAnimate();//requestAnimationFrame兼容性

        this.imgContainer = this.ref.querySelector(`.${this.prefix}imgContainer`);
        this.imgContainer.matrix = this.initalMatrix

        this.containerWidth = this.imgContainer.getBoundingClientRect().width;
        this.threshold = this.containerWidth / 4;

        this.imgItems = this.imgContainer.querySelectorAll(`.${this.prefix}item`);
        this[this.envClient + 'RecordInitialData'](this.imgItems);

        this.maxMoveX = this.containerWidth / 2;
        this.minMoveX = -this.containerWidth * (this.imgsNumber - 0.5);

        this[this.envClient + 'Initial']();

    }
    setToNaturalImgSize(toWidth: number, toHeight: number, scaleX: number, scaleY: number, e: TouchEvent & MouseEvent): void { }
    setToInitialSize(scaleX: number, scaleY: number, e: TouchEvent & MouseEvent): void { }
    handleZoom(e: TouchEvent & MouseEvent): void { }
    handleMove(e: TouchEvent & MouseEvent): void { }
    handleMoveNormal(e: TouchEvent & MouseEvent): void { }
    handleMoveEnlage(e: TouchEvent & MouseEvent): void { }
    handleRotate(e: TouchEvent & MouseEvent, changeDeg: number) { }
    handleRotateLeft(e: TouchEvent & MouseEvent): void { }
    handleRotateRight(e: TouchEvent & MouseEvent): void { }
    setTransitionProperty({el, time, timingFunction,prop}:setTransitionPropertyProps): void { }
    animate(
        {
            el,
            prop,
            endStr,
            timingFunction,
            callback,
            duration
        }: animateProps
    ) { }
    animateMultiValue(
        el: HTMLElement,
        options: Array<{
            prop: string,
            endStr: string
        }>,
        timingFunction?: string,
        callback?: () => void
    ) { }
    computeStep(displacement: number, time: number): number { return 0 }
    transitionEnd() { return '' };
    autoMove(deg: number, startX: number, startY: number, { maxTop, minTop, maxLeft, minLeft }: { maxTop: any; minTop: any; maxLeft: any; minLeft: any; }):Promise<any> { return Promise.resolve(1) }
    matrixMultipy(a: Array<Array<number>>, b: Array<Array<number>>, ...res) { return [] }
    matrixTostr(arr: Array<Array<number>>) { return '' }
    getTranslateMatrix({ x, y, z }) { return [] }
    getRotateZMatrix(deg: number) { return [] }
    getScaleMatrix({ x, y, z }) { return [] }
    insertImageAfter( image: string | image , index: number ){
        this.actionExecutor.addImg(image,index)
    }
    delImage(index:number){
        this.actionExecutor.delImg(index)
    }
    mobileInitial() {
        this.ref.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.ref.addEventListener('touchmove', this.handleMove.bind(this));
        this.ref.addEventListener('touchend', this.handleToucnEnd.bind(this));
        this.ref.querySelector(`.${this.prefix}close`).addEventListener('touchstart', this.close.bind(this))
    }
    bindTrigger() {
        let images: Array<string> = [];
        let triggerItems: NodeListOf<HTMLElement & HTMLImageElement> = document.querySelectorAll(this.options.selector)
        if (!triggerItems.length) {
            // some operate
        }
        triggerItems.forEach((element, index) => {
            images.push(element.dataset.src || element.src /** bug fix 2020.07.26 by luffy */);
        })

        this.options.curImg = images[0];
        this.options.imgs = images;

        let imgPreviewer = this;
        triggerItems.forEach((element, index) => {

            element.addEventListener('click', function (e) {
                imgPreviewer.show(index)
            })
        })

    }
    addTouchEndTask(type:string,task: task){
        if( !this.taskExecuteAfterTEnd.has(type) ){
            this.taskExecuteAfterTEnd.set(type,task)
        }
    }
    mobileRecordInitialData(els: NodeListOf<HTMLElement>) {
        /**
         * 记录并设置初始top，left值
         */
        const record = (el: interFaceElementMatrix, img: HTMLImageElement) => {

            const imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
            const imgContainerHeight: number = imgContainerRect.height;
            const imgContainerWidth: number = imgContainerRect.width;
            const styleObj: ClientRect = el.getBoundingClientRect();

            const imgNaturalWidth = img.naturalWidth;
            const imgNaturalHeight = img.naturalHeight;

            let scaleX = imgContainerWidth / imgNaturalWidth;
            const imgShouldHeight = imgContainerWidth * imgNaturalHeight / imgNaturalWidth;
            let scaleY = imgShouldHeight / imgNaturalHeight;

            if (imgContainerHeight < styleObj.height) {// long img fill column direction. width auto fit
                scaleY = imgContainerHeight / imgNaturalHeight;
                const imgShouldWeidth = imgContainerHeight * imgNaturalWidth / imgNaturalHeight;
                scaleX = imgShouldWeidth / imgNaturalWidth
                img.style.cssText = `
                    height: 100%;
                    width: auto;
                `;
            }
            const top: number = -(imgNaturalHeight - imgContainerHeight) / 2;
            const left: number = -(imgNaturalWidth - imgContainerWidth) / 2;

            
            el.dataset.loaded = "true";
            el.rotateDeg = 0;

            el.matrix = this.initalMatrix;
            el.matrix = this.matrixMultipy(el.matrix,
                this.getScaleMatrix({ x: scaleX, y: scaleY, z: 1 }),
                this.getTranslateMatrix({ x: left, y: top, z: 0 })
            );
            el.intialMatrix = el.matrix;

            el.style.cssText = `
                width: ${img.naturalWidth}px;
                height: ${img.naturalHeight}px;
                transform:${this.matrixTostr(el.matrix)};
            `;

            el.dataset.initialWidth = ( styleObj.width * scaleX ).toString();
            el.dataset.initialHeight = ( styleObj.height * scaleY ).toString();
            el.dataset.top = top.toString();
            el.dataset.initialTop = top.toString();
            el.dataset.left = left.toString();
            el.dataset.initialLeft = left.toString();
            el.dataset.viewTopInitial = styleObj.top.toString();
            el.dataset.viewLeftInitial = styleObj.left.toString();
        }
        this.recordInitialData(els, record)

    }
    pcRecordInitialData(els: NodeListOf<HTMLElement>) {
        const record = (el: HTMLElement, img: HTMLImageElement) => {
            let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
            let imgContainerHeight: number = imgContainerRect.height;
            let imgBoundingRect: ClientRect = img.getBoundingClientRect();

            let top: number = 0;
            let left: number = 0;
            let width: number = imgBoundingRect.width;
            let height: number = imgBoundingRect.height;

            if (imgBoundingRect.width > img.naturalWidth) {
                width = img.naturalWidth;
                height = img.naturalHeight;
            }

            left = (this.containerWidth - width) / 2;
            top = (imgContainerHeight - height) / 2;
            top < 0 && (top = 0)
            el.style.width = width + 'px';

            el.dataset.initialWidth = width.toString();
            el.dataset.initialHeight = height.toString();
            el.dataset.top = top.toString();
            el.dataset.initialTop = top.toString();
            el.dataset.left = left.toString();
            el.dataset.initialLeft = left.toString();
            el.dataset.viewTopInitial = imgBoundingRect.top.toString();
            el.dataset.viewLeftInitial = imgBoundingRect.left.toString();
            el.dataset.rotateDeg = '0';
            el.dataset.loaded = "true";

            el.style.top = `${top}px`;
            el.style.left = `${left}px`;
        }

        this.recordInitialData(els, record)

    }
    recordInitialData(els: NodeListOf<HTMLElement>, record: Function) {
        /**
         * 记录并设置初始top，left值
         */
        els.forEach((el) => {
            const img = el as HTMLImageElement;
            if (img.complete) {
                record(el, img);
            } else {
                el.dataset.loaded = "false";
                img.onload = function () {
                    record(el, img)
                }
            }
            img.onerror = (e: Event) => {

                let imgContainerRect: ClientRect = this.imgContainer.getBoundingClientRect();
                let imgContainerHeight: number = imgContainerRect.height;
                const styleObj: ClientRect = el.getBoundingClientRect();

                const top: number = (imgContainerHeight - styleObj.height) / 2;

                el.dataset.initialWidth = styleObj.width.toString();
                el.dataset.initialHeight = styleObj.height.toString();
                el.dataset.top = top.toString();
                el.dataset.initialTop = top.toString();

                el.dataset.loaded = "false";

                el.style.top = `${top}px`;

                (<HTMLImageElement>(e.currentTarget)).alt = "图片加载错误"
            }
        })

    }

    handlePcClick(e: MouseEvent): void {
        /**
         * 这里把操作派发
         */

        const type: string = (<HTMLElement>(e.target)).dataset.type;

        if (this.operateMaps[type]) {
            this[this.operateMaps[type]](e);
            return
        }
    }
    handleTouchStart(e: TouchEvent & MouseEvent) {
        e.preventDefault();
        
        switch (e.touches.length) {
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
    handleTwoStart(e: TouchEvent & MouseEvent): void {

        this.curPoint1 = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        this.curPoint2 = {
            x: e.touches[1].clientX,
            y: e.touches[1].clientY
        };

        this.startX = (e.touches[0].clientX);
        this.startY = (e.touches[0].clientY);

    }
    handleOneStart(e: TouchEvent & MouseEvent): void {
        /**
         * 这里把操作派发
         */
        const type: string = (<HTMLElement>(e.target)).dataset.type;
        if (this.operateMaps[type]) {
            this[this.operateMaps[type]](e);
            return
        }
        if ( Date.now() - this.lastClick < 300) {
            /*
                启动一个定时器，如果双击事件发生后就
                取消单击事件的执行
             */
            clearTimeout(this.performerClick)
            this.handleDoubleClick(e);
        } else {
            this.performerClick = setTimeout(() => {
                this.handleClick(e);
            }, 300)

        }
        this.lastClick = Date.now();
        this.getMovePoints(e);

        this.startXForDirection = e.touches[0].clientX;
    }
    handleClick(e?: TouchEvent & MouseEvent) {
        let close: HTMLElement = <HTMLElement>(this.ref.querySelector(`.${this.prefix}close`));
        let bottom: HTMLElement = <HTMLElement>(this.ref.querySelector(`.${this.prefix}bottom`));
        this.showTools = !this.showTools
        if (this.isAnimating) {
            // return;
        }
        if (this.showTools) {
            close.style.display = 'block';
            bottom.style.display = 'block';
        } else {
            close.style.display = 'none';
            bottom.style.display = 'none';
        }
    }
    async handleDoubleClick(e: TouchEvent & MouseEvent) {
        console.log(this.isAnimating,'handleDoubleClick')
        if( this.isAnimating ){
            return;
        }
        this.isAnimating = true;
        showDebugger(this.isAnimating.toString())
        await this.actionExecutor.eventsHanlder.handleDoubleClick(e);
        this.isAnimating = false;
        showDebugger(`animation done.`+this.isAnimating.toString())

    }
    handleToucnEnd(e: TouchEvent & MouseEvent) {
        e.preventDefault();
        
        const taskArray = Array.
            from(this.taskExecuteAfterTEnd.values())
                .sort((a,b) => b.priority - a.priority );

        taskArray.forEach(item => {
            item.callback(e)
        })
        
        this.taskExecuteAfterTEnd.clear();
        
    }
    async handleTEndEnlarge(e: TouchEvent & MouseEvent) {
        // ;debugger;
        // this.isAnimating = false;
    

        const { actionExecutor } = this
        const curItemRect = actionExecutor.viewRect;

        const conWidth: number = actionExecutor.viewWidth / actionExecutor.dpr;
        const conHeight: number = actionExecutor.viewHeight / actionExecutor.dpr;

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
            endX = 0;
        }
        if (curItemHeihgt <= conHeight) {
            recoverY = false;
            endY = 0
        }

        if (recoverX || recoverY) {
            this.isAnimating = true;
            await actionExecutor.eventsHanlder.handleTEndEnlarge(e,endX,endY,0)
            this.isAnimating = false;
        } else {
            this.moveEndTime = Date.now();
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
                let boundryObj = { maxTop, minTop: minTop, maxLeft, minLeft: conWidth - curItemWidth }
                this.isAnimating = true;
                await this.autoMove(degree, curItemViewLeft, curItemViewTop,boundryObj)
                this.isAnimating = false;
            }

        }
        this.moveStartTime = 0;


    }
    async handleTEndEnNormal(e: TouchEvent & MouseEvent) {
       
        if( this.isAnimating ){
            return
        }
        let endX: number = (e.changedTouches[0].clientX);
        const { actionExecutor:{eventsHanlder} } = this;
        let offset = endX - this.touchStartX;
        if( offset === 0 ){
            return;
        }
        this.isAnimating = true;
        await eventsHanlder.handleTEndEnNormal(e,offset);
        this.isAnimating = false;
    }
    genFrame() {
        let curImg: string = this.options.curImg;
        let images: Array<string> = this.options.imgs;

        if (!images || !images.length) {
            console.error("没有图片哦!\n no pictures!");
            return;
        }

        this.imgsNumber = images.length;
        let index: number = images.indexOf(curImg);

        if (index == -1) {
            index = 0;
        }
        this.curIndex = index;
        this.imgContainerMoveX = -(index * this.containerWidth);


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
        let html: string = `
                <div class="${this.prefix}close">
                    <svg t="1563161688682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5430">
                        <path d="M10.750656 1013.12136c-13.822272-13.822272-13.822272-36.347457 0-50.169729l952.200975-952.200975c13.822272-13.822272 36.347457-13.822272 50.169729 0 13.822272 13.822272 13.822272 36.347457 0 50.169729l-952.200975 952.200975c-14.334208 14.334208-36.347457 14.334208-50.169729 0z" fill="#ffffff" p-id="5431"></path><path d="M10.750656 10.750656c13.822272-13.822272 36.347457-13.822272 50.169729 0L1013.633296 963.463567c13.822272 13.822272 13.822272 36.347457 0 50.169729-13.822272 13.822272-36.347457 13.822272-50.169729 0L10.750656 60.920385c-14.334208-14.334208-14.334208-36.347457 0-50.169729z" fill="#ffffff" p-id="5432">
                        </path>
                    </svg>
                </div>
                <div class="${this.prefix}imgContainer"></div>
                <div class="${this.prefix}bottom">
                    <div class="${this.prefix}item ">
                        <svg data-type="rotateLeft" t="1563884004339" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1099" width="200" height="200"><path d="M520.533333 285.866667c140.8 12.8 251.733333 132.266667 251.733334 277.333333 0 153.6-123.733333 277.333333-277.333334 277.333333-98.133333 0-192-55.466667-238.933333-140.8-4.266667-8.533333-4.266667-21.333333 8.533333-29.866666 8.533333-4.266667 21.333333-4.266667 29.866667 8.533333 42.666667 72.533333 119.466667 119.466667 204.8 119.466667 128 0 234.666667-106.666667 234.666667-234.666667s-98.133333-230.4-226.133334-234.666667l64 102.4c4.266667 8.533333 4.266667 21.333333-8.533333 29.866667-8.533333 4.266667-21.333333 4.266667-29.866667-8.533333l-89.6-145.066667c-4.266667-8.533333-4.266667-21.333333 8.533334-29.866667L597.333333 187.733333c8.533333-4.266667 21.333333-4.266667 29.866667 8.533334 4.266667 8.533333 4.266667 21.333333-8.533333 29.866666l-98.133334 59.733334z" p-id="1100" fill="#ffffff"></path></svg>
                    </div>
                    <div class="${this.prefix}item">
                        <svg data-type="rotateRight"  t="1563884064737" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1251" width="200" height="200"><path d="M503.466667 285.866667L405.333333 226.133333c-8.533333-8.533333-12.8-21.333333-8.533333-29.866666 8.533333-8.533333 21.333333-12.8 29.866667-8.533334l145.066666 89.6c8.533333 4.266667 12.8 17.066667 8.533334 29.866667l-89.6 145.066667c-4.266667 8.533333-17.066667 12.8-29.866667 8.533333-8.533333-4.266667-12.8-17.066667-8.533333-29.866667l64-102.4c-123.733333 4.266667-226.133333 106.666667-226.133334 234.666667s106.666667 234.666667 234.666667 234.666667c85.333333 0 162.133333-46.933333 204.8-119.466667 4.266667-8.533333 17.066667-12.8 29.866667-8.533333 8.533333 4.266667 12.8 17.066667 8.533333 29.866666-51.2 85.333333-140.8 140.8-238.933333 140.8-153.6 0-277.333333-123.733333-277.333334-277.333333 0-145.066667 110.933333-264.533333 251.733334-277.333333z" p-id="1252" fill="#ffffff"></path></svg>
                    </div>
                </div>
        `;
        let isIPhoneX: boolean = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812;
        // iPhone XS Max
        let isIPhoneXSMax: boolean = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896;
        // iPhone XR
        let isIPhoneXR: boolean = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896;
        let needHigher: boolean = isIPhoneX || isIPhoneXSMax || isIPhoneXR;
        let style: string = `
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
                z-index: 10;
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
                height: 100%;
                font-size: 0;
                white-space: nowrap;
            }
            
            .${this.prefix}imagePreviewer .${this.prefix}bottom{
                position: absolute;
                bottom: ${needHigher ? 20 : 0}px;
                left: 20px;
                right: 20px;
                z-index: 10;
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
        if (!document.querySelector(`#${this.prefix}style`)) {
            let styleElem = document.createElement('style');
            styleElem.id = `${this.prefix}style`;
            styleElem.innerHTML = style;

            document.querySelector('head').appendChild(styleElem);
        }

        this.ref.querySelector(`.${this.prefix}imgContainer`).append(this.actionExecutor.ref)
        document.body.appendChild(this.ref)
    }
    handleReausetAnimate() {
        if (!window['requestAnimationFrame']) {
            window['requestAnimationFrame'] = (function () {
                return window['webkitRequestAnimationFrame'] ||
                    function (callback: Function) {
                        window.setTimeout(callback, 1000 / 60);
                        return 0;
                    };
            })();
        }

    }
    close(e: MouseEvent & TouchEvent) {
        e.stopImmediatePropagation();
        clearTimeout(this.performerClick)
        this[this.envClient + 'BeforeClose']();
        this.toggleClass(this.ref, this.defToggleClass)
    }
    pcBeforeClose() {
        document.body.style['overflow'] = document.body.dataset['imgPreOverflow']
    }
    mobileBeforeClose() { }
    show(index: number) {
        this.curIndex = index;
        this[this.envClient + 'ReadyShow']();

        let translateX = -index * this.containerWidth - this.imgContainerMoveX;
        this.containerWidth = this.imgContainer.getBoundingClientRect().width;
        this.imgContainerMoveX = -index * this.containerWidth;

        this.imgContainer.matrix = this.matrixMultipy(this.imgContainer.matrix,
            [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [translateX, 0, 0, 1]
            ]
        )
        this.setTransitionProperty({
            el: this.imgContainer,
            time: 0
        })
        let transformStr = this.matrixTostr(this.imgContainer.matrix)
        // this.imgContainer.style.transform = `${transformStr}`;
        this.toggleClass(this.ref, this.defToggleClass)
    }
    mobileReadyShow() { }
    pcReadyShow() {
        let styleDesc: CSSStyleDeclaration = window.getComputedStyle(document.body);
        document.body.dataset['imgPreOverflow'] = styleDesc.overflow;
        document.body.style['overflow'] = 'hidden';
    }
    toggleClass(ref: HTMLElement, className: string) {
        let classes: Array<string> = ref.className.split(' ');
        let index: number = classes.indexOf(className);
        if (index !== -1) {
            classes.splice(index, 1)
        } else {
            classes.push(className)
        }

        ref.className = classes.join(' ');

    }
    getMovePoints(e: MouseEvent & TouchEvent) {
        if( this.movePoints.length > this.maxMovePointCounts ){
            return;
        }
        this.movePoints.push({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        })
        const type = 'resetMovePoints';
        this.addTouchEndTask(type,{
            priority:1,
            callback:() => (this.movePoints = [])
        })//重置收集手指移动时要收集得点))
    }
    decideMoveDirection(){
        let L: number = this.movePoints.length;
        let endPoint: { x: number, y: number } = this.movePoints[L - 1];
        let startPoint: { x: number, y: number } = this.movePoints[0];

        let dx: number = endPoint.x - startPoint.x;
        let dy: number = endPoint.y - startPoint.y;

        let degree: number = Math.atan2(dy, dx) * 180 / Math.PI;
        if (Math.abs(90 - Math.abs(degree)) < 30) {
            this.fingerDirection = 'vertical'
        } else {
            this.fingerDirection = 'horizontal'
        }
        const type = 'resetFingerDirection';
      
        this.addTouchEndTask(type,{
            priority:1,
            callback: () => {
                this.fingerDirection = ''
            }
        })
        
    }
    destroy(): void {
        this.ref.parentNode.removeChild(this.ref);
    }
    testEnv(): string {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            return 'mobile'
        } else {
            return 'pc'
        }
    }

}
applyMixins(ImagePreview, [Move, Zoom, Rotate, Animation, Matrix]);

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    });
}

export { ImagePreview };