var Move = /** @class */ (function () {
    function Move() {
    }
    Move.prototype.handleMove = function (e) {
        var _this = this;
        e.preventDefault();
        if (this.isAnimating) {
            return;
        }
        // 双指缩放时的处理
        if (e.touches.length == 2) {
            clearTimeout(this.performerRecordMove);
            clearTimeout(this.performerClick);
            this.performerRecordMove = 0;
            this.handleZoom(e);
            return;
        }
        if (this.isZooming) {
            // 执行了缩放操作，则不进行任何移动
            // 这个值会在手指全部离开屏幕后重置
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
        /* 收集一段时间之内得移动得点，用于获取当前手指得移动方向
         * 如果手指方向已经确定了 则按手指方向做出操作，否则 启动开始收集手指移动得点
         * 并启动一个计时器 一定时间之后处理移动方向
         **/
        if (this.fingerDirection) {
            this.performerRecordMove = 0;
            if (curItem.dataset.isEnlargement == 'enlargement') {
                // 放大的时候的移动是查看放大后的图片
                // 放大的时候,如果到达边界还是进行正常的切屏操作
                // 重置是否已到达边界的变量,如果容器内能容纳图片则不需要重置
                // 对于长图单独处理，长图就是宽度可以容纳在当前容器内，但是高度很高的图片
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
                    if ((isBoundaryLeft && direction == 'right') || (isBoundaryRight && direction == 'left') || (this.isEnlargeMove)) {
                        this.isEnlargeMove = true;
                        this.handleMoveNormal(e);
                    }
                    else {
                        this.handleMoveEnlage(e);
                    }
                }
            }
            else {
                //正常情况下的移动是图片左右切换
                this.handleMoveNormal(e);
            }
            this.isMotionless = false;
        }
        else {
            // 放大之后的非长图，以及非放大的图片，这里可以直接派发操作
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
                    // 放大的时候的移动是查看放大后的图片
                    // 放大的时候,如果到达边界还是进行正常的切屏操作
                    // 重置是否已到达边界的变量,如果容器内能容纳图片则不需要重置
                    var imgContainerRect_1 = _this.imgContainer.getBoundingClientRect();
                    var conWidth_1 = imgContainerRect_1.width;
                    var curItemViewLeft_1 = curItem.getBoundingClientRect().left;
                    var curItemViewRight_1 = curItem.getBoundingClientRect().right;
                    // 对于长图单独处理，长图就是宽度可以容纳在当前容器内，但是高度很高的图片
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
                    //正常情况下的移动是图片左右切换
                    _this.handleMoveNormal(e);
                }
                _this.isMotionless = false;
            }, 25);
        }
    };
    Move.prototype.handleMoveNormal = function (e) {
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
        this.imgContainer.style.left = this.imgContainerMoveX + "px";
    };
    Move.prototype.handleMoveEnlage = function (e) {
        if (!this.moveStartTime) {
            this.moveStartTime = (new Date).getTime();
        }
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        var conHeight = imgContainerRect.height;
        var curItem = this.imgItems[this.curIndex];
        if (curItem.dataset.loaded == 'false') {
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        var curItemWidth = curItem.getBoundingClientRect().width;
        var curItemHeihgt = curItem.getBoundingClientRect().height;
        var viewLeft = curItem.getBoundingClientRect().left;
        var viewRight = curItem.getBoundingClientRect().right;
        var curX = Math.round(e.touches[0].clientX);
        var curY = Math.round(e.touches[0].clientY);
        var offsetX = curX - this.startX;
        var offsetY = curY - this.startY;
        var curItemTop = Number(curItem.dataset.top);
        var curItemLeft = Number(curItem.dataset.left);
        var curTop;
        var curLeft;
        // 如果容器内能完整展示图片就不需要移动
        if (viewLeft < 0 || viewRight > conWidth) {
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
    Move.prototype.autoMove = function (curItem, deg, startX, startY, _a) {
        var maxTop = _a.maxTop, minTop = _a.minTop, maxLeft = _a.maxLeft, minLeft = _a.minLeft;
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        var conHeight = imgContainerRect.height;
        var curItemViewTop = curItem.getBoundingClientRect().top;
        var curItemViewBottom = curItem.getBoundingClientRect().bottom;
        var curItemViewLeft = curItem.getBoundingClientRect().left;
        var curItemViewRight = curItem.getBoundingClientRect().right;
        deg = (deg / 180) * Math.PI;
        var distance = 500;
        var offsetX = Math.round(distance * Math.cos(deg));
        var offsetY = Math.round(distance * Math.sin(deg));
        var endX = startX + offsetX;
        var endY = startY + offsetY;
        if (endX > maxLeft) {
            endX = maxLeft;
        }
        else if (endX < minLeft) {
            endX = minLeft;
        }
        if (endY > maxTop) {
            endY = maxTop;
        }
        else if (endY < minTop) {
            endY = minTop;
        }
        var stepX = this.computeStep(startX - endX, 300);
        var stepY = this.computeStep(startY - endY, 300);
        // 容器宽度能容纳图片宽度，则水平方向不需要移动，
        // 容器高度能容纳图片高度，则垂直方向不需要移动。
        var moveStyles = [];
        if (!(curItemViewLeft >= 0 && curItemViewRight <= conWidth)) {
            moveStyles.push({
                prop: 'left',
                start: startX,
                end: endX,
                step: -stepX
            });
            curItem.dataset.left = "" + endX;
        }
        if (!(curItemViewTop >= 0 && curItemViewBottom <= conHeight)) {
            moveStyles.push({
                prop: 'top',
                start: startY,
                end: endY,
                step: -stepY
            });
            curItem.dataset.top = "" + endY;
        }
        this.animateMultiValue(curItem, moveStyles);
        if (endX == maxLeft) {
            //toLeft 即为到达左边界的意思下同
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
    return Move;
}());
export { Move };
