// import { showDebugger } from '../tools/index';
var Move = /** @class */ (function () {
    function Move() {
    }
    Move.prototype.handleMove = function (e) {
        var _this = this;
        e.preventDefault();
        // 双指缩放时的。
        if (e.touches.length == 2) {
            clearTimeout(this.performerClick);
            this.handleZoom(e);
            // this.handleMoveEnlage(e); 
            return;
        }
        var isBoundaryLeft = this.actionExecutor.IsBoundaryLeft;
        var isBoundaryRight = this.actionExecutor.isBoundaryRight;
        var isBoundary = isBoundaryLeft || isBoundaryRight;
        if (e.touches[0].clientX - this.startXForDirection === 0) { //还没移动
            return;
        }
        var direction = e.touches[0].clientX - this.startXForDirection > 0 ? 'right' : 'left';
        var viewRect = this.actionExecutor.viewRect;
        var curItemViewLeft = viewRect.left;
        var curItemViewRight = viewRect.right;
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        /* 收集一段时间之内得移动得点，用于获取当前手指得移动方向
         * 如果手指方向已经确定了 则按手指方向做出操作，否则 启动开始收集手指移动得点
         **/
        if (this.fingerDirection) {
            if (this.actionExecutor.isEnlargement) {
                // 放大了但是没有超出边界
                if (curItemViewLeft >= 0 && curItemViewRight <= conWidth) {
                    if (((direction == 'right') ||
                        (direction == 'left') ||
                        (this.isEnlargeMove)) &&
                        (this.fingerDirection == 'horizontal')) {
                        this.isEnlargeMove = true;
                        this.handleMoveNormal(e);
                        var type = 'resetEnlargeMove';
                        var task = function () { _this.isEnlargeMove = false; };
                        this.addTouchEndTask(type, {
                            priority: 1,
                            callback: task
                        });
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
                        ;
                        this.isEnlargeMove = true;
                        this.handleMoveNormal(e);
                        var type = 'resetEnlargeMove';
                        this.addTouchEndTask(type, {
                            priority: 1,
                            callback: function () { return (_this.isEnlargeMove = false); }
                        });
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
        }
        else {
            // 放大之后的非长图，以及非放大的图片，这里可以直接派发操作
            if ((this.actionExecutor.isEnlargement &&
                (curItemViewLeft < 0 || curItemViewRight > conWidth))
                ||
                    (!this.actionExecutor.isEnlargement)) {
                // enlarge but not reach bonudry
                if (this.actionExecutor.isEnlargement && !isBoundary && !this.normalMoved) {
                    this.handleMoveEnlage(e);
                }
                else if (!this.actionExecutor.isEnlargement) { // not enlage
                    this.handleMoveNormal(e);
                }
                else if (isBoundary || this.normalMoved) { // 放大了到边界了
                    if (this.normalMoved) { // 已经有normal move 继续normalmove
                        this.handleMoveNormal(e);
                    }
                    else { // 否则手指移动方向与到达的边界同向 才normalmove 反向就enlarge
                        if (direction == 'right') {
                            if (isBoundaryLeft) {
                                this.handleMoveNormal(e);
                            }
                            else {
                                this.handleMoveEnlage(e);
                            }
                        }
                        else if (direction == 'left') {
                            if (isBoundaryRight) {
                                this.handleMoveNormal(e);
                            }
                            else {
                                this.handleMoveEnlage(e);
                            }
                        }
                        else {
                            this.handleMoveEnlage(e);
                        }
                    }
                }
                return;
            }
            // 长图收集手指方向
            this.getMovePoints(e);
            // 收集够一定数量的点才会执行下边的逻辑
            if (this.movePoints.length < this.maxMovePointCounts) {
                return;
            }
            this.decideMoveDirection();
        }
    };
    Move.prototype.handleMoveNormal = function (e) {
        var _this = this;
        // showDebugger(`
        // moveNormal:${Date.now()}
        // this.isAnimating :${this.isAnimating }
        // this.touchStartX:${this.touchStartX}
        // `)
        if (e.touches.length !== 1) {
            return;
        }
        if (this.isAnimating) {
            return;
        }
        if (this.isZooming) {
            return;
        }
        if (!this.isNormalMove) {
            this.touchStartX = this.startX = (e.touches[0].clientX);
            this.touchStartY = this.startY = (e.touches[0].clientY);
        }
        this.isNormalMove = true;
        var type = 'normalMove';
        this.addTouchEndTask(type, {
            priority: 1,
            callback: function () { return (_this.isNormalMove = false); }
        });
        var eventsHanlder = this.actionExecutor.eventsHanlder;
        var curX = (e.touches[0].clientX);
        var offset = curX - this.touchStartX;
        this.imgContainerMoveX += offset;
        this.startX = curX;
        if (offset !== 0) {
            this.normalMoved = true;
            var type_1 = 'normalMoved';
            var task = function (e) {
                (_this.normalMoved = false);
                _this.handleTEndEnNormal.bind(_this)(e);
            };
            this.addTouchEndTask(type_1, {
                priority: 10,
                callback: task
            });
        }
        eventsHanlder.handleMoveNormal(e, offset);
    };
    Move.prototype.handleMoveEnlage = function (e) {
        ;
        // showDebugger(`
        //     handlemoveEnlarge:this.isZooming ${this.isZooming}
        //     this.isAnimating:${this.isAnimating}
        //      ${Date.now()}
        // `)
        if (this.actionExecutor.isLoadingError()) {
            // 除了切屏之外对于加载错误的图片一律禁止其他操作
            return;
        }
        if (this.isZooming) {
            return;
        }
        if (!this.moveStartTime) {
            this.moveStartTime = Date.now();
            this.touchStartX = this.startX = (e.touches[0].clientX);
            this.touchStartY = this.startY = (e.touches[0].clientY);
        }
        var actionExecutor = this.actionExecutor;
        var eventsHanlder = actionExecutor.eventsHanlder;
        // 放大的时候自由滑动的时候是可以被中断的
        if (eventsHanlder.curBehaviorCanBreak) {
            actionExecutor.curAimateBreaked = true; //直接中断当前动画
            if (this.isAnimating) {
                this.touchStartX = (e.touches[0].clientX);
                this.touchStartY = (e.touches[0].clientY);
                return;
            }
        }
        else { // 不可中断动画进行时
            if (this.isAnimating) {
                return;
            }
        }
        this.isNormalMove = false;
        this.actionExecutor.isBoudriedSide = false;
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        var conHeight = imgContainerRect.height;
        var curItemRect = actionExecutor.viewRect;
        var curItemHeihgt = curItemRect.height;
        var viewLeft = curItemRect.left;
        var viewRight = curItemRect.right;
        var viewTop = curItemRect.top;
        var viewBottom = curItemRect.bottom;
        var curX = (e.touches[0].clientX);
        var curY = (e.touches[0].clientY);
        var offsetX = curX - this.startX;
        var offsetY = curY - this.startY;
        var curTop;
        var curLeft;
        // 如果容器内能完整展示图片就不需要移动
        if (Math.round(viewLeft) < 0 || Math.round(viewRight) > conWidth) {
            curLeft = (offsetX);
        }
        else {
            curLeft = 0;
        }
        if (Math.round(viewTop) < 0 || Math.round(viewBottom) > conHeight) {
            curTop = (offsetY);
        }
        else {
            curTop = 0;
        }
        actionExecutor.eventsHanlder.handleMoveEnlage(e, curLeft, curTop, 0);
        var type = 'handleTendEnlarte';
        this.addTouchEndTask(type, {
            priority: 10,
            callback: this.handleTEndEnlarge.bind(this)
        });
        this.startX = curX;
        this.startY = curY;
    };
    Move.prototype.autoMove = function (deg, startX, startY, _a) {
        var maxTop = _a.maxTop, minTop = _a.minTop, maxLeft = _a.maxLeft, minLeft = _a.minLeft;
        var imgContainerRect = this.imgContainer.getBoundingClientRect();
        var conWidth = imgContainerRect.width;
        var conHeight = imgContainerRect.height;
        // debugger;
        var _b = this.actionExecutor, viewRect = _b.viewRect, eventsHanlder = _b.eventsHanlder;
        var curItemRect = viewRect;
        var curItemViewTop = curItemRect.top;
        var curItemViewBottom = curItemRect.bottom;
        var curItemViewLeft = curItemRect.left;
        var curItemViewRight = curItemRect.right;
        deg = (deg / 180) * Math.PI;
        var distance = 300;
        var offsetX = (distance * Math.cos(deg));
        var offsetY = (distance * Math.sin(deg));
        var endX = startX + offsetX;
        var endY = startY + offsetY;
        if (endX > maxLeft) {
            endX = (maxLeft);
        }
        else if (endX < minLeft) {
            endX = (minLeft);
        }
        // debugger;
        if (endY > maxTop) {
            endY = (maxTop);
        }
        else if (endY < minTop) {
            endY = (minTop);
        }
        // 容器宽度能容纳图片宽度，则水平方向不需要移动，
        // 容器高度能容纳图片高度，则垂直方向不需要移动。
        var x = 0;
        var y = 0;
        if (!(curItemViewLeft >= 0 && curItemViewRight <= conWidth)) {
            x = endX - startX;
        }
        if (!(curItemViewTop >= 0 && curItemViewBottom <= conHeight)) {
            y = endY - startY;
        }
        return eventsHanlder.moveCurPlaneTo(x, y, 0);
    };
    return Move;
}());
export { Move };
