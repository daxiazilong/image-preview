export default class ImgPreview{
    // 上次点击时间和执行单击事件的计时器
    public lastClick: number = -Infinity;
    public performerClick: any;
    public threshold: number = window.innerWidth / 2;//阈值 手指移动超过这个值则切换下一屏幕
    public startX: number;//手指移动的起始坐标
    public touchStartX: number;
    public curIndex: number = 0;//当前第几个图片
    public imgContainerMoveX: number = 0;//图片容器x轴的移动距离

    public prefix:string = "__"
    public ref: HTMLElement ;
    public imgContainer: HTMLElement;
    
    constructor( options: Object ){
        this.genFrame();
        
        this.imgContainer = this.ref.querySelector(`.${this.prefix}imgContainer`);
        console.log( this.imgContainer );
        this.ref.addEventListener('touchstart',this.handleTouchStart.bind(this));
        this.ref.addEventListener('touchmove',this.handleMove.bind(this));
        this.ref.addEventListener('touchend',this.handleToucnEnd.bind(this));
    }
    handleTouchStart(e: TouchEvent & MouseEvent){
        this.touchStartX = this.startX = e.touches[0].pageX;

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
    handleDoubleClick(e:MouseEvent){
        console.log('double click')
    }
    handleMove(e: TouchEvent & MouseEvent){
        clearTimeout( this.performerClick )
        let curX: number = e.touches[0].pageX;

        let offset = curX - this.startX;
        this.imgContainerMoveX += offset;
        this.startX = curX;

        this.imgContainer.style.transform = `translateX(${ this.imgContainerMoveX }px)`
        
    }
    handleToucnEnd(e: TouchEvent & MouseEvent){
        let endY: number = e.changedTouches[0].pageX;

        if(  endY - this.touchStartX > this.threshold ){//前一张
            if( this.curIndex == 0){
                this.animate()
            }
        }else if( endY - this.touchStartX <= -this.threshold ){//后一张
            console.log('后一张')
        }else{//复原
            console.log('复原')
        }
    }
    animate(){}
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
                        <img src="/testImage/main_body3.png">
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
                display:flex;
                position: relative;
                height: 100%;
                font-size: 0;
                white-space:noWrap;
            }
            .${this.prefix}imagePreviewer .${this.prefix}imgContainer .${this.prefix}item{
                flex: 0 0 ${window.innerWidth}px;
                width: ${window.innerWidth}px;
                height: ${window.innerHeight}px;
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
}