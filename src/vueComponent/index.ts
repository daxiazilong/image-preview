import ImgPreview from "../ts/index";

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
    methods:{
        test:function(E){
            console.log(E)
        }
    },
    template: `
        <div ref="imgs">
            <slot @click="test"></slot>  
        </div>     
    `
}