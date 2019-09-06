"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../ts/index");
exports.default = {
    props: {
        images: Array
    },
    data: function () {
        return {};
    },
    mounted: function () {
        var childNodes = this.$refs.imgs.childNodes;
        childNodes = Array.prototype.filter.call(childNodes, (function (item) { return item.nodeType === 1; }));
        var imgPreview = new index_1.default({
            curImg: "",
            imgs: this.images
        });
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
    template: "\n        <div ref=\"imgs\">\n            <slot></slot>  \n        </div>     \n    "
};
