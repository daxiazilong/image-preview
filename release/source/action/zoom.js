var Zoom = /** @class */ (function () {
    function Zoom() {
    }
    Zoom.prototype.setToNaturalImgSize = function (toWidth, toHeight, scaleX, scaleY, e) {
        var _this = this;
        /**
         * 踩坑记
         * transform-origin 的参考点始终时对其初始位置来说的
         * scale之后的元素, 实际的偏移路径等于 translate 的位移等于 位移 * scale
         */
        var mouseX = e.touches[0].clientX;
        var mouseY = e.touches[0].clientY;
        var curItem = this.imgItems[this.curIndex];
        // 以下为旋转之后缩放时需要用到的参数
        var curItemViewTop = curItem.getBoundingClientRect().top; //当前元素距离视口的top
        var curItemViewLeft = curItem.getBoundingClientRect().left; //当前元素距离视口的left
        var curItemTop = Number(curItem.dataset.top) || 0;
        var curItemLeft = Number(curItem.dataset.left) || 0;
        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');
        var centerX = Number(curItem.dataset.initialWidth) / 2;
        var centerY = Number(curItem.dataset.initialHeight) / 2;
        var originWidth = curItem.style.width;
        var originHeight = curItem.style.height;
        switch (rotateDeg % 360) {
            case 0:
                var translateX = (-(mouseX - curItemViewLeft - centerX) * (scaleX - 1)) / scaleX;
                if (toWidth == this.containerWidth) {
                    translateX = 0;
                }
                curItem.style.cssText = ";\n                    top:" + curItemTop + "px;\n                    left:" + curItemLeft + "px;\n                    width:" + originWidth + ";\n                    height:" + originHeight + ";\n                    transform-origin: " + centerX + "px " + centerY + "px;\n                    transform: \n                        rotateZ(" + rotateDeg + "deg) \n                        scale3d(" + scaleX + "," + scaleY + ",1) \n                        translateY(" + (-(mouseY - curItemViewTop - centerY) * (scaleY - 1)) / scaleY + "px) \n                        translateX(" + translateX + "px) \n                    ;\n                ";
                break;
            case -180:
            case 180:
                curItem.style.cssText = ";\n                    top:" + curItemTop + "px;\n                    left: " + curItemLeft + "px;\n                    width:" + originWidth + ";\n                    height:" + originHeight + ";\n                    transform-origin: " + centerX + "px " + centerY + "px;\n                    transform: \n                        rotateZ(" + rotateDeg + "deg) scale3d(" + scaleX + "," + scaleY + ",1) \n                        translateY(" + ((mouseY - curItemViewTop - centerY) * (scaleY - 1)) / scaleY + "px) \n                        translateX(" + ((mouseX - curItemViewLeft - centerX) * (scaleX - 1)) / scaleX + "px) \n                    ;\n                ";
                break;
            case -90:
            case 270:
                /**
                 * 笔记：
                 * 以 y轴偏移举例，因为旋转 -90或270度之后，
                 * y轴的位移实际由translateX控制，所以需要translateX控制其偏移
                 * (mouseY - curItemViewTop - centerX) * (scaleX -1 ) 是一个点缩放前后产生的位移偏差
                 * 再除以scaleX是因为啥呢，是因为上边可能讲过 translate x px 实际效果是 x * scaleX 的大小
                 */
                curItem.style.cssText = ";\n                    top: " + curItemTop + "px;\n                    left: " + curItemLeft + "px;\n                    width:" + originWidth + ";\n                    height:" + originHeight + ";\n                    transform-origin: " + centerX + "px " + centerY + "px ; \n                    transform: \n                        rotateZ(" + rotateDeg + "deg) \n                        scale3d(" + scaleX + "," + scaleY + ",1) \n                        translateX(" + ((mouseY - curItemViewTop - centerX) * (scaleX - 1)) / scaleX + "px) \n                        translateY(" + (-(mouseX - curItemViewLeft - centerY) * (scaleY - 1)) / scaleY + "px) \n                    ;\n                    \n                ";
                break;
            case -270:
            case 90:
                curItem.style.cssText = ";\n                        top: " + curItemTop + "px;\n                        left: " + curItemLeft + "px;\n                        width:" + originWidth + ";\n                        height:" + originHeight + ";\n                        transform-origin: " + centerX + "px " + centerY + "px ; \n                        transform: \n                            rotateZ(" + rotateDeg + "deg) \n                            scale3d(" + scaleX + "," + scaleY + ",1) \n                            translateX(" + (-(mouseY - curItemViewTop - centerX) * (scaleX - 1)) / scaleX + "px) \n                            translateY(" + ((mouseX - curItemViewLeft - centerY) * (scaleY - 1)) / scaleY + "px) \n                        ;\n                        \n                    ";
                break;
            default:
                break;
        }
        // 放大之后 图片相对视口位置不变
        var scaledX;
        var scaledY;
        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {
            scaledX = (mouseX - curItemLeft) * scaleY;
            scaledY = (mouseY - curItemTop) * scaleX;
        }
        else {
            scaledX = (mouseX - curItemLeft) * scaleX;
            scaledY = (mouseY - curItemTop) * scaleY;
            // 以y轴偏移的计算为例，以下是setTimout 计算时公式的推导
            //- (( mouseY - curItemTop ) * (scaleY - 1) - curItemTop)
            // = curItemTop -  (mouseY - curItemTop)  * (scaleY - 1)   ;
            // = curItemTop - ( mouseY- curItemTop)*scaleY + (mouseY - curItemTop)   
            // = mouseY - ( mouseY- curItemTop)*scaleY
            //  = - (scaledY - mouseY)
        }
        if (this.supportTransitionEnd) {
            var end = this.supportTransitionEnd;
            curItem.addEventListener(end, function () {
                var left = -(scaledX - mouseX);
                if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {
                    curItem.style.cssText = ";\n                        transform: rotateZ(" + rotateDeg + "deg);\n                        width: " + toHeight + "px;\n                        height: " + toWidth + "px;\n                        left: " + left + "px;\n                        top: " + -(scaledY - mouseY) + "px;\n                        transition: none;\n                    ";
                }
                else {
                    if (toWidth == _this.containerWidth) {
                        left = 0;
                    }
                    curItem.style.cssText = ";\n                        transform: rotateZ(" + rotateDeg + "deg);\n                        width: " + toWidth + "px;\n                        height: " + toHeight + "px;\n                        left: " + left + "px;\n                        top: " + -(scaledY - mouseY) + "px;\n                        transition: none;\n                    ";
                }
                curItem.dataset.top = "" + -(scaledY - mouseY);
                curItem.dataset.left = "" + left;
                curItem.dataset.isEnlargement = 'enlargement';
                _this.isAnimating = false;
            }, { once: true });
            return;
        }
        setTimeout(function () {
            if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {
                curItem.style.cssText = ";\n                    transform: rotateZ(" + rotateDeg + "deg);\n                    width: " + toHeight + "px;\n                    height: " + toWidth + "px;\n                    left: " + -(scaledX - mouseX) + "px;\n                    top: " + -(scaledY - mouseY) + "px;\n                    transition: none;\n                ";
            }
            else {
                curItem.style.cssText = ";\n                    transform: rotateZ(" + rotateDeg + "deg);\n                    width: " + toWidth + "px;\n                    height: " + toHeight + "px;\n                    left: " + -(scaledX - mouseX) + "px;\n                    top: " + -(scaledY - mouseY) + "px;\n                    transition: none;\n                ";
            }
            curItem.dataset.top = "" + -(scaledY - mouseY);
            curItem.dataset.left = "" + -(scaledX - mouseX);
            curItem.dataset.isEnlargement = 'enlargement';
            _this.isAnimating = false;
        }, 550);
    };
    Zoom.prototype.setToInitialSize = function (scaleX, scaleY, e) {
        var _this = this;
        var curItem = this.imgItems[this.curIndex];
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var curItemWidth = curItem.getBoundingClientRect().width;
        var curItemHeight = curItem.getBoundingClientRect().height;
        // 以下为旋转之后缩放时需要用到的参数
        var curItemViewTop = curItem.getBoundingClientRect().top; //当前元素距离视口的top
        var curItemViewLeft = curItem.getBoundingClientRect().left; //当前元素距离视口的left
        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');
        var toWidth;
        var toHeight;
        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {
            toWidth = curItemHeight;
            toHeight = curItemWidth;
        }
        else {
            toWidth = curItemWidth;
            toHeight = curItemHeight;
        }
        switch (rotateDeg % 360) {
            case 0:
                var centerX = curItemWidth / 2;
                var centerY = curItemHeight / 2;
                var top_1 = Number(curItem.dataset.top) || 0;
                var left = Number(curItem.dataset.left) || 0;
                var viewTopInitial = Number(curItem.dataset.initialTop);
                var viewLeftInitial = Number(curItem.dataset.initialLeft);
                var disteanceY = curItemViewTop + (centerY) * (1 - scaleY) - top_1 - viewTopInitial;
                var distanceX = curItemViewLeft + (centerX) * (1 - scaleX) - left - viewLeftInitial;
                curItem.style.cssText = ";\n                    top:" + curItem.dataset.top + "px;\n                    left:" + curItem.dataset.left + "px;\n                    width: " + toWidth + "px;\n                    height: " + toHeight + "px;\n                    transform-origin: " + centerX + "px " + centerY + "px;\n                    transform: \n                        rotateZ(" + rotateDeg + "deg) \n                        scale3d(" + scaleX + "," + scaleY + ",1) \n                        translateX(" + -(left + distanceX) / scaleX + "px) \n                        translateY(" + -(top_1 + disteanceY) / scaleY + "px)\n                    ;\n                ";
                break;
            case 180:
            case -180:
                {
                    var centerX_1 = curItemWidth / 2;
                    var centerY_1 = curItemHeight / 2;
                    var viewTopInitial_1 = Number(curItem.dataset.initialTop);
                    var viewLeftInitial_1 = Number(curItem.dataset.initialLeft);
                    var top_2 = Number(curItem.dataset.top);
                    var left_1 = Number(curItem.dataset.left) || 0;
                    var disteanceY_1 = curItemViewTop + (centerY_1) * (1 - scaleY) - top_2 - viewTopInitial_1;
                    var distanceX_1 = curItemViewLeft + (centerX_1) * (1 - scaleX) - left_1 - viewLeftInitial_1;
                    curItem.style.cssText = ";\n                        top:" + top_2 + "px;\n                        left:" + left_1 + "px;\n                        width: " + toWidth + "px;\n                        height: " + toHeight + "px;\n                        transform-origin: " + centerX_1 + "px " + centerY_1 + "px;\n                        transform: \n                            rotateZ(" + rotateDeg + "deg) \n                            scale3d(" + scaleX + "," + scaleY + ",1) \n                            translateX(" + (left_1 + distanceX_1) / scaleX + "px) \n                            translateY(" + (top_2 + disteanceY_1) / scaleY + "px)\n                        ;\n                    ";
                }
                break;
            case -90:
            case 270:
                {
                    var centerX_2 = curItemHeight / 2;
                    var centerY_2 = curItemWidth / 2;
                    var intialItemWidth = Number(curItem.dataset.initialWidth);
                    var intialItemHeight = Number(curItem.dataset.initialHeight);
                    var conWidth = imgContainerRect.width;
                    var conHeight = imgContainerRect.height;
                    // 90 and 270 deg is derived from 0 deg state
                    // next case-expression is same.
                    var viewTopInitial_2 = (conHeight - intialItemWidth) / 2;
                    var viewLeftInitial_2 = (conWidth - intialItemHeight) / 2;
                    var top_3 = Number(curItem.dataset.top);
                    var left_2 = Number(curItem.dataset.left);
                    /**
                     * 缩小的时候要时的图像的位置向原始位置靠近
                     * 以y轴得位移举例
                     * 放大之后 再缩小时 图像顶部移动的距离  centerX*(1-scaleY)
                     *  这个式子是这么推导而来的  Math.abs(centerX* scaleY - centerX)
                     * (这是缩放前后产生的位移距离)，
                     * 减去top（这是使用translate抵消top时产生的y轴位移，使其位置和top等于0时的位置一样）
                     * 这个时候就能得到缩小之后图像距离视口顶部的距离，然后再减去原始的高度（变形前的高度）
                     * 就得到了我们最终需要使其在y轴上偏移的距离
                     */
                    var disteanceY_2 = curItemViewTop + (centerX_2) * (1 - scaleY) - top_3 - viewTopInitial_2;
                    var distanceX_2 = curItemViewLeft + (centerY_2) * (1 - scaleX) - left_2 - viewLeftInitial_2;
                    curItem.style.cssText = ";\n                        top:" + top_3 + "px;\n                        left:" + left_2 + "px;\n                        width: " + toWidth + "px;\n                        height: " + toHeight + "px;\n                        transform-origin: " + centerX_2 + "px " + centerY_2 + "px 0;\n                        transform: \n                            rotateZ(" + rotateDeg + "deg) \n                            scale3d(" + scaleX + "," + scaleY + ",1) \n                            translateX(" + (top_3 + disteanceY_2) / scaleY + "px) \n                            translateY(" + -(left_2 + distanceX_2) / scaleX + "px)\n                        ;\n\n                    ";
                }
                break;
            case 90:
            case -270:
                {
                    var centerX_3 = curItemHeight / 2;
                    var centerY_3 = curItemWidth / 2;
                    var intialItemWidth = Number(curItem.dataset.initialWidth);
                    var intialItemHeight = Number(curItem.dataset.initialHeight);
                    var conWidth = imgContainerRect.width;
                    var conHeight = imgContainerRect.height;
                    var viewTopInitial_3 = (conHeight - intialItemWidth) / 2;
                    var viewLeftInitial_3 = (conWidth - intialItemHeight) / 2;
                    var top_4 = Number(curItem.dataset.top);
                    var left_3 = Number(curItem.dataset.left);
                    var disteanceY_3 = curItemViewTop + (centerX_3) * (1 - scaleY) - top_4 - viewTopInitial_3;
                    var distanceX_3 = curItemViewLeft + (centerY_3) * (1 - scaleX) - left_3 - viewLeftInitial_3;
                    curItem.style.cssText = ";\n                        top:" + top_4 + "px;\n                        left:" + left_3 + "px;\n                        width: " + toWidth + "px;\n                        height: " + toHeight + "px;\n                        transform-origin: " + centerX_3 + "px " + centerY_3 + "px 0;\n                        transform: \n                            rotateZ(" + rotateDeg + "deg) \n                            scale3d(" + scaleX + "," + scaleY + ",1) \n                            translateX(" + -(top_4 + disteanceY_3) / scaleY + "px) \n                            translateY(" + (left_3 + distanceX_3) / scaleX + "px)\n                        ;\n\n                    ";
                }
                break;
            default:
                break;
        }
        curItem.dataset.top = curItem.dataset.initialTop;
        curItem.dataset.left = curItem.dataset.initialLeft;
        if (this.supportTransitionEnd) {
            var end = this.supportTransitionEnd;
            curItem.addEventListener(end, function (e) {
                curItem.style.cssText = ";\n                        transform: rotateZ(" + rotateDeg + "deg);\n                        top:" + Number(curItem.dataset.initialTop) + "px;\n                        left: " + Number(curItem.dataset.initialLeft) + "px;\n                        width: " + curItem.dataset.initialWidth + "px;\n                        height: " + curItem.dataset.initialHeight + "px;\n                        transition: none; \n                        ";
                {
                    /**
                     * bug fix on ios,
                     * frequent zoom with double-click may
                     * cause img fuzzy
                     */
                    var curImg_1 = curItem.querySelector("img");
                    var preImgStyle_1 = curImg_1.style.cssText;
                    curImg_1.style.cssText = "\n                            width: 100%;\n                            height: 100%;\n                        ";
                    setTimeout(function () {
                        curImg_1.style.cssText = preImgStyle_1;
                    }, 10);
                }
                curItem.dataset.isEnlargement = 'shrink';
                _this.isAnimating = false;
            }, { once: true });
            return;
        }
        setTimeout(function () {
            curItem.style.cssText = ";\n                                transform: rotateZ(" + rotateDeg + "deg);\n                                top:" + Number(curItem.dataset.initialTop) + "px;\n                                left: " + Number(curItem.dataset.initialLeft) + "px;\n                                width: " + curItem.dataset.initialWidth + "px;\n                                height: " + curItem.dataset.initialHeight + "px;\n                                transition: none; \n                                ";
            {
                /**
                 * bug fix on ios,
                 * frequent zoom with double-click may
                 * cause img fuzzy
                 */
                var curImg_2 = curItem.querySelector("img");
                var preImgStyle_2 = curImg_2.style.cssText;
                curImg_2.style.cssText = "\n                    width: 100%;\n                    height: 100%;\n                ";
                setTimeout(function () {
                    curImg_2.style.cssText = preImgStyle_2;
                }, 10);
            }
            curItem.dataset.isEnlargement = 'shrink';
            _this.isAnimating = false;
        }, 550);
    };
    Zoom.prototype.handleZoom = function (e) {
        if (!this.isZooming) {
            this.curStartPoint1 = {
                x: this.curPoint1.x,
                y: this.curPoint1.y
            };
            this.curStartPoint2 = {
                x: this.curPoint2.x,
                y: this.curPoint2.y
            };
        }
        this.isZooming = true;
        this.isAnimating = true;
        var curItem = this.imgItems[this.curIndex];
        if (curItem.dataset.loaded == 'false') {
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            this.isAnimating = false;
            return;
        }
        var curItemWidth = curItem.getBoundingClientRect().width;
        var curItemHeihgt = curItem.getBoundingClientRect().height;
        var distaceBefore = Math.sqrt(Math.pow(this.curPoint1.x - this.curPoint2.x, 2) + Math.pow(this.curPoint1.y - this.curPoint2.y, 2));
        var distanceNow = Math.sqrt(Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));
        var top = Number(curItem.dataset.top) || 0;
        var left = Number(curItem.dataset.left) || 0;
        var centerX = (this.curStartPoint1.x + this.curStartPoint2.x) / 2 - left;
        var centerY = (this.curStartPoint1.y + this.curStartPoint2.y) / 2 - top;
        this.curPoint1.x = e.touches[0].clientX;
        this.curPoint1.y = e.touches[0].clientY;
        this.curPoint2.x = e.touches[1].clientX;
        this.curPoint2.y = e.touches[1].clientY;
        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');
        /**
         * 踩坑记：
         * 因为双指所确定的中心坐标 其参考起点始终是
         * 相对于视口的，那么在图片不断放大之后 其所确定的中心坐标必然会较实际有所误差
         * 所以这里在  放大的时候 同时需要在xy坐标加上其实际已经偏移的距离
         * 因为放大之后偏移值必为负值，所以要减 负负得正嘛
         */
        if (distaceBefore > distanceNow) { //缩小
            var centerX_4 = (this.curStartPoint1.x + this.curStartPoint2.x) / 2 - left;
            var centerY_4 = (this.curStartPoint1.y + this.curStartPoint2.y) / 2 - top;
            curItem.dataset.top = (top + (this.zoomScale) * centerY_4).toString();
            curItem.dataset.left = (left + (this.zoomScale) * centerX_4).toString();
            var width = curItemWidth * (1 - this.zoomScale);
            var height = curItemHeihgt * (1 - this.zoomScale);
            switch (Math.abs(rotateDeg % 360)) {
                case 0:
                case 180:
                    if (width <= Number(curItem.dataset.initialWidth)) {
                        width = Number(curItem.dataset.initialWidth);
                        height = Number(curItem.dataset.initialHeight);
                        curItem.dataset.top = curItem.dataset.initialTop;
                        curItem.dataset.left = curItem.dataset.initialLeft;
                        curItem.dataset.isEnlargement = 'shrink';
                    }
                    break;
                case 90:
                case 270:
                    if (height <= Number(curItem.dataset.initialWidth)) {
                        width = Number(curItem.dataset.initialHeight);
                        height = Number(curItem.dataset.initialWidth);
                        curItem.dataset.top = curItem.dataset.initialTop;
                        curItem.dataset.left = curItem.dataset.initialLeft;
                        curItem.dataset.isEnlargement = 'shrink';
                    }
                    break;
            }
            /**
             * 采坑记：
             * 旋转 90 270 这些体位的时候 ，width和height得交换下位置
             * 下同
             */
            switch (Math.abs(rotateDeg % 360)) {
                case 0:
                case 180:
                    curItem.style.cssText = "\n                            transform: rotateZ(" + rotateDeg + "deg); \n                            width: " + width + "px;\n                            height: " + height + "px;\n                            top: " + curItem.dataset.top + "px;\n                            left: " + curItem.dataset.left + "px;\n                    ";
                    break;
                case 90:
                case 270:
                    curItem.style.cssText = "\n                            transform: rotateZ(" + rotateDeg + "deg); \n                            height: " + width + "px;\n                            width: " + height + "px;\n                            left: " + curItem.dataset.left + "px;\n                            top: " + curItem.dataset.top + "px;\n                    ";
                    break;
                default:
                    break;
            }
        }
        else if (distaceBefore < distanceNow) { //放大
            curItem.dataset.isEnlargement = 'enlargement';
            switch (Math.abs(rotateDeg % 360)) {
                case 0:
                case 180:
                    {
                        // biggest width for zoom in
                        var maxWidth = this.screenWidth * 4;
                        if (curItemWidth * (1 + this.zoomScale) > maxWidth) {
                            this.isAnimating = false;
                            return;
                        }
                        curItem.dataset.top = (top - (this.zoomScale) * centerY).toString();
                        curItem.dataset.left = (left - (this.zoomScale) * centerX).toString();
                        curItem.style.cssText += "\n                            width: " + curItemWidth * (1 + this.zoomScale) + "px;\n                            height: " + curItemHeihgt * (1 + this.zoomScale) + "px;\n                            top: " + curItem.dataset.top + "px;\n                            left: " + curItem.dataset.left + "px;\n                    ";
                    }
                    break;
                case 90:
                case 270:
                    {
                        // biggest width for zoom in
                        var maxWidth = this.screenWidth * 4;
                        if (curItemHeihgt * (1 + this.zoomScale) > maxWidth) {
                            this.isAnimating = false;
                            return;
                        }
                        curItem.dataset.top = (top - (this.zoomScale) * centerY).toString();
                        curItem.dataset.left = (left - (this.zoomScale) * centerX).toString();
                        curItem.style.cssText += "\n                            height: " + curItemWidth * (1 + this.zoomScale) + "px;\n                            width: " + curItemHeihgt * (1 + this.zoomScale) + "px;\n                            left: " + curItem.dataset.left + "px;\n                            top: " + curItem.dataset.top + "px;\n                    ";
                    }
                    break;
                default:
                    break;
            }
        }
        this.isAnimating = false;
    };
    return Zoom;
}());
export { Zoom };
