var Rotate = /** @class */ (function () {
    function Rotate() {
    }
    Rotate.prototype.handleRotateLeft = function (e) {
        var _this = this;
        if (this.isAnimating) {
            return;
        }
        var curItem = this.imgItems[this.curIndex];
        var rotateDeg;
        if (curItem.dataset.loaded == 'false') {
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        this.isAnimating = true;
        if (curItem.dataset.rotateDeg) {
            rotateDeg = Number(curItem.dataset.rotateDeg);
        }
        else {
            rotateDeg = 0;
        }
        rotateDeg -= 90;
        curItem.style.cssText += "\n            transition: transform 0.5s;\n            transform: rotateZ( " + rotateDeg + "deg );\n        ";
        if (this.supportTransitionEnd) {
            var end = this.supportTransitionEnd;
            curItem.addEventListener(end, function () {
                curItem.dataset.rotateDeg = rotateDeg.toString();
                _this.isAnimating = false;
            }, { once: true });
            return;
        }
        setTimeout(function () {
            curItem.dataset.rotateDeg = rotateDeg.toString();
            _this.isAnimating = false;
        }, 550);
    };
    Rotate.prototype.handleRotateRight = function (e) {
        var _this = this;
        if (this.isAnimating) {
            return;
        }
        var curItem = this.imgItems[this.curIndex];
        var rotateDeg;
        if (curItem.dataset.loaded == 'false') {
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        this.isAnimating = true;
        if (curItem.dataset.rotateDeg) {
            rotateDeg = Number(curItem.dataset.rotateDeg);
        }
        else {
            rotateDeg = 0;
        }
        rotateDeg += 90;
        curItem.style.cssText += "\n            transition: transform 0.5s;\n            transform: rotateZ( " + rotateDeg + "deg );\n        ";
        if (this.supportTransitionEnd) {
            var end = this.supportTransitionEnd;
            curItem.addEventListener(end, function () {
                curItem.dataset.rotateDeg = rotateDeg.toString();
                _this.isAnimating = false;
            }, { once: true });
            return;
        }
        setTimeout(function () {
            curItem.dataset.rotateDeg = rotateDeg.toString();
            _this.isAnimating = false;
        }, 550);
    };
    return Rotate;
}());
export { Rotate };
