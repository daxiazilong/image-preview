"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImagePreview_1 = require("./ImagePreview");
new ImagePreview_1.default({
    curImg: '/testImage/IMG_0512.JPG',
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
new ImagePreview_1.default({
    selector: '.imageWraper img'
});
var Vue = require('vue');
var index_1 = require("../vueComponent/index");
Vue.use(index_1.ImagePreviewVue);
new Vue({
    el: '#el',
    data: function () {
        return {
            outter: [1, 2, 34],
            imgs: [
                '/testImage/IMG_0512.JPG',
                '/testImage/main_body3.png',
                '/testImage/main_body3.png',
                '/testImage/test1.jpg',
                '/testImage/main_body3.png',
                '/testImage/main_body3.png',
                '/testImage/BBC82C020430AED149F8D18A0849D241.png'
            ]
        };
    },
    methods: {
        increase: function () {
            this.outter.push(0);
        },
        decrease: function () {
            this.outter.pop();
        }
    }
});
window.onerror = function (message, source, lineno, colno, error) {
    var stat = document.querySelector('#stat');
    stat.innerHTML = "\n        " + message + "\n        " + source + "\n        " + lineno + "\n        " + colno + "\n        " + error + "\n    ";
};
