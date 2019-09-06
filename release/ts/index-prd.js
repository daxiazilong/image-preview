var ImagePreview = (function () {
    function ImagePreview(options) {
        this.options = options;
        this.showTools = true;
        this.lastClick = -Infinity;
        this.curIndex = 0;
        this.imgContainerMoveX = 0;
        this.imgContainerMoveY = 0;
        this.screenWidth = window.innerWidth;
        this.slideTime = 300;
        this.zoomScale = 0.05;
        this.isZooming = false;
        this.isAnimating = false;
        this.isMotionless = true;
        this.prefix = "__";
        this.operateMaps = {
            rotateLeft: 'handleRotateLeft',
            rotateRight: 'handleRotateRight'
        };
        if (options.selector) {
            this.bindTrigger();
        }
        this.genFrame();
        this.handleReausetAnimate();
        this.threshold = this.screenWidth / 4;
        this.imgContainer = this.ref.querySelector("." + this.prefix + "imgContainer");
        this.imgItems = this.imgContainer.querySelectorAll("." + this.prefix + "item");
        this.reCordInitialData(this.imgItems);
        this.maxMoveX = this.screenWidth / 2;
        this.minMoveX = -this.screenWidth * (this.imgsNumber - 0.5);
        this.ref.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.ref.addEventListener('touchmove', this.handleMove.bind(this));
        this.ref.addEventListener('touchend', this.handleToucnEnd.bind(this));
        this.ref.querySelector("." + this.prefix + "close").addEventListener('click', this.close.bind(this));
    }
    ImagePreview.prototype.bindTrigger = function () {
        var images = [];
        var triggerItems = document.querySelectorAll(this.options.selector);
        if (!triggerItems.length) {
        }
        triggerItems.forEach(function (element, index) {
            images.push(element.dataset.src);
        });
        this.options.curImg = images[0];
        this.options.imgs = images;
        var imgPreviewer = this;
        triggerItems.forEach(function (element, index) {
            element.addEventListener('click', function (e) {
                imgPreviewer.show(index);
            });
        });
    };
    ImagePreview.prototype.reCordInitialData = function (els) {
        var _this = this;
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var imgContainerHeight = imgContainerRect.height;
        els.forEach(function (el, key, parent) {
            var img = el.querySelector('img');
            var imgRect = img.getBoundingClientRect();
            if (img.complete) {
                var imgContainerRect_1 = _this.imgContainer.getBoundingClientRect();
                var imgContainerHeight_1 = imgContainerRect_1.height;
                var imgContainerWidth = imgContainerRect_1.width;
                var styleObj = el.getBoundingClientRect();
                if (imgContainerHeight_1 < styleObj.height) {
                    el.style.cssText = "\n                        height: 100%;\n                        width: auto;\n                    ";
                    img.style.cssText = "\n                        height: 100%;\n                        width: auto;\n                    ";
                }
                styleObj = el.getBoundingClientRect();
                var top_1 = (imgContainerHeight_1 - styleObj.height) / 2;
                var left = (imgContainerWidth - styleObj.width) / 2;
                el.dataset.initialWidth = styleObj.width.toString();
                el.dataset.initialHeight = styleObj.height.toString();
                el.dataset.top = top_1.toString();
                el.dataset.initialTop = top_1.toString();
                el.dataset.left = left.toString();
                el.dataset.initialLeft = left.toString();
                el.dataset.loaded = "true";
                el.style.top = top_1 + "px";
                el.style.left = left + "px";
            }
            else {
                el.dataset.loaded = "false";
                img.onload = (function (el) {
                    return function () {
                        var imgContainerRect = this.imgContainer.getBoundingClientRect();
                        var imgContainerHeight = imgContainerRect.height;
                        var imgContainerWidth = imgContainerRect.width;
                        var styleObj = el.getBoundingClientRect();
                        if (imgContainerHeight < styleObj.height) {
                            el.style.cssText = "\n                                height: 100%;\n                                width: auto;\n                            ";
                            img.style.cssText = "\n                                height: 100%;\n                                width: auto;\n                            ";
                        }
                        styleObj = el.getBoundingClientRect();
                        var top = (imgContainerHeight - styleObj.height) / 2;
                        var left = (imgContainerWidth - styleObj.width) / 2;
                        el.dataset.initialWidth = styleObj.width.toString();
                        el.dataset.initialHeight = styleObj.height.toString();
                        el.dataset.top = top.toString();
                        el.dataset.initialTop = top.toString();
                        el.dataset.left = left.toString();
                        el.dataset.initialLeft = left.toString();
                        el.dataset.loaded = "true";
                        el.style.top = top + "px";
                        el.style.left = left + "px";
                    };
                })(el).bind(_this);
                img.onerror = (function (el) {
                    return function (e) {
                        var imgContainerRect = this.imgContainer.getBoundingClientRect();
                        var imgContainerHeight = imgContainerRect.height;
                        var styleObj = el.getBoundingClientRect();
                        var top = (imgContainerHeight - styleObj.height) / 2;
                        el.dataset.initialWidth = styleObj.width.toString();
                        el.dataset.initialHeight = styleObj.height.toString();
                        el.dataset.top = top.toString();
                        el.dataset.initialTop = top.toString();
                        el.dataset.loaded = "false";
                        el.style.top = top + "px";
                        (e.currentTarget).alt = "图片加载错误";
                    };
                })(el).bind(_this);
            }
        });
    };
    ImagePreview.prototype.handleTouchStart = function (e) {
        switch (e.touches.length) {
            case 1:
                this.handleOneStart(e);
                break;
            case 2:
                this.handleTwoStart(e);
                break;
            default:
                break;
        }
    };
    ImagePreview.prototype.handleTwoStart = function (e) {
        this.curPoint1 = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        this.curPoint2 = {
            x: e.touches[1].clientX,
            y: e.touches[1].clientY
        };
    };
    ImagePreview.prototype.handleOneStart = function (e) {
        var _this = this;
        var type = (e.target).dataset.type;
        if (this.operateMaps[type]) {
            this[this.operateMaps[type]](e);
            return;
        }
        this.touchStartX = this.startX = Math.round(e.touches[0].clientX);
        this.touchStartY = this.startY = Math.round(e.touches[0].clientY);
        var now = (new Date()).getTime();
        if (now - this.lastClick < 300) {
            clearTimeout(this.performerClick);
            this.handleDoubleClick(e);
        }
        else {
            this.performerClick = setTimeout(function () {
                _this.handleClick(e);
            }, 300);
        }
        this.lastClick = (new Date()).getTime();
    };
    ImagePreview.prototype.handleRotateLeft = function (e) {
        var _this = this;
        var curItem = this.imgItems[this.curIndex];
        var rotateDeg;
        if (curItem.dataset.loaded == 'false') {
            return;
        }
        if (curItem.dataset.rotateDeg) {
            rotateDeg = Number(curItem.dataset.rotateDeg);
        }
        else {
            rotateDeg = 0;
        }
        rotateDeg -= 90;
        this.isAnimating = true;
        curItem.style.cssText += "\n            transition: transform 0.5s;\n            transform: rotateZ( " + rotateDeg + "deg );\n        ";
        curItem.dataset.rotateDeg = rotateDeg.toString();
        setTimeout(function () {
            _this.isAnimating = false;
        }, 550);
    };
    ImagePreview.prototype.handleRotateRight = function (e) {
        var _this = this;
        var curItem = this.imgItems[this.curIndex];
        var rotateDeg;
        if (curItem.dataset.loaded == 'false') {
            return;
        }
        if (curItem.dataset.rotateDeg) {
            rotateDeg = Number(curItem.dataset.rotateDeg);
        }
        else {
            rotateDeg = 0;
        }
        rotateDeg += 90;
        this.isAnimating = true;
        curItem.style.cssText += "\n            transition: transform 0.5s;\n            transform: rotateZ( " + rotateDeg + "deg );\n        ";
        curItem.dataset.rotateDeg = rotateDeg.toString();
        setTimeout(function () {
            _this.isAnimating = false;
        }, 550);
    };
    ImagePreview.prototype.handleClick = function (e) {
        var close = (this.ref.querySelector("." + this.prefix + "close"));
        var bottom = (this.ref.querySelector("." + this.prefix + "bottom"));
        this.showTools = !this.showTools;
        if (this.showTools) {
            close.style.display = 'block';
            bottom.style.display = 'block';
        }
        else {
            close.style.display = 'none';
            bottom.style.display = 'none';
        }
    };
    ImagePreview.prototype.handleDoubleClick = function (e) {
        if (this.isAnimating)
            return;
        this.isAnimating = true;
        var curItem = this.imgItems[this.curIndex];
        var curImg = curItem.querySelector('img');
        if (curItem.dataset.loaded == 'false') {
            this.isAnimating = false;
            return;
        }
        var curItemWidth = curItem.getBoundingClientRect().width;
        var curItemHeight = curItem.getBoundingClientRect().height;
        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');
        var toWidth;
        var toHeight;
        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {
            if (curImg.naturalWidth > curItemHeight) {
                toWidth = curImg.naturalHeight;
            }
            else {
                toWidth = curItemHeight;
            }
            if (curImg.naturalHeight > curItemWidth) {
                toHeight = curImg.naturalWidth;
            }
            else {
                toHeight = curItemWidth;
            }
        }
        else {
            if (curImg.naturalWidth > curItemWidth) {
                toWidth = curImg.naturalWidth;
            }
            else {
                toWidth = curItemWidth;
            }
            if (curImg.naturalHeight > curItemHeight) {
                toHeight = curImg.naturalHeight;
            }
            else {
                toHeight = curItemHeight;
            }
        }
        var scaleX;
        var scaleY;
        var isBigSize = curItem.dataset.isEnlargement == "enlargement";
        if (isBigSize) {
            switch (Math.abs(rotateDeg % 360)) {
                case 0:
                case 180:
                    scaleX = Number(curItem.dataset.initialWidth) / curItemWidth;
                    scaleY = Number(curItem.dataset.initialHeight) / curItemHeight;
                    break;
                case 90:
                case 270:
                    scaleX = Number(curItem.dataset.initialWidth) / curItemHeight;
                    scaleY = Number(curItem.dataset.initialHeight) / curItemWidth;
                    break;
                default:
                    break;
            }
        }
        else {
            scaleX = toWidth / curItemWidth;
            scaleY = toHeight / curItemHeight;
        }
        ;
        if (scaleX > 1 && scaleY > 1) {
            this.setToNaturalImgSize(scaleX, scaleY, e);
        }
        else if (scaleX < 1 && scaleY < 1) {
            this.setToInitialSize(scaleX, scaleY, e);
        }
        else {
            this.isAnimating = false;
        }
    };
    ImagePreview.prototype.setToNaturalImgSize = function (scaleX, scaleY, e) {
        var _this = this;
        var mouseX = e.touches[0].clientX;
        var mouseY = e.touches[0].clientY;
        var curItem = this.imgItems[this.curIndex];
        var curImg = curItem.querySelector('img');
        var curItemViewTop = curItem.getBoundingClientRect().top;
        var curItemViewLeft = curItem.getBoundingClientRect().left;
        var curItemTop = Number(curItem.dataset.top) || 0;
        var curItemLeft = Number(curItem.dataset.left) || 0;
        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');
        var centerX = Number(curItem.dataset.initialWidth) / 2;
        var centerY = Number(curItem.dataset.initialHeight) / 2;
        var toWidth;
        var toHeight;
        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {
            toWidth = curImg.naturalHeight;
            toHeight = curImg.naturalWidth;
        }
        else {
            toWidth = curImg.naturalWidth;
            toHeight = curImg.naturalHeight;
        }
        curItem.dataset.viewTopInitial = curItemViewTop.toString();
        curItem.dataset.viewLeftInitial = curItemViewLeft.toString();
        switch (rotateDeg % 360) {
            case 0:
                curItem.style.cssText = ";\n                    top:" + curItemTop + "px;\n                    left:" + curItemLeft + "px;\n                    transform-origin: " + centerX + "px " + centerY + "px;\n                    transform: \n                        rotateZ(" + rotateDeg + "deg) \n                        scale3d(" + scaleX + "," + scaleY + ",1) \n                        translateY(" + (-(mouseY - curItemViewTop - centerY) * (scaleY - 1)) / scaleY + "px) \n                        translateX(" + (-(mouseX - curItemViewLeft - centerX) * (scaleX - 1)) / scaleX + "px) \n                    ;\n                ";
                break;
            case -180:
            case 180:
                curItem.style.cssText = ";\n                    top:" + curItemTop + "px;\n                    left: " + curItemLeft + "px;\n                    transform-origin: " + centerX + "px " + centerY + "px;\n                    transform: \n                        rotateZ(" + rotateDeg + "deg) scale3d(" + scaleX + "," + scaleY + ",1) \n                        translateY(" + ((mouseY - curItemViewTop - centerY) * (scaleY - 1)) / scaleY + "px) \n                        translateX(" + ((mouseX - curItemViewLeft - centerX) * (scaleX - 1)) / scaleX + "px) \n                    ;\n                ";
                break;
            case -90:
            case 270:
                curItem.style.cssText = ";\n                    top: " + curItemTop + "px;\n                    left: " + curItemLeft + "px;\n                    transform-origin: " + centerX + "px " + centerY + "px ; \n                    transform: \n                        rotateZ(" + rotateDeg + "deg) \n                        scale3d(" + scaleX + "," + scaleY + ",1) \n                        translateX(" + ((mouseY - curItemViewTop - centerX) * (scaleX - 1)) / scaleX + "px) \n                        translateY(" + (-(mouseX - curItemViewLeft - centerY) * (scaleY - 1)) / scaleY + "px) \n                    ;\n                    \n                ";
                break;
            case -270:
            case 90:
                curItem.style.cssText = ";\n                        top: " + curItemTop + "px;\n                        left: " + curItemLeft + "px;\n                        transform-origin: " + centerX + "px " + centerY + "px ; \n                        transform: \n                            rotateZ(" + rotateDeg + "deg) \n                            scale3d(" + scaleX + "," + scaleY + ",1) \n                            translateX(" + (-(mouseY - curItemViewTop - centerX) * (scaleX - 1)) / scaleX + "px) \n                            translateY(" + ((mouseX - curItemViewLeft - centerY) * (scaleY - 1)) / scaleY + "px) \n                        ;\n                        \n                    ";
                break;
            default:
                break;
        }
        curItem.dataset.isEnlargement = 'enlargement';
        var scaledX;
        var scaledY;
        if (Math.abs(rotateDeg % 360) == 90 || Math.abs(rotateDeg % 360) == 270) {
            scaledX = (mouseX - curItemLeft) * scaleY;
            scaledY = (mouseY - curItemTop) * scaleX;
        }
        else {
            scaledX = (mouseX - curItemLeft) * scaleX;
            scaledY = (mouseY - curItemTop) * scaleY;
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
            _this.isAnimating = false;
        }, 550);
    };
    ImagePreview.prototype.setToInitialSize = function (scaleX, scaleY, e) {
        var _this = this;
        var curItem = this.imgItems[this.curIndex];
        var curItemWidth = curItem.getBoundingClientRect().width;
        var curItemHeight = curItem.getBoundingClientRect().height;
        var curItemViewTop = curItem.getBoundingClientRect().top;
        var curItemViewLeft = curItem.getBoundingClientRect().left;
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
                var top_2 = Number(curItem.dataset.top);
                var left = Number(curItem.dataset.left) || 0;
                var viewTopInitial = Number(curItem.dataset.initialTop);
                var viewLeftInitial = Number(curItem.dataset.initialLeft);
                var disteanceY = curItemViewTop + (centerY) * (1 - scaleY) - top_2 - viewTopInitial;
                var distanceX = curItemViewLeft + (centerX) * (1 - scaleX) - left - viewLeftInitial;
                curItem.style.cssText = ";\n                    top:" + curItem.dataset.top + "px;\n                    left:" + curItem.dataset.left + "px;\n                    width: " + toWidth + "px;\n                    height: " + toHeight + "px;\n                    transform-origin: " + centerX + "px " + centerY + "px;\n                    transform: \n                        rotateZ(" + rotateDeg + "deg) \n                        scale3d(" + scaleX + "," + scaleY + ",1) \n                        translateX(" + -(left + distanceX) / scaleX + "px) \n                        translateY(" + -(top_2 + disteanceY) / scaleY + "px)\n                    ;\n                ";
                break;
            case 180:
            case -180:
                {
                    var centerX_1 = curItemWidth / 2;
                    var centerY_1 = curItemHeight / 2;
                    var viewTopInitial_1 = Number(curItem.dataset.initialTop);
                    var viewLeftInitial_1 = Number(curItem.dataset.initialLeft);
                    var top_3 = Number(curItem.dataset.top);
                    var left_1 = Number(curItem.dataset.left) || 0;
                    var disteanceY_1 = curItemViewTop + (centerY_1) * (1 - scaleY) - top_3 - viewTopInitial_1;
                    var distanceX_1 = curItemViewLeft + (centerX_1) * (1 - scaleX) - left_1 - viewLeftInitial_1;
                    curItem.style.cssText = ";\n                        top:" + top_3 + "px;\n                        left:" + left_1 + "px;\n                        width: " + toWidth + "px;\n                        height: " + toHeight + "px;\n                        transform-origin: " + centerX_1 + "px " + centerY_1 + "px;\n                        transform: \n                            rotateZ(" + rotateDeg + "deg) \n                            scale3d(" + scaleX + "," + scaleY + ",1) \n                            translateX(" + (left_1 + distanceX_1) / scaleX + "px) \n                            translateY(" + (top_3 + disteanceY_1) / scaleY + "px)\n                        ;\n                    ";
                }
                break;
            case -90:
            case 270:
                {
                    var centerX_2 = curItemHeight / 2;
                    var centerY_2 = curItemWidth / 2;
                    var viewTopInitial_2 = Number(curItem.dataset.viewTopInitial);
                    var viewLeftInitial_2 = Number(curItem.dataset.viewLeftInitial);
                    var top_4 = Number(curItem.dataset.top);
                    var left_2 = Number(curItem.dataset.left);
                    var disteanceY_2 = curItemViewTop + (centerX_2) * (1 - scaleY) - top_4 - viewTopInitial_2;
                    var distanceX_2 = curItemViewLeft + (centerY_2) * (1 - scaleX) - left_2 - viewLeftInitial_2;
                    curItem.style.cssText = ";\n                        top:" + top_4 + "px;\n                        left:" + left_2 + "px;\n                        width: " + toWidth + "px;\n                        height: " + toHeight + "px;\n                        transform-origin: " + centerX_2 + "px " + centerY_2 + "px 0;\n                        transform: \n                            rotateZ(" + rotateDeg + "deg) \n                            scale3d(" + scaleX + "," + scaleY + ",1) \n                            translateX(" + (top_4 + disteanceY_2) / scaleY + "px) \n                            translateY(" + -(left_2 + distanceX_2) / scaleX + "px)\n                        ;\n\n                    ";
                }
                break;
            case 90:
            case -270:
                {
                    var centerX_3 = curItemHeight / 2;
                    var centerY_3 = curItemWidth / 2;
                    var viewTopInitial_3 = Number(curItem.dataset.viewTopInitial);
                    var viewLeftInitial_3 = Number(curItem.dataset.viewLeftInitial);
                    var top_5 = Number(curItem.dataset.top);
                    var left_3 = Number(curItem.dataset.left);
                    var disteanceY_3 = curItemViewTop + (centerX_3) * (1 - scaleY) - top_5 - viewTopInitial_3;
                    var distanceX_3 = curItemViewLeft + (centerY_3) * (1 - scaleX) - left_3 - viewLeftInitial_3;
                    curItem.style.cssText = ";\n                        top:" + top_5 + "px;\n                        left:" + left_3 + "px;\n                        width: " + toWidth + "px;\n                        height: " + toHeight + "px;\n                        transform-origin: " + centerX_3 + "px " + centerY_3 + "px 0;\n                        transform: \n                            rotateZ(" + rotateDeg + "deg) \n                            scale3d(" + scaleX + "," + scaleY + ",1) \n                            translateX(" + -(top_5 + disteanceY_3) / scaleY + "px) \n                            translateY(" + (left_3 + distanceX_3) / scaleX + "px)\n                        ;\n\n                    ";
                }
                break;
            default:
                break;
        }
        curItem.dataset.top = curItem.dataset.initialTop;
        curItem.dataset.left = curItem.dataset.initialLeft;
        curItem.dataset.isEnlargement = 'shrink';
        setTimeout(function () {
            curItem.style.cssText = ";\n                                transform: rotateZ(" + rotateDeg + "deg);\n                                top:" + Number(curItem.dataset.initialTop) + "px;\n                                left: " + Number(curItem.dataset.initialLeft) + "px;\n                                width: " + curItem.dataset.initialWidth + "px;\n                                height: " + curItem.dataset.initialHeight + "px;\n                                transition: none;\n                                ";
            _this.isAnimating = false;
        }, 550);
    };
    ImagePreview.prototype.handleMove = function (e) {
        e.preventDefault();
        clearTimeout(this.performerClick);
        if (this.isAnimating) {
            return;
        }
        if (e.touches.length == 2) {
            this.handleZoom(e);
            return;
        }
        var curItem = this.imgItems[this.curIndex];
        var isBoundaryLeft = curItem.dataset.toLeft == 'true';
        var isBoundaryRight = curItem.dataset.toRight == 'true';
        var direction = e.touches[0].clientX - this.startX > 0 ? 'right' : 'left';
        this.isMotionless = false;
        if (curItem.dataset.isEnlargement == 'enlargement') {
            if ((isBoundaryLeft && direction == 'right') || (isBoundaryRight && direction == 'left')) {
                this.handleMoveNormal(e);
            }
            else {
                this.handleMoveEnlage(e);
            }
        }
        else {
            this.handleMoveNormal(e);
        }
    };
    ImagePreview.prototype.handleMoveNormal = function (e) {
        var curX = Math.round(e.touches[0].clientX);
        var offset = curX - this.startX;
        this.imgContainerMoveX += offset;
        if (this.imgContainerMoveX > this.maxMoveX) {
            this.imgContainerMoveX = this.maxMoveX;
        }
        else if (this.imgContainerMoveX < this.minMoveX) {
            this.imgContainerMoveX = this.minMoveX;
        }
        this.startX = curX;
        this.imgContainer.style.transform = "translateX(" + this.imgContainerMoveX + "px)";
    };
    ImagePreview.prototype.handleMoveEnlage = function (e) {
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        var conHeight = imgContainerRect.height;
        var curItem = this.imgItems[this.curIndex];
        if (curItem.dataset.loaded == 'false') {
            return;
        }
        var curItemWidth = curItem.getBoundingClientRect().width;
        var curItemHeihgt = curItem.getBoundingClientRect().height;
        var curX = Math.round(e.touches[0].clientX);
        var curY = Math.round(e.touches[0].clientY);
        var offsetX = curX - this.startX;
        var offsetY = curY - this.startY;
        var curItemTop = Number(curItem.dataset.top);
        var curItemLeft = Number(curItem.dataset.left);
        var curTop;
        var curLeft;
        if (curItemWidth > conWidth) {
            curLeft = curItemLeft + offsetX;
        }
        else {
            curLeft = curItemLeft;
        }
        if (curItemHeihgt > conHeight) {
            curTop = curItemTop + offsetY;
        }
        else {
            curTop = curItemTop;
        }
        curItem.style.cssText += "\n            top: " + curTop + "px;\n            left: " + curLeft + "px;\n        ";
        curItem.dataset.top = (curTop).toString();
        curItem.dataset.left = (curLeft).toString();
        this.startX = curX;
        this.startY = curY;
    };
    ImagePreview.prototype.handleZoom = function (e) {
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
            this.isAnimating = false;
            return;
        }
        if (curItem.dataset.isEnlargement !== 'enlargement') {
            var curItemViewTop = curItem.getBoundingClientRect().top;
            var curItemViewLeft = curItem.getBoundingClientRect().left;
            curItem.dataset.viewTopInitial = curItemViewTop.toString();
            curItem.dataset.viewLeftInitial = curItemViewLeft.toString();
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
        if (distaceBefore > distanceNow) {
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
        else if (distaceBefore < distanceNow) {
            curItem.dataset.isEnlargement = 'enlargement';
            curItem.dataset.top = (top - (this.zoomScale) * centerY).toString();
            curItem.dataset.left = (left - (this.zoomScale) * centerX).toString();
            switch (Math.abs(rotateDeg % 360)) {
                case 0:
                case 180:
                    curItem.style.cssText += "\n                            width: " + curItemWidth * (1 + this.zoomScale) + "px;\n                            height: " + curItemHeihgt * (1 + this.zoomScale) + "px;\n                            top: " + curItem.dataset.top + "px;\n                            left: " + curItem.dataset.left + "px;\n                    ";
                    break;
                case 90:
                case 270:
                    curItem.style.cssText += "\n                            height: " + curItemWidth * (1 + this.zoomScale) + "px;\n                            width: " + curItemHeihgt * (1 + this.zoomScale) + "px;\n                            left: " + curItem.dataset.left + "px;\n                            top: " + curItem.dataset.top + "px;\n                    ";
                    break;
                default:
                    break;
            }
        }
        this.isAnimating = false;
    };
    ImagePreview.prototype.handleToucnEnd = function (e) {
        if (this.isAnimating || e.changedTouches.length !== 1 || this.isMotionless) {
            return;
        }
        var type = (e.target).dataset.type;
        if (this.operateMaps[type]) {
            return;
        }
        if (e.touches.length == 0) {
            this.isZooming = false;
        }
        var curItem = this.imgItems[this.curIndex];
        this.isMotionless = true;
        var isBoundary = curItem.dataset.toLeft == 'true' || curItem.dataset.toRight == 'true';
        if (curItem.dataset.isEnlargement == 'enlargement') {
            if (isBoundary) {
                this.handleTEndEnNormal(e);
                curItem.dataset.toLeft = 'false';
                curItem.dataset.toRight = 'false';
            }
            else {
                this.handleTEndEnlarge(e);
            }
        }
        else {
            this.handleTEndEnNormal(e);
        }
    };
    ImagePreview.prototype.handleTEndEnlarge = function (e) {
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        var conHeight = imgContainerRect.height;
        var curItem = this.imgItems[this.curIndex];
        var curImg = curItem.querySelector('img');
        var curItemWidth = curItem.getBoundingClientRect().width;
        var curItemHeihgt = curItem.getBoundingClientRect().height;
        var offsetX = 0;
        var offsetY = 0;
        var rotateDeg = Number(curItem.dataset.rotateDeg || '0');
        switch (Math.abs(rotateDeg % 360)) {
            case 90:
            case 270:
                offsetX = (curItemWidth - curItemHeihgt) / 2;
                offsetY = (curItemHeihgt - curItemWidth) / 2;
                break;
            default:
                break;
        }
        var maxTop = offsetY;
        var minTop = conHeight - curItemHeihgt + offsetY;
        var maxLeft = offsetX;
        var minLeft = conWidth - curItemWidth + offsetX;
        var curItemTop = Number(curItem.dataset.top);
        var curItemLeft = Number(curItem.dataset.left);
        var recoverY = false;
        var recoverX = false;
        var vy;
        var stepY;
        var vx;
        var stepX;
        var startX;
        var endX;
        var startY;
        var endY;
        if (curItemLeft > maxLeft) {
            stepX = this.computeStep(curItemLeft - maxLeft, this.slideTime);
            startX = curItemLeft;
            endX = maxLeft;
            recoverX = true;
        }
        else if (curItemLeft < minLeft) {
            stepX = this.computeStep(curItemLeft - minLeft, this.slideTime);
            startX = curItemLeft;
            endX = minLeft;
            recoverX = true;
        }
        if (curItemTop > maxTop) {
            stepY = this.computeStep((curItemTop - maxTop), this.slideTime);
            startY = curItemTop;
            endY = maxTop;
            recoverY = true;
        }
        else if (curItemTop < minTop) {
            stepY = this.computeStep((curItemTop - minTop), this.slideTime);
            startY = curItemTop;
            endY = minTop;
            recoverY = true;
        }
        if (curItemWidth <= conWidth) {
            recoverX = false;
            curItem.dataset.toLeft = 'true';
            curItem.dataset.toRight = 'true';
        }
        if (curItemHeihgt <= conHeight) {
            recoverY = false;
            curItem.dataset.toTop = 'true';
            curItem.dataset.toBottom = 'true';
        }
        if (recoverX && recoverY) {
            this.animateMultiValue(curItem, [
                {
                    prop: 'left',
                    start: startX,
                    end: endX,
                    step: -stepX
                }, {
                    prop: 'top',
                    start: startY,
                    end: endY,
                    step: -stepY
                }
            ]);
            curItem.dataset.left = "" + endX;
            curItem.dataset.top = "" + endY;
            if (endX == maxLeft) {
                curItem.dataset.toLeft = 'true';
                curItem.dataset.toRight = 'false';
            }
            else if (endX == minLeft) {
                curItem.dataset.toLeft = 'false';
                curItem.dataset.toRight = 'true';
            }
            if (endY == maxTop) {
                curItem.dataset.toTop = 'true';
                curItem.dataset.toBottom = 'false';
            }
            else if (endY == minTop) {
                curItem.dataset.toTop = 'false';
                curItem.dataset.toBottom = 'true';
            }
        }
        else if (recoverX) {
            this.animate(curItem, 'left', startX, endX, -stepX);
            curItem.dataset.left = "" + endX;
            if (endX == maxLeft) {
                curItem.dataset.toLeft = 'true';
                curItem.dataset.toRight = 'false';
            }
            else if (endX == minLeft) {
                curItem.dataset.toLeft = 'false';
                curItem.dataset.toRight = 'true';
            }
        }
        else if (recoverY) {
            this.animate(curItem, 'top', startY, endY, -stepY);
            curItem.dataset.top = "" + endY;
            if (endY == maxTop) {
                curItem.dataset.toTop = 'true';
                curItem.dataset.toBottom = 'false';
            }
            else if (endY == minTop) {
                curItem.dataset.toTop = 'false';
                curItem.dataset.toBottom = 'true';
            }
        }
        else {
            curItem.dataset.toLeft = 'false';
            curItem.dataset.toRight = 'false';
            curItem.dataset.toTop = 'false';
            curItem.dataset.toBottom = 'false';
        }
    };
    ImagePreview.prototype.handleTEndEnNormal = function (e) {
        var endX = Math.round(e.changedTouches[0].clientX);
        if (endX - this.touchStartX >= this.threshold) {
            if (this.curIndex == 0) {
                this.slideSelf();
                return;
            }
            this.curIndex--;
            this.slidePrev();
        }
        else if (endX - this.touchStartX <= -this.threshold) {
            if (this.curIndex + 1 == this.imgsNumber) {
                this.slideSelf();
                return;
            }
            this.curIndex++;
            this.slideNext();
        }
        else {
            this.slideSelf();
        }
    };
    ImagePreview.prototype.slideNext = function () {
        var endX = -(this.curIndex * this.screenWidth);
        if (endX < -(this.screenWidth * this.imgsNumber - 1)) {
            endX = -(this.screenWidth * this.imgsNumber - 1);
            this.curIndex = this.imgsNumber - 1;
        }
        var step = this.computeStep(Math.abs(endX - this.imgContainerMoveX), this.slideTime);
        this.animate(this.imgContainer, 'transform', this.imgContainerMoveX, endX, -step);
    };
    ImagePreview.prototype.slidePrev = function () {
        var endX = -(this.curIndex * this.screenWidth);
        if (endX > 0) {
            endX = 0;
            this.curIndex = 0;
        }
        var step = this.computeStep(Math.abs(endX - this.imgContainerMoveX), this.slideTime);
        this.animate(this.imgContainer, 'transform', this.imgContainerMoveX, endX, step);
    };
    ImagePreview.prototype.slideSelf = function () {
        var endX = -(this.curIndex * this.screenWidth);
        if (endX < this.imgContainerMoveX) {
            var step = this.computeStep(Math.abs(endX - this.imgContainerMoveX), this.slideTime);
            this.animate(this.imgContainer, 'transform', this.imgContainerMoveX, endX, -step);
        }
        else {
            var step = this.computeStep(Math.abs(endX - this.imgContainerMoveX), this.slideTime);
            this.animate(this.imgContainer, 'transform', this.imgContainerMoveX, endX, step);
        }
    };
    ImagePreview.prototype.animate = function (el, prop, start, end, step) {
        var _this = this;
        if (this.isAnimating) {
            return;
        }
        this.isAnimating = true;
        if (Math.abs(end - start) < Math.abs(step)) {
            step = end - start;
        }
        function processStyle() {
            switch (prop) {
                case 'transform':
                    el.style.transform = "translateX( " + (start + step) + "px )";
                    ;
                    break;
                case 'top':
                    el.style.top = start + step + "px";
                    break;
                case 'left':
                    el.style.left = start + step + "px";
                    break;
                default:
                    break;
            }
        }
        processStyle();
        start += step;
        var move = function () {
            if (Math.abs(end - start) < Math.abs(step)) {
                step = end - start;
            }
            processStyle();
            start += step;
            if (start !== end) {
                requestAnimationFrame(move);
            }
            else {
                if (prop == 'transform') {
                    _this.imgContainerMoveX = end;
                }
                _this.isAnimating = false;
            }
        };
        if (start !== end) {
            requestAnimationFrame(move);
        }
        else {
            if (prop == 'transform') {
                this.imgContainerMoveX = end;
            }
            this.isAnimating = false;
        }
    };
    ImagePreview.prototype.animateMultiValue = function (el, options) {
        var _this = this;
        if (this.isAnimating) {
            return;
        }
        this.isAnimating = true;
        for (var i = 0, L = options.length; i < L; i++) {
            var item = options[i];
        }
        var processStyle = function () {
            var isFullFilled = true;
            for (var i = 0, L = options.length; i < L; i++) {
                var item = options[i];
                if (Math.abs(item.start - item.end) < Math.abs(item.step)) {
                    item.step = item.end - item.start;
                }
                item.start += item.step;
                el.style[item.prop] = item.start + "px";
                if (item.start !== item.end) {
                    isFullFilled = false;
                }
            }
            if (isFullFilled) {
                _this.isAnimating = false;
            }
            else {
                requestAnimationFrame(processStyle);
            }
        };
        processStyle();
    };
    ImagePreview.prototype.computeStep = function (displacement, time) {
        var v = displacement / time;
        var frequency = 1000 / 60;
        return v * frequency;
    };
    ImagePreview.prototype.genFrame = function () {
        var _this = this;
        var curImg = this.options.curImg;
        var images = this.options.imgs;
        if (!images || !images.length) {
            console.error("没图，玩你麻痹");
            return;
        }
        this.imgsNumber = images.length;
        var index = images.indexOf(curImg);
        var imagesHtml = '';
        if (index == -1) {
            index = 0;
        }
        this.curIndex = index;
        this.imgContainerMoveX = -(index * this.screenWidth);
        images.forEach(function (src) {
            imagesHtml += "\n            <div class=\"" + _this.prefix + "itemWraper\">\n                <div class=\"" + _this.prefix + "item\">\n                    <img src=\"" + src + "\">\n                </div>\n            </div>\n            ";
        });
        var html = "\n                <div class=\"" + this.prefix + "close\">\n                    <svg t=\"1563161688682\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"5430\">\n                        <path d=\"M10.750656 1013.12136c-13.822272-13.822272-13.822272-36.347457 0-50.169729l952.200975-952.200975c13.822272-13.822272 36.347457-13.822272 50.169729 0 13.822272 13.822272 13.822272 36.347457 0 50.169729l-952.200975 952.200975c-14.334208 14.334208-36.347457 14.334208-50.169729 0z\" fill=\"#ffffff\" p-id=\"5431\"></path><path d=\"M10.750656 10.750656c13.822272-13.822272 36.347457-13.822272 50.169729 0L1013.633296 963.463567c13.822272 13.822272 13.822272 36.347457 0 50.169729-13.822272 13.822272-36.347457 13.822272-50.169729 0L10.750656 60.920385c-14.334208-14.334208-14.334208-36.347457 0-50.169729z\" fill=\"#ffffff\" p-id=\"5432\">\n                        </path>\n                    </svg>\n                </div>\n                <div class=\"" + this.prefix + "imgContainer\">\n                    " + imagesHtml + "\n                </div>\n                <div class=\"" + this.prefix + "bottom\">\n                    <div class=\"" + this.prefix + "item \">\n                        <svg data-type=\"rotateLeft\" t=\"1563884004339\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1099\" width=\"200\" height=\"200\"><path d=\"M520.533333 285.866667c140.8 12.8 251.733333 132.266667 251.733334 277.333333 0 153.6-123.733333 277.333333-277.333334 277.333333-98.133333 0-192-55.466667-238.933333-140.8-4.266667-8.533333-4.266667-21.333333 8.533333-29.866666 8.533333-4.266667 21.333333-4.266667 29.866667 8.533333 42.666667 72.533333 119.466667 119.466667 204.8 119.466667 128 0 234.666667-106.666667 234.666667-234.666667s-98.133333-230.4-226.133334-234.666667l64 102.4c4.266667 8.533333 4.266667 21.333333-8.533333 29.866667-8.533333 4.266667-21.333333 4.266667-29.866667-8.533333l-89.6-145.066667c-4.266667-8.533333-4.266667-21.333333 8.533334-29.866667L597.333333 187.733333c8.533333-4.266667 21.333333-4.266667 29.866667 8.533334 4.266667 8.533333 4.266667 21.333333-8.533333 29.866666l-98.133334 59.733334z\" p-id=\"1100\" fill=\"#ffffff\"></path></svg>\n                    </div>\n                    <div class=\"" + this.prefix + "item\">\n                        <svg data-type=\"rotateRight\" t=\"1563884064737\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1251\" width=\"200\" height=\"200\"><path d=\"M503.466667 285.866667L405.333333 226.133333c-8.533333-8.533333-12.8-21.333333-8.533333-29.866666 8.533333-8.533333 21.333333-12.8 29.866667-8.533334l145.066666 89.6c8.533333 4.266667 12.8 17.066667 8.533334 29.866667l-89.6 145.066667c-4.266667 8.533333-17.066667 12.8-29.866667 8.533333-8.533333-4.266667-12.8-17.066667-8.533333-29.866667l64-102.4c-123.733333 4.266667-226.133333 106.666667-226.133334 234.666667s106.666667 234.666667 234.666667 234.666667c85.333333 0 162.133333-46.933333 204.8-119.466667 4.266667-8.533333 17.066667-12.8 29.866667-8.533333 8.533333 4.266667 12.8 17.066667 8.533333 29.866666-51.2 85.333333-140.8 140.8-238.933333 140.8-153.6 0-277.333333-123.733333-277.333334-277.333333 0-145.066667 110.933333-264.533333 251.733334-277.333333z\" p-id=\"1252\" fill=\"#ffffff\"></path></svg>\n                    </div>\n                </div>\n        ";
        var style = "\n            ." + this.prefix + "imagePreviewer{\n                position: fixed;\n                top: 100% ;\n                left: 100%;\n                width: 100%;\n                height: 100%;\n                background: rgba(0,0,0,1);\n                color:#fff;\n                transform: translate3d(0,0,0);\n                transition: left 0.5s;\n                overflow:hidden;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "close{\n                position: absolute;\n                top: 20px;\n                right: 20px;\n                z-index: 1;\n                box-sizing: border-box;\n                width: 22px;\n                height: 22px;\n                cursor:pointer;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "close svg{\n                width: 100%;\n                height: 100%;             \n            }\n            ." + this.prefix + "imagePreviewer svg{\n                overflow:visible;\n            }\n            ." + this.prefix + "imagePreviewer svg path{\n                stroke: #948888;\n                stroke-width: 30px;\n            }\n            \n            ." + this.prefix + "imagePreviewer " + this.prefix + ".close." + this.prefix + "scroll{\n                height: 0;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "imgContainer{\n                position: relative;\n                transform: translateX( " + this.imgContainerMoveX + "px );\n                height: 100%;\n                font-size: 0;\n                white-space: nowrap;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "itemWraper{\n                box-sizing:border-box;\n                position: relative;\n                display:inline-block;\n                width: 100%;\n                height: 100%;\n                overflow:hidden;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "imgContainer ." + this.prefix + "item{\n                box-sizing:border-box;\n                position: absolute;\n                width: 100%;\n                height: auto;\n                font-size: 14px;\n                white-space: normal;\n                transition: transform 0.5s;\n                border: 1px solid red;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "item img{\n                width: 100%;\n                height: auto;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "bottom{\n                position: absolute;\n                bottom: 0;\n                left: 20px;\n                right: 20px;\n                padding:10px;\n                text-align: center;\n                border-top: 1px solid rgba(255, 255, 255, .2);\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "bottom ." + this.prefix + "item{\n                display:inline-block;\n                width: 22px;\n                height: 22px;\n                margin-right: 10px;\n                cursor:pointer;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "bottom ." + this.prefix + "item svg{\n                width: 100%;\n                height: 100%;\n            }\n        ";
        this.ref = document.createElement('div');
        this.ref.className = this.prefix + "imagePreviewer";
        this.ref.innerHTML = html;
        var styleElem = document.createElement('style');
        styleElem.innerHTML = style;
        document.querySelector('head').appendChild(styleElem);
        document.body.appendChild(this.ref);
    };
    ImagePreview.prototype.handleReausetAnimate = function () {
        if (!window['requestAnimationFrame']) {
            window['requestAnimationFrame'] = (function () {
                return window['webkitRequestAnimationFrame'] ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                        return 0;
                    };
            })();
        }
    };
    ImagePreview.prototype.close = function (e) {
        e.stopImmediatePropagation();
        clearTimeout(this.performerClick);
        this.ref.style.cssText = "\n            left: 100%;\n            top:0%;\n        ";
    };
    ImagePreview.prototype.show = function (index) {
        this.curIndex = index;
        this.imgContainerMoveX = -index * this.screenWidth;
        this.imgContainer.style.transform = "translateX( " + this.imgContainerMoveX + "px )";
        this.ref.style.cssText = "\n            top: 0%;\n            left: 0%;\n        ";
    };
    return ImagePreview;
}());
