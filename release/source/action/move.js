var Move = (function () {
    function Move() {
    }
    Move.prototype.handleMove = function (e) {
        var _this = this;
        e.preventDefault();
        if (e.touches.length == 2) {
            clearTimeout(this.performerClick);
            this.handleZoom(e);
            return;
        }
        var isBoundaryLeft = this.actionExecutor.IsBoundaryLeft;
        var isBoundaryRight = this.actionExecutor.isBoundaryRight;
        var isBoundary = isBoundaryLeft || isBoundaryRight;
        if (e.touches[0].clientX - this.startXForDirection === 0) {
            return;
        }
        var direction = e.touches[0].clientX - this.startXForDirection > 0 ? 'right' : 'left';
        var viewRect = this.actionExecutor.viewRect;
        var curItemViewLeft = viewRect.left;
        var curItemViewRight = viewRect.right;
        var conWidth = this.actionExecutor.viewWidth / this.actionExecutor.dpr;
        if (this.fingerDirection) {
            if (this.actionExecutor.isEnlargement) {
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
                this.handleMoveNormal(e);
            }
        }
        else {
            if ((this.actionExecutor.isEnlargement &&
                (curItemViewLeft < 0 || curItemViewRight > conWidth))
                ||
                    (!this.actionExecutor.isEnlargement)) {
                if (this.actionExecutor.isEnlargement && !isBoundary && !this.normalMoved) {
                    this.handleMoveEnlage(e);
                }
                else if (!this.actionExecutor.isEnlargement) {
                    this.handleMoveNormal(e);
                }
                else if (isBoundary || this.normalMoved) {
                    if (this.normalMoved) {
                        this.handleMoveNormal(e);
                    }
                    else {
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
            this.getMovePoints(e);
            if (this.movePoints.length < this.maxMovePointCounts) {
                return;
            }
            this.decideMoveDirection();
        }
    };
    Move.prototype.handleMoveNormal = function (e) {
        var _this = this;
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
                var curX = (e.changedTouches[0].clientX);
                var offset = curX - _this.touchStartX;
                eventsHanlder.handleMoveNormal(e, offset);
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
        if (this.actionExecutor.isLoadingError()) {
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
        if (eventsHanlder.curBehaviorCanBreak) {
            actionExecutor.curAimateBreaked = true;
            if (this.isAnimating) {
                this.touchStartX = (e.touches[0].clientX);
                this.touchStartY = (e.touches[0].clientY);
                return;
            }
        }
        else {
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
        actionExecutor.eventsHanlder.handleMoveEnlage(curLeft, curTop, 0);
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
        if (endY > maxTop) {
            endY = (maxTop);
        }
        else if (endY < minTop) {
            endY = (minTop);
        }
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
