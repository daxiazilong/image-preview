var htmlExecutor = (function () {
    function htmlExecutor() {
        this.prefix = "__";
        this.ref = this.intialView([]);
    }
    htmlExecutor.prototype.intialView = function (images) {
        var _this = this;
        var imagesNodes = [];
        function genrateStyle() {
            var _this = this;
            var genStyle = function (prop) {
                switch (prop) {
                    case 'conBackground':
                        if (_this.envClient == 'pc') {
                            return 'rgba(0,0,0,0.8)';
                        }
                        else {
                            return 'rgba(0,0,0,1)';
                        }
                    case 'imgWidth':
                        if (_this.envClient == 'pc') {
                            return '100%';
                        }
                        else {
                            return '100%';
                        }
                        ;
                    case 'itemHeight':
                        if (_this.envClient == 'pc') {
                            return '100%';
                        }
                        else {
                            return 'auto';
                        }
                        ;
                    case 'itemScroll':
                        if (_this.envClient == 'pc') {
                            return 'auto ';
                        }
                        else {
                            return 'hidden';
                        }
                        ;
                    case 'item-text-align':
                        if (_this.envClient == 'pc') {
                            return 'center ';
                        }
                        else {
                            return 'initial';
                        }
                        ;
                    default: return '';
                }
            };
            "." + this.prefix + "imagePreviewer ." + this.prefix + "itemWraper{\n                box-sizing:border-box;\n                position: relative;\n                display:inline-block;\n                width: 100% ;\n                height: 100%;\n                overflow: hidden;\n                \n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "imgContainer ." + this.prefix + "item{\n                box-sizing:border-box;\n                position: absolute;\n                top:0;left:0;\n                width: 100% ;\n                height: " + genStyle('itemHeight') + ";\n                overflow-x: " + genStyle('itemScroll') + ";\n                overflow-y:" + genStyle('itemScroll') + ";\n                font-size: 0;\n                text-align: " + genStyle('item-text-align') + ";\n                white-space: normal;\n                z-index:1;\n                transform-style: preserve-3d;\n                backface-visibility: hidden;\n                will-change:transform;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "imgContainer ." + this.prefix + "item::-webkit-scrollbar {\n                width: 5px;\n                height: 8px;\n                background-color: #aaa;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "imgContainer ." + this.prefix + "item::-webkit-scrollbar-thumb {\n                background: #000;\n            }";
        }
        images.forEach(function (src) {
            var div = document.createElement('div');
            div.className = _this.prefix + "itemWraper";
            div.innerHTML = "<img class=\"" + _this.prefix + "item\" src=\"" + src + "\">";
            imagesNodes.push(div);
        });
        return imagesNodes;
    };
    htmlExecutor.prototype.handleDoubleClick = function (e) {
        var curItem = this.imgItems[this.curIndex];
        var curImg = curItem;
        var curItemWidth = curItem.getBoundingClientRect().width;
        var curItemHeight = curItem.getBoundingClientRect().height;
        var rotateDeg = curItem.rotateDeg;
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
            if ((curItemWidth * 1.5) < this.containerWidth)
                if (toHeight > toWidth) {
                    if (toWidth >= this.containerWidth) {
                        toWidth = this.containerWidth;
                        toHeight = (curImg.naturalHeight / curImg.naturalWidth) * toWidth;
                    }
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
        if (scaleX > 1 || scaleY > 1) {
            this.setToNaturalImgSize(toWidth, toHeight, scaleX, scaleY, e);
        }
        else if (scaleX < 1 || scaleY < 1) {
            this.setToInitialSize(scaleX, scaleY, e);
        }
        else {
            this.isAnimating = false;
        }
    };
    htmlExecutor.prototype.setToInitialSize = function (scaleX, scaleY, e) {
        throw new Error("Method not implemented.");
    };
    htmlExecutor.prototype.setToNaturalImgSize = function (toWidth, toHeight, scaleX, scaleY, e) {
        throw new Error("Method not implemented.");
    };
    Object.defineProperty(htmlExecutor.prototype, "IsBoundaryLeft", {
        get: function () {
            var curItem = this.imgItems[this.curIndex];
            return curItem.dataset.toLeft == 'true';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(htmlExecutor.prototype, "isBoundaryRight", {
        get: function () {
            var curItem = this.imgItems[this.curIndex];
            return curItem.dataset.toRight == 'true';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(htmlExecutor.prototype, "viewRect", {
        get: function () {
            var curItem = this.imgItems[this.curIndex];
            return curItem.getBoundingClientRect();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(htmlExecutor.prototype, "isEnlargement", {
        get: function () {
            var curItem = this.imgItems[this.curIndex];
            return curItem.dataset.isEnlargement == 'enlargement';
        },
        enumerable: false,
        configurable: true
    });
    htmlExecutor.prototype.handleMove = function (e) {
        var _this = this;
        e.preventDefault();
        if (e.touches.length == 2) {
            clearTimeout(this.performerRecordMove);
            clearTimeout(this.performerClick);
            this.performerRecordMove = 0;
            this.handleZoom(e);
            this.handleMoveEnlage(e);
            return;
        }
        var curTouchX = e.touches[0].clientX;
        var curTouchY = e.touches[0].clientY;
        if ((this.touchStartX - curTouchX) > 2 && Math.abs(this.touchStartY - curTouchY) > 2) {
            clearTimeout(this.performerClick);
        }
        var curItem = this.imgItems[this.curIndex];
        var isBoundaryLeft = curItem.dataset.toLeft == 'true';
        var isBoundaryRight = curItem.dataset.toRight == 'true';
        var direction = e.touches[0].clientX - this.startX > 0 ? 'right' : 'left';
        var curItemViewLeft = curItem.getBoundingClientRect().left;
        var curItemViewRight = curItem.getBoundingClientRect().right;
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        if (this.fingerDirection) {
            this.performerRecordMove = 0;
            if (curItem.dataset.isEnlargement == 'enlargement') {
                if (curItemViewLeft >= 0 && curItemViewRight <= conWidth) {
                    if (((isBoundaryLeft && direction == 'right') ||
                        (isBoundaryRight && direction == 'left') ||
                        (this.isEnlargeMove)) &&
                        (this.fingerDirection == 'horizontal')) {
                        this.isEnlargeMove = true;
                        this.handleMoveNormal(e);
                    }
                    else {
                        this.handleMoveEnlage(e);
                    }
                }
                else {
                    if (((isBoundaryLeft && direction == 'right')
                        ||
                            (isBoundaryRight && direction == 'left')
                        ||
                            (this.isEnlargeMove))) {
                        this.isEnlargeMove = true;
                        this.handleMoveNormal(e);
                    }
                    else {
                        this.handleMoveEnlage(e);
                    }
                }
            }
            else {
                this.handleMoveNormal(e);
            }
            this.isMotionless = false;
        }
        else {
            if ((curItem.dataset.isEnlargement == 'enlargement' && curItemViewLeft < 0 && curItemViewRight > conWidth)
                ||
                    (curItem.dataset.isEnlargement !== 'enlargement')) {
                if (curItem.dataset.isEnlargement == 'enlargement' && curItemViewLeft < 0 && curItemViewRight > conWidth) {
                    this.handleMoveEnlage(e);
                }
                else if (curItem.dataset.isEnlargement !== 'enlargement') {
                    this.handleMoveNormal(e);
                }
                this.isMotionless = false;
                return;
            }
            this.getMovePoints(e);
            if (this.performerRecordMove) {
                return;
            }
            this.performerRecordMove = setTimeout(function () {
                var L = _this.movePoints.length;
                if (L == 0)
                    return;
                var endPoint = _this.movePoints[L - 1];
                var startPoint = _this.movePoints[0];
                var dx = endPoint.x - startPoint.x;
                var dy = endPoint.y - startPoint.y;
                var degree = Math.atan2(dy, dx) * 180 / Math.PI;
                if (Math.abs(90 - Math.abs(degree)) < 30) {
                    _this.fingerDirection = 'vertical';
                }
                else {
                    _this.fingerDirection = 'horizontal';
                }
                if (curItem.dataset.isEnlargement == 'enlargement') {
                    var imgContainerRect_1 = _this.imgContainer.getBoundingClientRect();
                    var conWidth_1 = imgContainerRect_1.width;
                    var curItemViewLeft_1 = curItem.getBoundingClientRect().left;
                    var curItemViewRight_1 = curItem.getBoundingClientRect().right;
                    if (curItemViewLeft_1 >= 0 && curItemViewRight_1 <= conWidth_1) {
                        if (((isBoundaryLeft && direction == 'right') ||
                            (isBoundaryRight && direction == 'left') ||
                            (_this.isEnlargeMove)) &&
                            (_this.fingerDirection == 'horizontal')) {
                            _this.isEnlargeMove = true;
                            _this.handleMoveNormal(e);
                        }
                        else {
                            _this.handleMoveEnlage(e);
                        }
                    }
                    else {
                        if ((isBoundaryLeft && direction == 'right') || (isBoundaryRight && direction == 'left') || (_this.isEnlargeMove)) {
                            _this.isEnlargeMove = true;
                            _this.handleMoveNormal(e);
                        }
                        else {
                            _this.handleMoveEnlage(e);
                        }
                    }
                }
                else {
                    _this.handleMoveNormal(e);
                }
                _this.isMotionless = false;
            }, 25);
        }
    };
    htmlExecutor.prototype.handleMoveNormal = function (e, offset) {
        this.setTransitionProperty({
            el: this.imgContainer,
            time: 0,
            timingFunction: ''
        });
        this.imgContainer.matrix = this.matrixMultipy(this.imgContainer.matrix, this.getTranslateMatrix({ x: offset, y: 0, z: 0 }));
        this.imgContainer.style.transform = "" + this.matrixTostr(this.imgContainer.matrix);
    };
    htmlExecutor.prototype.handleMoveEnlage = function (e) {
        if (!this.moveStartTime) {
            this.moveStartTime = (new Date).getTime();
        }
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        var conHeight = imgContainerRect.height;
        var curItem = this.imgItems[this.curIndex];
        if (curItem.dataset.loaded == 'false') {
            return;
        }
        var curItemRect = curItem.getBoundingClientRect();
        var curItemHeihgt = curItemRect.height;
        var viewLeft = curItemRect.left;
        var viewRight = curItemRect.right;
        var curX = (e.touches[0].clientX);
        var curY = (e.touches[0].clientY);
        var offsetX = curX - this.startX;
        var offsetY = curY - this.startY;
        var curTop;
        var curLeft;
        showDebugger("\n            viewLeft:" + viewLeft + "\n            viewRight:" + viewRight + "\n        ");
        if (Math.round(viewLeft) < 0 || Math.round(viewRight) > conWidth) {
            curLeft = (offsetX);
        }
        else {
            curLeft = 0;
        }
        if (curItemHeihgt > conHeight) {
            curTop = (offsetY);
        }
        else {
            curTop = 0;
        }
        this.setTransitionProperty({
            el: curItem,
            time: 0,
            timingFunction: ''
        });
        curItem.matrix = this.matrixMultipy(curItem.matrix, this.getTranslateMatrix({ x: curLeft, y: curTop, z: 1 }));
        curItem.style.transform = "" + this.matrixTostr(curItem.matrix);
        this.startX = curX;
        this.startY = curY;
    };
    htmlExecutor.prototype.handleTEndEnNormal = function (e) {
        var endX = (e.changedTouches[0].clientX);
        var offset = endX - this.touchStartX;
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
    htmlExecutor.prototype.slideNext = function () {
        var endX = -(this.curIndex * this.containerWidth);
        if (endX < -(this.containerWidth * (this.imgsNumber - 1))) {
            endX = -(this.containerWidth * (this.imgsNumber - 1));
            this.curIndex = this.imgsNumber - 1;
        }
        if (this.imgContainerMoveX < endX) {
            this.slideSelf();
            return;
        }
        this.imgContainer.matrix = this.matrixMultipy(this.imgContainer.matrix, this.getTranslateMatrix({ x: endX - this.imgContainerMoveX, y: 0, z: 0 }));
        this.imgContainerMoveX = endX;
        this.animate({
            el: this.imgContainer,
            prop: 'transform',
            duration: 0.3,
            endStr: this.matrixTostr(this.imgContainer.matrix),
            callback: function () {
            }
        });
    };
    htmlExecutor.prototype.slidePrev = function () {
        var endX = -(this.curIndex * this.containerWidth);
        if (endX > 0) {
            endX = 0;
            this.curIndex = 0;
        }
        if (this.imgContainerMoveX > endX) {
            this.slideSelf();
            return;
        }
        var x = endX - this.imgContainerMoveX;
        this.imgContainer.matrix = this.matrixMultipy(this.imgContainer.matrix, this.getTranslateMatrix({ x: x, y: 0, z: 0 }));
        this.imgContainerMoveX = endX;
        this.animate({
            el: this.imgContainer,
            prop: 'transform',
            duration: 0.3,
            endStr: this.matrixTostr(this.imgContainer.matrix),
            callback: function () {
            }
        });
    };
    htmlExecutor.prototype.slideSelf = function () {
        var endX = -(this.curIndex * this.containerWidth);
        var x = endX - this.imgContainerMoveX;
        this.imgContainer.matrix = this.matrixMultipy(this.imgContainer.matrix, this.getTranslateMatrix({ x: x, y: 0, z: 0 }));
        this.imgContainerMoveX = endX;
        this.animate({
            el: this.imgContainer,
            duration: 0.3,
            prop: 'transform',
            endStr: this.matrixTostr(this.imgContainer.matrix),
            callback: function () {
            }
        });
    };
    htmlExecutor.prototype.handleTEndEnlarge = function (e) {
        this.isAnimating = false;
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        var conHeight = imgContainerRect.height;
        var actionExecutor = this.actionExecutor;
        var curItemRect = actionExecutor.viewRect;
        var curItemWidth = curItemRect.width;
        var curItemHeihgt = curItemRect.height;
        var curItemViewTop = curItemRect.top;
        var curItemViewLeft = curItemRect.left;
        var curItemViewRight = curItemRect.right;
        var maxTop = 0;
        var minTop = conHeight - curItemHeihgt;
        var maxLeft = 0;
        var minLeft = conWidth - curItemWidth;
        var curItemTop = curItemRect.top;
        var curItemLeft = curItemRect.left;
        var recoverY = false;
        var recoverX = false;
        var endX = 0;
        var endY = 0;
        if (curItemLeft > maxLeft) {
            endX = maxLeft - curItemLeft;
            recoverX = true;
        }
        else if (curItemLeft < minLeft) {
            endX = minLeft - curItemLeft;
            recoverX = true;
        }
        if (curItemTop > maxTop) {
            endY = maxTop - curItemTop;
            recoverY = true;
        }
        else if (curItemTop < minTop) {
            endY = minTop - curItemTop;
            recoverY = true;
        }
        if (curItemViewLeft >= 0 && curItemViewRight <= conWidth) {
            recoverX = false;
            curItem.dataset.toLeft = 'true';
            curItem.dataset.toRight = 'true';
        }
        if (curItemHeihgt <= conHeight) {
            recoverY = false;
            curItem.dataset.toTop = 'true';
            curItem.dataset.toBottom = 'true';
        }
        if (recoverX || recoverY) {
            curItem.matrix = this.matrixMultipy(curItem.matrix, this.getTranslateMatrix({
                x: endX,
                y: endY,
                z: 1
            }));
            this.animate({
                el: curItem,
                prop: 'transform',
                endStr: this.matrixTostr(curItem.matrix),
                timingFunction: 'cubic-bezier(0, 0, 0, 0.93)'
            });
            if (endX == maxLeft - curItemLeft) {
                curItem.dataset.toLeft = 'true';
                curItem.dataset.toRight = 'false';
            }
            else if (endX == minLeft - curItemLeft) {
                curItem.dataset.toLeft = 'false';
                curItem.dataset.toRight = 'true';
            }
            if (endY == maxTop) {
                curItem.dataset.toTop = 'true';
                curItem.dataset.toBottom = 'false';
            }
            else if (endY == minTop - curItemTop) {
                curItem.dataset.toTop = 'false';
                curItem.dataset.toBottom = 'true';
            }
        }
        else {
            if (curItemViewLeft >= 0 && curItemViewRight <= conWidth) {
                curItem.dataset.toLeft = 'true';
                curItem.dataset.toRight = 'true';
            }
            else {
                curItem.dataset.toLeft = 'false';
                curItem.dataset.toRight = 'false';
            }
            curItem.dataset.toTop = 'false';
            curItem.dataset.toBottom = 'false';
            this.moveEndTime = (new Date).getTime();
            var endPoint = {
                x: this.startX,
                y: this.startY
            };
            var startPoint = {
                x: this.touchStartX,
                y: this.touchStartY
            };
            var dx = endPoint.x - startPoint.x;
            var dy = endPoint.y - startPoint.y;
            var degree = Math.atan2(dy, dx) * 180 / Math.PI;
            var touchTime = this.moveEndTime - this.moveStartTime;
            if (touchTime < 90 && ((Math.abs(dx) + Math.abs(dy)) > 5)) {
                var boundryObj = { maxTop: maxTop, minTop: minTop - curItemViewTop, maxLeft: maxLeft, minLeft: minLeft - curItemViewLeft };
                this.autoMove(curItem, degree, 0, 0, boundryObj);
            }
        }
        this.moveStartTime = 0;
    };
    htmlExecutor.prototype.autoMove = function (deg, startX, startY, _a) {
        var maxTop = _a.maxTop, minTop = _a.minTop, maxLeft = _a.maxLeft, minLeft = _a.minLeft;
        curItem.matrix = this.matrixMultipy(curItem.matrix, this.getTranslateMatrix({ x: x, y: y, z: 1 }));
        this.animate({
            el: curItem,
            prop: 'transform',
            timingFunction: 'cubic-bezier(0, 0, 0, 0.93)',
            endStr: this.matrixTostr(curItem.matrix),
            duration: 1
        });
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
    };
    htmlExecutor.prototype.handleRotateLeft = function (e) {
        var changeDeg = -1 * Math.PI / 2;
        var curItem = this.imgItems[this.curIndex];
        curItem.rotateDeg -= 90;
        this.handleRotate(e, changeDeg);
        this.actionExecutor.rotateZ(changeDeg);
    };
    htmlExecutor.prototype.handleRotateRight = function (e) {
        var curItem = this.imgItems[this.curIndex];
        curItem.rotateDeg += 90;
        var changeDeg = 1 * Math.PI / 2;
        this.handleRotate(e, changeDeg);
    };
    htmlExecutor.prototype.handleRotate = function (e, changeDeg) {
        var _this = this;
        if (this.isAnimating) {
            return;
        }
        var curItem = this.imgItems[this.curIndex];
        if (curItem.dataset.loaded == 'false') {
            return;
        }
        this.isAnimating = true;
        this.setTransitionProperty({
            el: curItem,
            time: 0.3,
            timingFunction: 'linear'
        });
        curItem.matrix = this.matrixMultipy(this.getRotateZMatrix(changeDeg), curItem.matrix);
        curItem.style.transform = "" + this.matrixTostr(curItem.matrix);
        var end = this.supportTransitionEnd;
        curItem.addEventListener(end, function () {
            _this.isAnimating = false;
        }, { once: true });
    };
    htmlExecutor.prototype.handleZoom = function (e) {
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
        var curItem = this.imgItems[this.curIndex];
        if (curItem.dataset.loaded == 'false') {
            this.isAnimating = false;
            return;
        }
        var curItemRect = curItem.getBoundingClientRect();
        var curItemWidth = curItemRect.width;
        var curItemHeihgt = curItemRect.height;
        var distaceBefore = Math.sqrt(Math.pow(this.curPoint1.x - this.curPoint2.x, 2) + Math.pow(this.curPoint1.y - this.curPoint2.y, 2));
        var distanceNow = Math.sqrt(Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));
        var top = curItemRect.top;
        var left = curItemRect.left;
        var centerFingerX = (this.curStartPoint1.x + this.curStartPoint2.x) / 2;
        var centerFingerY = (this.curStartPoint1.y + this.curStartPoint2.y) / 2;
        var centerImgCenterX = curItemWidth / 2 + left;
        var centerImgCenterY = curItemHeihgt / 2 + top;
        this.curPoint1.x = e.touches[0].clientX;
        this.curPoint1.y = e.touches[0].clientY;
        this.curPoint2.x = e.touches[1].clientX;
        this.curPoint2.y = e.touches[1].clientY;
        if (distaceBefore > distanceNow) {
            var y = ((this.zoomScale) * (centerFingerY - centerImgCenterY));
            var x = ((this.zoomScale) * (centerFingerX - centerImgCenterX));
            curItem.matrix = this.matrixMultipy(this.getScaleMatrix({ x: 1 - this.zoomScale, y: 1 - this.zoomScale, z: 1 }), curItem.matrix, this.getTranslateMatrix({ x: x, y: y, z: 1 }));
            var intialMatrix = this.matrixMultipy(this.getRotateZMatrix(curItem.rotateDeg * Math.PI / 180), curItem.intialMatrix);
            if (intialMatrix[0][0] >= curItem.matrix[0][0]) {
                curItem.matrix = intialMatrix;
                curItem.dataset.isEnlargement = 'shrink';
            }
        }
        else if (distaceBefore < distanceNow) {
            curItem.dataset.isEnlargement = 'enlargement';
            var maxWidth = this.containerWidth * 4;
            if (curItemWidth * (1 + this.zoomScale) > maxWidth) {
                this.isAnimating = false;
                return;
            }
            var y = -((this.zoomScale) * (centerFingerY - centerImgCenterY));
            var x = -((this.zoomScale) * (centerFingerX - centerImgCenterX));
            curItem.matrix = this.matrixMultipy(this.getScaleMatrix({ x: 1 + this.zoomScale, y: 1 + this.zoomScale, z: 1 }), curItem.matrix, this.getTranslateMatrix({ x: x, y: y, z: 1 }));
        }
        curItem.style.transform = "" + this.matrixTostr(curItem.matrix);
        this.isAnimating = false;
    };
    htmlExecutor.prototype.setToNaturalImgSize = function (toWidth, toHeight, scaleX, scaleY, e) {
        var _this = this;
        var mouseX = e.touches[0].clientX;
        var mouseY = e.touches[0].clientY;
        var curItem = this.imgItems[this.curIndex];
        var curItemRect = curItem.getBoundingClientRect();
        var curItemViewTop = curItemRect.top;
        var curItemViewLeft = curItemRect.left;
        var centerX = (curItemRect.width) / 2 + curItemViewLeft;
        var centerY = (curItemRect.height) / 2 + curItemViewTop;
        var x = 0, y = 0;
        x = -((mouseX - centerX) * (scaleX - 1));
        y = -((mouseY - centerY) * (scaleY - 1));
        if (toWidth == this.containerWidth) {
            x = 0;
        }
        curItem.matrix = this.matrixMultipy(this.getScaleMatrix({ x: scaleX, y: scaleY, z: 1 }), curItem.matrix, this.getTranslateMatrix({ x: x, y: y, z: 1 }));
        this.animate({
            el: curItem,
            prop: 'transform',
            endStr: "" + this.matrixTostr(curItem.matrix),
            callback: function () {
                curItem.dataset.isEnlargement = 'enlargement';
                _this.isAnimating = false;
            }
        });
    };
    htmlExecutor.prototype.setToInitialSize = function (scaleX, scaleY, e) {
        var _this = this;
        var curItem = this.imgItems[this.curIndex];
        var rotateDeg = curItem.rotateDeg;
        ;
        curItem.matrix = this.matrixMultipy(this.getRotateZMatrix(rotateDeg * Math.PI / 180), curItem.intialMatrix);
        this.animate({
            el: curItem,
            endStr: "" + this.matrixTostr(curItem.matrix),
            prop: 'transform',
            callback: function () {
                curItem.dataset.isEnlargement = 'shrink';
                _this.isAnimating = false;
            }
        });
    };
    htmlExecutor.prototype.show = function (index) {
        this.curIndex = index;
        this[this.envClient + 'ReadyShow']();
        var translateX = -index * this.containerWidth - this.imgContainerMoveX;
        this.containerWidth = this.imgContainer.getBoundingClientRect().width;
        this.imgContainerMoveX = -index * this.containerWidth;
        this.imgContainer.matrix = this.matrixMultipy(this.imgContainer.matrix, [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [translateX, 0, 0, 1]
        ]);
        this.setTransitionProperty({
            el: this.imgContainer,
            time: 0
        });
        var transformStr = this.matrixTostr(this.imgContainer.matrix);
        this.toggleClass(this.ref, this.defToggleClass);
    };
    htmlExecutor.prototype.mobileRecordInitialData = function (els) {
        var _this = this;
        var record = function (el, img) {
            var imgContainerRect = _this.imgContainer.getBoundingClientRect();
            var imgContainerHeight = imgContainerRect.height;
            var imgContainerWidth = imgContainerRect.width;
            var styleObj = el.getBoundingClientRect();
            var imgNaturalWidth = img.naturalWidth;
            var imgNaturalHeight = img.naturalHeight;
            var scaleX = imgContainerWidth / imgNaturalWidth;
            var imgShouldHeight = imgContainerWidth * imgNaturalHeight / imgNaturalWidth;
            var scaleY = imgShouldHeight / imgNaturalHeight;
            if (imgContainerHeight < styleObj.height) {
                scaleY = imgContainerHeight / imgNaturalHeight;
                var imgShouldWeidth = imgContainerHeight * imgNaturalWidth / imgNaturalHeight;
                scaleX = imgShouldWeidth / imgNaturalWidth;
                img.style.cssText = "\n                    height: 100%;\n                    width: auto;\n                ";
            }
            var top = -(imgNaturalHeight - imgContainerHeight) / 2;
            var left = -(imgNaturalWidth - imgContainerWidth) / 2;
            el.dataset.loaded = "true";
            el.rotateDeg = 0;
            el.matrix = _this.initalMatrix;
            el.matrix = _this.matrixMultipy(el.matrix, _this.getScaleMatrix({ x: scaleX, y: scaleY, z: 1 }), _this.getTranslateMatrix({ x: left, y: top, z: 0 }));
            el.intialMatrix = el.matrix;
            el.style.cssText = "\n                width: " + img.naturalWidth + "px;\n                height: " + img.naturalHeight + "px;\n                transform:" + _this.matrixTostr(el.matrix) + ";\n            ";
            el.dataset.initialWidth = (styleObj.width * scaleX).toString();
            el.dataset.initialHeight = (styleObj.height * scaleY).toString();
            el.dataset.top = top.toString();
            el.dataset.initialTop = top.toString();
            el.dataset.left = left.toString();
            el.dataset.initialLeft = left.toString();
            el.dataset.viewTopInitial = styleObj.top.toString();
            el.dataset.viewLeftInitial = styleObj.left.toString();
        };
        this.recordInitialData(els, record);
    };
    htmlExecutor.prototype.pcRecordInitialData = function (els) {
        var _this = this;
        var record = function (el, img) {
            var imgContainerRect = _this.imgContainer.getBoundingClientRect();
            var imgContainerHeight = imgContainerRect.height;
            var imgBoundingRect = img.getBoundingClientRect();
            var top = 0;
            var left = 0;
            var width = imgBoundingRect.width;
            var height = imgBoundingRect.height;
            if (imgBoundingRect.width > img.naturalWidth) {
                width = img.naturalWidth;
                height = img.naturalHeight;
            }
            left = (_this.containerWidth - width) / 2;
            top = (imgContainerHeight - height) / 2;
            top < 0 && (top = 0);
            el.style.width = width + 'px';
            el.dataset.initialWidth = width.toString();
            el.dataset.initialHeight = height.toString();
            el.dataset.top = top.toString();
            el.dataset.initialTop = top.toString();
            el.dataset.left = left.toString();
            el.dataset.initialLeft = left.toString();
            el.dataset.viewTopInitial = imgBoundingRect.top.toString();
            el.dataset.viewLeftInitial = imgBoundingRect.left.toString();
            el.dataset.rotateDeg = '0';
            el.dataset.loaded = "true";
            el.style.top = top + "px";
            el.style.left = left + "px";
        };
        this.recordInitialData(els, record);
    };
    htmlExecutor.prototype.recordInitialData = function (els, record) {
        var _this = this;
        els.forEach(function (el) {
            var img = el;
            if (img.complete) {
                record(el, img);
            }
            else {
                el.dataset.loaded = "false";
                img.onload = function () {
                    record(el, img);
                };
            }
            img.onerror = function (e) {
                var imgContainerRect = _this.imgContainer.getBoundingClientRect();
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
        });
    };
    htmlExecutor.prototype.handlePcClick = function (e) {
        var type = (e.target).dataset.type;
        if (this.operateMaps[type]) {
            this[this.operateMaps[type]](e);
            return;
        }
    };
    return htmlExecutor;
}());
export {};
