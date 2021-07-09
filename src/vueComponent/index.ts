import { ImagePreview } from "../core/image-preview";
export let _Vue;
let component =  {
    props:{
        images: Array
    },
    mounted:function(){
        let childNodes = this.$refs.imgs.childNodes;
        childNodes = Array.prototype.filter.call(childNodes,( item => item.nodeType === 1))
        let imgPreview = new ImagePreview({
            curImg:"",
            imgs: this.images
        })
        this.imgPreview = imgPreview;
        for( let i = 0 ; i < childNodes.length; i++){
            let childNode = childNodes[i];
            childNode.addEventListener('click',function(){
                imgPreview.show(i)
            })
        }

    },
    beforeDestroy:function(){
        this.imgPreview.destroy();
    },
    render:  new Function("with(this){return _c('div',{ref:'imgs'},[_t('default')],2)}" ),
}
let ImagePreviewVue = {
    install: function(Vue){
        if( this.installed && _Vue === Vue) return;
        _Vue = Vue;
        this.installed = true;
        Vue.component('image-preivew', this.imagePreview ) 
    },

    imagePreview: component
}

export {ImagePreviewVue};
