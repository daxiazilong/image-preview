import { ImagePreview } from '../ts/image-preview'

export class Rotate{
    handleRotateLeft(this: ImagePreview,e: TouchEvent & MouseEvent ) :void{
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
    handleRotateRight(this: ImagePreview,e: TouchEvent & MouseEvent ) :void{
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
}