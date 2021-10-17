import { ImagePreview } from "./image-preview"
export default ( constructor: typeof ImagePreview) => {
    return class extends constructor{
            pcInitial() {
                this.ref.querySelector(`.${this.prefix}close`).addEventListener('click', this.close.bind(this))
                this.ref.addEventListener('click', this.handlePcClick.bind(this));
                
                this.handleResize = this.handleResize.bind(this)
                window.addEventListener('resize',this.handleResize)
            }
            handlePcClick(e:MouseEvent){
                const type: string = (<HTMLElement>(e.target)).dataset.type;
                if (this.operateMaps[type]) {
                    this[this.operateMaps[type]](e);
                    return
                }
            }
            slideBefore(){
                console.log('before')
            }
            slideNext(){
                console.log('next')
            }
    }
}