"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vue = require('vue');
var index_1 = require("../vueComponent/index");
exports.imagePreview = {
    install: function (Vue) {
        if (this.installed && exports._Vue === Vue)
            return;
        this.installed = true;
        Vue.component('image-preivew', this.imagePreview);
    },
    imagePreview: index_1.default
};
Vue.use(exports.imagePreview);
new Vue({
    el: '#el',
    data: function () {
        return {
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
    }
});
