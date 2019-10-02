(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../ts/image-preview"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var image_preview_1 = require("../ts/image-preview");
    var component = {
        props: {
            images: Array
        },
        data: function () {
            return {
                imgPreview: null
            };
        },
        mounted: function () {
            var childNodes = this.$refs.imgs.childNodes;
            childNodes = Array.prototype.filter.call(childNodes, (function (item) { return item.nodeType === 1; }));
            var imgPreview = new image_preview_1.ImagePreview({
                curImg: "",
                imgs: this.images
            });
            this.imgPreview = imgPreview;
            var _loop_1 = function (i) {
                var childNode = childNodes[i];
                childNode.addEventListener('click', function () {
                    imgPreview.show(i);
                });
            };
            for (var i = 0; i < childNodes.length; i++) {
                _loop_1(i);
            }
        },
        beforeDestroy: function () {
            this.imgPreview.destroy();
        },
        template: "\n        <div ref=\"imgs\">\n            <slot></slot>  \n        </div>     \n    "
    };
    var ImagePreviewVue = {
        install: function (Vue) {
            if (this.installed && exports._Vue === Vue)
                return;
            exports._Vue = Vue;
            this.installed = true;
            Vue.component('image-preivew', this.imagePreview);
        },
        imagePreview: component
    };
    exports.ImagePreviewVue = ImagePreviewVue;
});
