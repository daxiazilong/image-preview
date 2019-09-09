import ImgPreview from './ImagePreview'

new ImgPreview({
    curImg:'/testImage/IMG_0512.JPG',
    imgs: [
        '/testImage/IMG_0512.JPG',
        '/testImage/main_body3.png',
        '/testImage/main_body3.png',
        '/testImage/test1.jpg',
        '/testImage/main_body3.png',
        '/testImage/main_body3.png',
        '/testImage/BBC82C020430AED149F8D18A0849D241.png'
    ]
});

new ImgPreview({
    selector:'.imageWraper img'
})
const Vue = require('vue');
import {ImagePreviewVue} from '../vueComponent/index'

Vue.use(ImagePreviewVue)
new Vue({
    el:'#el',
    data:function(){
        return{
            imgs: [
                        '/testImage/IMG_0512.JPG',
                        '/testImage/main_body3.png',
                        '/testImage/main_body3.png',
                        '/testImage/test1.jpg',
                        '/testImage/main_body3.png',
                        '/testImage/main_body3.png',
                        '/testImage/BBC82C020430AED149F8D18A0849D241.png'
                    ]
        }
    }
})