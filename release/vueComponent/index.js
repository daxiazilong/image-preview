import { ImagePreview } from "../ts/image-preview";
export var _Vue;
var component = {
    props: {
        images: Array
    },
    mounted: function () {
        var childNodes = this.$refs.imgs.childNodes;
        childNodes = Array.prototype.filter.call(childNodes, (function (item) { return item.nodeType === 1; }));
        var imgPreview = new ImagePreview({
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
    render: new Function("with(this){return _c('div',{ref:'imgs'},[_t('default')],2)}"),
};
var ImagePreviewVue = {
    install: function (Vue) {
        if (this.installed && _Vue === Vue)
            return;
        _Vue = Vue;
        this.installed = true;
        Vue.component('image-preivew', this.imagePreview);
    },
    imagePreview: component
};
export { ImagePreviewVue };
