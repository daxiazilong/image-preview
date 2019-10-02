(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./image-preview", "../vueComponent/index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var image_preview_1 = require("./image-preview");
    var index_1 = require("../vueComponent/index");
    var Vue = require('vue');
    new image_preview_1.ImagePreview({
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
    new image_preview_1.ImagePreview({
        selector: '.imageWraper img'
    });
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
});
