import ImgPreview from "../ts/ImagePreview";

export default{
    props:{
        images: Array
    },
    data:function(){
        return{}
    },
    mounted:function(){

        let childNodes = this.$refs.imgs.childNodes;
        childNodes = Array.prototype.filter.call(childNodes,( item => item.nodeType === 1))
        let imgPreview = new ImgPreview({
            curImg:"",
            imgs: this.images
        })

        for( let i = 0 ; i < childNodes.length; i++){
            let childNode = childNodes[i];
            childNode.addEventListener('click',function(){
                imgPreview.show(i)
            })
        }

    },
    template: `
        <div ref="imgs">
            <slot></slot>  
        </div>     
    `
}