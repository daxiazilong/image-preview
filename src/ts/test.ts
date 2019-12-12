import {ImagePreview}  from './image-preview'
import {ImagePreviewVue} from '../vueComponent/index'
import { stat } from 'fs';

const Vue = require('vue');
new ImagePreview({
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

new ImagePreview({
    selector:'.imageWraper img'
})


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
var statShow = document.querySelector('#stat');

window.onerror=function(message, source, lineno, colno, error){
    statShow.innerHTML=`
        ${message}
        ${source}
        ${lineno}
        ${colno}
        ${error}
    `;
}