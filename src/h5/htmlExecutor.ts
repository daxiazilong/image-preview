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
    
}