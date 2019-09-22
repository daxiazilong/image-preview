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
import { stat } from 'fs';

Vue.use(ImagePreviewVue)
new Vue({
    el:'#el',
    data:function(){
        return{
            outter:[1,2,34],
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
    },
    methods:{
        increase:function(){
            this.outter.push(0)
        },
        decrease:function(){
            this.outter.pop();
        }
    }
})
window.onerror=function(message, source, lineno, colno, error){
    var stat = document.querySelector('#stat');
    stat.innerHTML=`
        ${message}
        ${source}
        ${lineno}
        ${colno}
        ${error}
    `;
}