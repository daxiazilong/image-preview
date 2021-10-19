(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.imagePreviewModule = {}));
}(this, (function (exports) { 'use strict';

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$4 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var adapterPC = (function (constructor) {
        return (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.mouseDown = false;
                return _this;
            }
            class_1.prototype.pcInitial = function () {
                this.ref.querySelector("." + this.prefix + "close").addEventListener('mousedown', this.close.bind(this));
                this.ref.addEventListener('mousedown', this.handleMouseDown.bind(this));
                this.ref.addEventListener('mousemove', this.handleMouseMove.bind(this));
                this.ref.addEventListener('mouseup', this.handleMouseUp.bind(this));
                this.ref.addEventListener('wheel', this.handleWheel.bind(this));
                this.handleResize = this.handleResize.bind(this);
                window.addEventListener('resize', this.handleResize);
            };
            class_1.prototype.handleMouseUp = function () {
                this.mouseDown = false;
                if (this.actionExecutor.isEnlargement) {
                    this.ref.style.cursor = 'grab';
                }
                else {
                    this.ref.style.cursor = 'initial';
                }
            };
            class_1.prototype.handleMouseMove = function (e) {
                var actionExecutor = this.actionExecutor;
                if (!actionExecutor.isEnlargement) {
                    return;
                }
                if (!this.mouseDown) {
                    return;
                }
                if (this.isAnimating) {
                    return;
                }
                clearTimeout(this.performerClick);
                var curX = (e.clientX);
                var curY = (e.clientY);
                var offsetX = curX - this.startX;
                var offsetY = curY - this.startY;
                actionExecutor.eventsHanlder.handleMoveEnlage(offsetX, offsetY, 0);
                this.startX = curX;
                this.startY = curY;
            };
            class_1.prototype.handleWheel = function (e) {
                return __awaiter$4(this, void 0, void 0, function () {
                    var centerFingerX, centerFingerY, actionExecutor, centerImgCenterX, centerImgCenterY, x, y, sx, sy, zoomScale;
                    return __generator$4(this, function (_a) {
                        centerFingerX = e.clientX;
                        centerFingerY = e.clientY;
                        this.isZooming = true;
                        this.isAnimating = true;
                        actionExecutor = this.actionExecutor;
                        centerImgCenterX = actionExecutor.viewWidth / (2 * actionExecutor.dpr);
                        centerImgCenterY = actionExecutor.viewHeight / (2 * actionExecutor.dpr);
                        x = 0, y = 0, sx = 1.0, sy = 1.0;
                        zoomScale = this.zoomScale * 2;
                        if (e.deltaY > 0) {
                            y = -((centerFingerY - centerImgCenterY)) * zoomScale;
                            x = -((centerFingerX - centerImgCenterX)) * zoomScale;
                            sx = 1 + zoomScale;
                            sy = 1 + zoomScale;
                        }
                        else {
                            y = (centerFingerY - centerImgCenterY) * zoomScale;
                            x = (centerFingerX - centerImgCenterX) * zoomScale;
                            sx = 1 - zoomScale;
                            sy = 1 - zoomScale;
                        }
                        actionExecutor.eventsHanlder.handleZoom(sx, sy, x, y);
                        this.isZooming = false;
                        this.isAnimating = false;
                        if (this.actionExecutor.isEnlargement) {
                            this.ref.style.cursor = 'grab';
                        }
                        else {
                            this.ref.style.cursor = 'initial';
                        }
                        return [2];
                    });
                });
            };
            class_1.prototype.handlePCDoubleClick = function (e) {
                return __awaiter$4(this, void 0, void 0, function () {
                    return __generator$4(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this.isAnimating) {
                                    return [2];
                                }
                                this.isAnimating = true;
                                return [4, this.actionExecutor.eventsHanlder.handleDoubleClick({ clientX: e.clientX, clientY: e.clientY })];
                            case 1:
                                _a.sent();
                                this.isAnimating = false;
                                if (this.actionExecutor.isEnlargement) {
                                    this.ref.style.cursor = 'grab';
                                }
                                else {
                                    this.ref.style.cursor = 'initial';
                                }
                                return [2];
                        }
                    });
                });
            };
            class_1.prototype.handleMouseDown = function (e) {
                var _this = this;
                var type = (e.target).dataset.type;
                if (this[type]) {
                    this[type](e);
                    return;
                }
                this.mouseDown = true;
                var actionExecutor = this.actionExecutor;
                if (actionExecutor.isEnlargement) {
                    this.startX = e.clientX;
                    this.startY = e.clientY;
                    this.ref.style.cursor = 'grabbing';
                }
                else {
                    this.ref.style.cursor = 'initial';
                }
                if (Date.now() - this.lastClick < this.doubleClickDuration) {
                    clearTimeout(this.performerClick);
                    this.handlePCDoubleClick(e);
                }
                else {
                    this.performerClick = setTimeout(function () {
                        _this.handleClick(e);
                    }, this.doubleClickDuration);
                }
                this.lastClick = Date.now();
            };
            class_1.prototype.slideBefore = function () {
                return __awaiter$4(this, void 0, void 0, function () {
                    var isFirst;
                    return __generator$4(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this.isAnimating)
                                    return [2];
                                this.isAnimating = true;
                                return [4, this.actionExecutor.slideBefore()];
                            case 1:
                                isFirst = (_a.sent())[0];
                                if (isFirst) {
                                    this.
                                        ref.
                                        querySelectorAll("." + this.prefix + "bottom ." + this.prefix + "item ")[0].style
                                        .cursor = "not-allowed";
                                }
                                else {
                                    this.
                                        ref.
                                        querySelectorAll("." + this.prefix + "bottom ." + this.prefix + "item ")[1].style
                                        .cursor = "pointer";
                                }
                                this.isAnimating = false;
                                return [2];
                        }
                    });
                });
            };
            class_1.prototype.slideNext = function () {
                return __awaiter$4(this, void 0, void 0, function () {
                    var isLast;
                    return __generator$4(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this.isAnimating)
                                    return [2];
                                this.isAnimating = true;
                                return [4, this.actionExecutor.slideNext()];
                            case 1:
                                isLast = (_a.sent())[0];
                                if (isLast) {
                                    this.
                                        ref.
                                        querySelectorAll("." + this.prefix + "bottom ." + this.prefix + "item ")[1].style
                                        .cursor = "not-allowed";
                                }
                                else {
                                    this.
                                        ref.
                                        querySelectorAll("." + this.prefix + "bottom ." + this.prefix + "item ")[0].style
                                        .cursor = "pointer";
                                }
                                this.isAnimating = false;
                                return [2];
                        }
                    });
                });
            };
            return class_1;
        }(constructor));
    });

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
            curItemRect.height;
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

    var Zoom = (function () {
        function Zoom() {
        }
        Zoom.prototype.handleZoom = function (e) {
            if (this.isNormalMove && this.normalMoved) {
                return;
            }
            if (this.isAnimating) {
                return;
            }
            if (this.actionExecutor.isLoadingError()) {
                return;
            }
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
            var actionExecutor = this.actionExecutor;
            var distaceBefore = (Math.pow(this.curPoint1.x - this.curPoint2.x, 2) + Math.pow(this.curPoint1.y - this.curPoint2.y, 2));
            var distanceNow = (Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));
            var centerFingerX = (this.curStartPoint1.x + this.curStartPoint2.x) / 2;
            var centerFingerY = (this.curStartPoint1.y + this.curStartPoint2.y) / 2;
            var centerImgCenterX = actionExecutor.viewWidth / (2 * actionExecutor.dpr);
            var centerImgCenterY = actionExecutor.viewHeight / (2 * actionExecutor.dpr);
            this.curPoint1.x = e.touches[0].clientX;
            this.curPoint1.y = e.touches[0].clientY;
            this.curPoint2.x = e.touches[1].clientX;
            this.curPoint2.y = e.touches[1].clientY;
            var x = 0, y = 0, sx = 1.0, sy = 1.0;
            if (distaceBefore > distanceNow) {
                y = (centerFingerY - centerImgCenterY) * this.zoomScale;
                x = (centerFingerX - centerImgCenterX) * this.zoomScale;
                sx = 1 - this.zoomScale;
                sy = 1 - this.zoomScale;
            }
            else if (distaceBefore < distanceNow) {
                y = -((centerFingerY - centerImgCenterY)) * this.zoomScale;
                x = -((centerFingerX - centerImgCenterX)) * this.zoomScale;
                sx = 1 + this.zoomScale;
                sy = 1 + this.zoomScale;
            }
            else {
                this.isZooming = false;
                this.isAnimating = false;
                return;
            }
            actionExecutor.eventsHanlder.handleZoom(sx, sy, x, y);
            this.isZooming = false;
            this.isAnimating = false;
        };
        return Zoom;
    }());

    var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$3 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var Rotate = (function () {
        function Rotate() {
        }
        Rotate.prototype.rotateLeft = function (e) {
            return __awaiter$3(this, void 0, void 0, function () {
                var changeDeg;
                return __generator$3(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isAnimating)
                                return [2];
                            if (this.actionExecutor.isLoadingError()) {
                                return [2];
                            }
                            changeDeg = -1 * Math.PI / 2;
                            this.isAnimating = true;
                            return [4, this.actionExecutor.rotateZ(changeDeg)];
                        case 1:
                            _a.sent();
                            this.isAnimating = false;
                            return [2];
                    }
                });
            });
        };
        Rotate.prototype.rotateRight = function (e) {
            return __awaiter$3(this, void 0, void 0, function () {
                var changeDeg;
                return __generator$3(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isAnimating)
                                return [2];
                            if (this.actionExecutor.isLoadingError()) {
                                return [2];
                            }
                            changeDeg = 1 * Math.PI / 2;
                            this.isAnimating = true;
                            return [4, this.actionExecutor.rotateZ(changeDeg)];
                        case 1:
                            _a.sent();
                            this.isAnimating = false;
                            return [2];
                    }
                });
            });
        };
        return Rotate;
    }());

    var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    };
    var matrix = {
        multiplyPoint: function (point, rowMatrix) {
            var rest = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                rest[_i - 2] = arguments[_i];
            }
            var result = [];
            for (var col = 0; col < 4; col++) {
                result[col] = rowMatrix[col] * point[0] + rowMatrix[col + 4] * point[1]
                    +
                        rowMatrix[col + 8] * point[2] + rowMatrix[col + 12] * point[3];
            }
            if (!rest.length) {
                return result;
            }
            return matrix.multiplyPoint.apply(matrix, __spreadArray$1([result, rest.splice(0, 1)[0]], rest));
        },
        multiplyMatrices: function (a, b) {
            var rest = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                rest[_i - 2] = arguments[_i];
            }
            var result = [];
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++) {
                    result[row * 4 + col] =
                        a[row * 4] * b[col] + a[row * 4 + 1] * b[col + 4] +
                            a[row * 4 + 2] * b[col + 8] + a[row * 4 + 3] * b[col + 12];
                }
            }
            if (!rest.length) {
                return result;
            }
            return matrix.multiplyMatrices.apply(matrix, __spreadArray$1([result, rest.splice(0, 1)[0]], rest));
        },
        rotateByArbitrayAxis: function (x, y, z, deg) {
            var cos = Math.cos, sin = Math.sin, pow = Math.pow;
            var aNumber = (1 - cos(deg));
            var c = cos(deg), s = sin(deg);
            return [
                aNumber * pow(x, 2) + c, aNumber * x * y - s * z, aNumber * x * z + s * y, 0,
                aNumber * x * y + s * z, aNumber * pow(y, 2) + c, aNumber * y * z - s * x, 0,
                aNumber * x * z - s * y, aNumber * y * z + s * x, aNumber * pow(z, 2) + c, 0,
                0, 0, 0, 1
            ];
        },
        multiplyArrayOfMatrices: function (matrices) {
            var inputMatrix = matrices[0];
            for (var i = 1; i < matrices.length; i++) {
                inputMatrix = matrix.multiplyMatrices(inputMatrix, matrices[i]);
            }
            return inputMatrix;
        },
        rotateXMatrix: function (a) {
            var cos = Math.cos;
            var sin = Math.sin;
            return [
                1, 0, 0, 0,
                0, cos(a), -sin(a), 0,
                0, sin(a), cos(a), 0,
                0, 0, 0, 1
            ];
        },
        rotateYMatrix: function (deg) {
            var cos = Math.cos;
            var sin = Math.sin;
            return [
                cos(deg), 0, sin(deg), 0,
                0, 1, 0, 0,
                -sin(deg), 0, cos(deg), 0,
                0, 0, 0, 1
            ];
        },
        rotateZMatrix: function (a) {
            var cos = Math.cos;
            var sin = Math.sin;
            return [
                cos(a), -sin(a), 0, 0,
                sin(a), cos(a), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        },
        translateMatrix: function (x, y, z) {
            return [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                x, y, z, 1
            ];
        },
        scaleMatrix: function (w, h, d) {
            return [
                w, 0, 0, 0,
                0, h, 0, 0,
                0, 0, d, 0,
                0, 0, 0, 1
            ];
        }
    };

    var cubicBezier = (function () {
        function cubicBezier(x1, y1, x2, y2) {
            this.precision = 1e-5;
            this.p1 = {
                x: x1,
                y: y1
            };
            this.p2 = {
                x: x2,
                y: y2
            };
        }
        cubicBezier.prototype.getX = function (t) {
            var x1 = this.p1.x, x2 = this.p2.x;
            return 3 * x1 * t * Math.pow(1 - t, 2) + 3 * x2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
        };
        cubicBezier.prototype.getY = function (t) {
            var y1 = this.p1.y, y2 = this.p2.y;
            return 3 * y1 * t * Math.pow(1 - t, 2) + 3 * y2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
        };
        cubicBezier.prototype.solveCurveX = function (x) {
            var t2 = x;
            var derivative;
            var x2;
            var p1x = this.p1.x, p2x = this.p2.x;
            var ax = 3 * p1x - 3 * p2x + 1;
            var bx = 3 * p2x - 6 * p1x;
            var cx = 3 * p1x;
            function sampleCurveDerivativeX(t) {
                return (3 * ax * t + 2 * bx) * t + cx;
            }
            for (var i = 0; i < 8; i++) {
                x2 = this.getX(t2) - x;
                if (Math.abs(x2) < this.precision) {
                    return t2;
                }
                derivative = sampleCurveDerivativeX(t2);
                if (Math.abs(derivative) < this.precision) {
                    break;
                }
                t2 -= x2 / derivative;
            }
            var t1 = 1;
            var t0 = 0;
            t2 = x;
            while (t1 > t0) {
                x2 = this.getX(t2) - x;
                if (Math.abs(x2) < this.precision) {
                    return t2;
                }
                if (x2 > 0) {
                    t1 = t2;
                }
                else {
                    t0 = t2;
                }
                t2 = (t1 + t0) / 2;
            }
            return t2;
        };
        cubicBezier.prototype.solve = function (x) {
            return this.getY(this.solveCurveX(x));
        };
        return cubicBezier;
    }());
    var linear = new cubicBezier(0, 0, 1, 1);
    new cubicBezier(.25, .1, .25, 1);
    new cubicBezier(.42, 0, 1, 1);
    new cubicBezier(0, 0, .58, 1);
    new cubicBezier(.42, 0, .58, 1);

    var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var events = (function () {
        function events(viewInstance) {
            this.curBehaviorCanBreak = false;
            this.throldDeg = Math.PI * 0.10;
            this.viewInstance = viewInstance;
        }
        events.prototype.handleResize = function () {
            var _a = this, viewInstance = _a.viewInstance, resizeTimer = _a.resizeTimer;
            clearTimeout(resizeTimer);
            var run = function () {
                var canvas = viewInstance.ref;
                canvas.style.width = window.innerWidth + "px";
                canvas.style.height = window.innerHeight + "px";
                canvas.width = window.innerWidth * viewInstance.dpr;
                canvas.height = window.innerHeight * viewInstance.dpr;
                viewInstance.viewWidth = canvas.width;
                viewInstance.viewHeight = canvas.height;
                viewInstance.gl.viewport(0, 0, viewInstance.viewWidth, viewInstance.viewHeight);
                var projectionMatrix = viewInstance.createPerspectiveMatrix();
                viewInstance.gl.uniformMatrix4fv(viewInstance.gl.getUniformLocation(viewInstance.shaderProgram, 'uProjectionMatrix'), false, projectionMatrix);
                viewInstance.draw(viewInstance.curIndex);
            };
            this.resizeTimer = setTimeout(run, 100);
        };
        events.prototype.handleDoubleClick = function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            var viewInstance = this.viewInstance;
            var _b = viewInstance.decideScaleRatio(clientX, clientY), scaleX = _b[0], scaleY = _b[1], dx = _b[2], dy = _b[3];
            return viewInstance.scaleZPosition({ scaleX: scaleX, scaleY: scaleY, dx: dx, dy: dy });
        };
        events.prototype.handleMoveEnlage = function (x, y, z) {
            var viewInstance = this.viewInstance;
            x *= viewInstance.dpr;
            y *= -viewInstance.dpr;
            z *= viewInstance.dpr;
            viewInstance.curPlane = viewInstance.positions.slice(viewInstance.curPointAt, viewInstance.curPointAt + 16);
            viewInstance.transformCurplane(matrix.translateMatrix(x, y, 0));
            viewInstance.bindPostion();
            viewInstance.drawPosition();
        };
        events.prototype.handleMoveNormal = function (e, offset) {
            var viewInstance = this.viewInstance;
            var maxDeg = Math.PI / 2;
            var deg = -offset / (viewInstance.viewWidth / viewInstance.dpr) * maxDeg;
            viewInstance.rotatePosition(deg);
        };
        events.prototype.handleZoom = function (sx, sy, dx, dy) {
            var viewInstance = this.viewInstance;
            var _a = viewInstance.imgShape, nw = _a[0]; _a[1];
            var _b = viewInstance.imgShapeInitinal, iW = _b[0]; _b[1];
            nw = Math.abs(nw);
            iW = Math.abs(iW);
            var curItemRect = viewInstance.viewRect;
            var curItemWidth = curItemRect.width * viewInstance.dpr;
            var maxWidth = nw * 4;
            if (curItemWidth * sx > maxWidth) {
                return;
            }
            var minWidth = iW;
            if (curItemWidth * sx < minWidth) {
                return;
            }
            dx *= viewInstance.dpr;
            dy *= -viewInstance.dpr;
            viewInstance.zoomCurPlan(sx, sy, dx, dy);
        };
        events.prototype.handleTEndEnNormal = function (e, offset) {
            return __awaiter$2(this, void 0, void 0, function () {
                var viewInstance, maxDeg, degX, plusOrMinus, beforeIndex, nextIndex;
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            viewInstance = this.viewInstance;
                            maxDeg = Math.PI / 2;
                            degX = -offset / (viewInstance.viewWidth / viewInstance.dpr) * maxDeg;
                            plusOrMinus = degX / Math.abs(degX);
                            viewInstance.baseModel = viewInstance.modelMatrix;
                            if (!(Math.abs(degX) >= this.throldDeg)) return [3, 6];
                            beforeIndex = viewInstance.curIndex;
                            nextIndex = viewInstance.curIndex + (plusOrMinus * 1);
                            if (!(nextIndex == -1 || nextIndex == viewInstance.imgUrls.length)) return [3, 2];
                            viewInstance.curIndex = beforeIndex;
                            return [4, viewInstance.rotate(-degX)];
                        case 1:
                            _a.sent();
                            return [3, 5];
                        case 2: return [4, viewInstance.rotate(plusOrMinus * Math.PI / 2 - degX)];
                        case 3:
                            _a.sent();
                            viewInstance.curIndex = nextIndex;
                            viewInstance.modelMatrix = viewInstance.baseModel = viewInstance.initialModel;
                            viewInstance.gl.uniformMatrix4fv(viewInstance.gl.getUniformLocation(viewInstance.shaderProgram, 'uModelViewMatrix'), false, viewInstance.modelMatrix);
                            return [4, viewInstance.draw(nextIndex)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [3, 8];
                        case 6: return [4, viewInstance.rotate(-degX)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            viewInstance.modelMatrix = viewInstance.baseModel = viewInstance.initialModel;
                            return [2, 'handled'];
                    }
                });
            });
        };
        events.prototype.handleTEndEnlarge = function (e, x, y, z) {
            return __awaiter$2(this, void 0, void 0, function () {
                var viewInstance;
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            viewInstance = this.viewInstance;
                            x *= viewInstance.dpr;
                            y *= -viewInstance.dpr;
                            z *= viewInstance.dpr;
                            this.curBehaviorCanBreak = true;
                            return [4, viewInstance.moveCurPlane(x, y, 0)];
                        case 1:
                            _a.sent();
                            this.curBehaviorCanBreak = false;
                            if (x !== 0) {
                                viewInstance.isBoudriedSide = true;
                            }
                            return [2];
                    }
                });
            });
        };
        events.prototype.moveCurPlaneTo = function (x, y, z) {
            return __awaiter$2(this, void 0, void 0, function () {
                var viewInstance;
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            viewInstance = this.viewInstance;
                            x *= viewInstance.dpr;
                            y *= -viewInstance.dpr;
                            z *= viewInstance.dpr;
                            this.curBehaviorCanBreak = true;
                            return [4, viewInstance.moveCurPlane(x, y, 0)];
                        case 1:
                            _a.sent();
                            this.curBehaviorCanBreak = false;
                            return [2];
                    }
                });
            });
        };
        return events;
    }());

    var errImgBase64 = 'data:image/svg+xml;base64,PHN2ZyB0PSIxNjI1ODExNDgwNTgyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEzNDIgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjYwNjkiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMTIxNi4zNTcgMTM5LjAzYy0xMC4xNTctMTEuNDI3LTI0Ljc1OS0xNy43NzUtMzkuOTk1LTE4LjQxTDc0My40IDEwMy40OGwtMzIuMzc3IDczLjAwNiA0NS4wNzQgMTM1Ljg1Ni04MS4yNiAxNTQuMjY3IDMzLjAxMiAxMjQuNDI5IDgyLjUzIDEwNi42NTMgMTE5LjM1LTEwOS44MjdjMTEuNDI3LTEwLjc5MyAyOS44MzctMTAuMTU4IDM5Ljk5NCAxLjkwNGwxNTIuOTk3IDE2NS42OTRjMTAuNzkzIDExLjQyNyAxMC4xNTggMjkuODM3LTEuMjcgNDAuNjMtNS43MTMgNS4wNzgtMTIuNjk2IDguMjUzLTIwLjMxNCA3LjYxOGwtNDE5LjYzLTE2LjUwNi0yMC45NSA2MC4zMSAyMi44NTQgNTMuOTYyIDQ4Mi40OCAxOC40MWMzMS43NDIgMS4yNyA1OC40MDUtMjMuNDkgNTkuMDQtNTUuMjMxbDI2LjY2My02ODQuMzZjMC42MzUtMTUuMjM2LTQuNDQ0LTMwLjQ3Mi0xNS4yMzYtNDEuMjY1ek05MDYuNTU0IDQ1My4yNzdjLTQ3LjYxMy0xLjkwNC04NC40MzQtNDEuOS04Mi41My04OC44NzggMS45MDUtNDcuNjEzIDQxLjktODQuNDM0IDg4Ljg3OS04Mi41MyA0Ni45NzggMS45MDUgODQuNDM0IDQxLjkgODIuNTMgODguODc5LTEuOTA1IDQ2Ljk3OC00MS45IDg0LjQzNC04OC44NzkgODIuNTN6TTU5NS40ODIgODQ4LjE1bDE0LjYwMS02My40ODQtMzQwLjkxIDIzLjQ4OWMtMTUuODcxIDEuMjctMjkuMjAzLTEwLjE1OC0zMC40NzItMjYuMDI5YTI4LjEyIDI4LjEyIDAgMCAxIDYuOTgzLTIwLjk1TDQ5OC4zNSA0NzEuMDUzYzUuMDc5LTYuMzQ5IDEyLjY5Ny05LjUyMyAyMC45NS05LjUyMyA3LjYxOCAwIDE1LjIzNiAzLjE3NCAyMC45NSA4Ljg4OGw4NC40MzMgODguMjQzLTM2LjE4Ni05My45NTcgNjQuNzU0LTE2Mi41Mi01OS4wNC0xMzAuMTQyIDI0LjEyNC03NC45MTEtNDY0LjcwNCAzMi4zNzdjLTMxLjc0MiAxLjkwNC01NS4yMzIgMjkuMjAyLTUzLjMyNyA2MC45NDVsNDYuOTc4IDY4NC4zNmMwLjYzNSAxNS4yMzUgNy42MTggMjkuMjAyIDE5LjY4IDM4LjcyNSAxMS40MjggMTAuMTU3IDI2LjAyOSAxNS4yMzYgNDEuMjY1IDEzLjk2Nmw0MTUuMTg3LTI4LjU2OC0yNy45MzMtNTAuNzg3eiIgcC1pZD0iNjA3MCIgZmlsbD0iI2JmYmZiZiIvPjwvc3ZnPg==';

    function initialCanvas(img, width, height) {
        var naturalWidth = img.naturalWidth, naturalHeight = img.naturalHeight;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight, 0, 0, width * dpr, height * dpr);
        return canvas;
    }
    var tailor = initialCanvas;

    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    };
    var sourceFrag = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler0;\nuniform vec2 iResolution;\nvoid main() {\n\n    // vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);\n    vec4 color0 = texture2D(uSampler0, vTextureCoord) ;\n    gl_FragColor = color0;\n}";
    var sourceVer = "attribute vec4 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying mediump vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n    vTextureCoord = aTextureCoord;\n}";
    var easeOut1 = new cubicBezier(0.18, 0.96, 0.18, 0.96);
    function isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }
    var forDev = 0;
    var webGl = (function () {
        function webGl(_a) {
            var images = _a.images;
            this.dpr = window.devicePixelRatio || 1;
            this.fieldOfViewInRadians = 0.25 * Math.PI;
            this.zNear = 100.0;
            this.zFar = 10000.0;
            this.curIndex = 0;
            this.defaultAnimateTime = 300;
            this.initialModel = [
                1.0, 0, 0, 0,
                0, 1.0, 0, 0,
                0, 0, 1.0, 0,
                0, 0, 0, 1.0
            ];
            this.baseModel = [
                1.0, 0, 0, 0,
                0, 1.0, 0, 0,
                0, 0, 1.0, 0,
                0, 0, 0, 1.0
            ];
            this.modelMatrix = [
                1.0, 0, 0, 0,
                0, 1.0, 0, 0,
                0, 0, 1.0, 0,
                0, 0, 0, 1.0
            ];
            this.indinces = new Map;
            this.positions = [];
            this.imgs = [];
            this.imgUrls = [];
            this.imgShape = [];
            this.imgShapeInitinal = [];
            this.textures = new Map;
            this.texturesOther = new Map;
            this.positionBuffer = null;
            this.curPlane = [];
            this.isBoudriedSide = false;
            this.curAimateBreaked = false;
            this.imgId = 0;
            this.gl = this.intialView();
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
            this.imgUrls = images;
            var gl = this.gl;
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            this.readyWebgl();
            this.initData();
            this.contextHandle();
            this.eventsHanlder = new events(this);
        }
        webGl.prototype.contextHandle = function () {
            var _this = this;
            var canvas = this.ref;
            canvas.addEventListener('webglcontextlost', function (e) {
                _this.textures.clear();
                _this.texturesOther.clear();
                _this.ref.parentNode.removeChild(_this.ref);
            });
            canvas.addEventListener('webglcontextrestored', function (e) {
                _this.gl = _this.intialView();
                _this.gl.pixelStorei(_this.gl.UNPACK_FLIP_Y_WEBGL, 1);
                var gl = _this.gl;
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                _this.readyWebgl();
                _this.initData();
                _this.contextHandle();
            });
        };
        webGl.prototype.readyWebgl = function () {
            this.shaderProgram = this.bindShader(this.gl, sourceFrag, sourceVer);
            var projectionMatrix = this.createPerspectiveMatrix();
            this.gl.useProgram(this.shaderProgram);
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'), false, projectionMatrix);
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'), false, this.modelMatrix);
            this.setTextureCordinate();
            this.initOtherTexture();
        };
        webGl.prototype.addImg = function (image, index) {
            var _this = this;
            var beforL = this.imgUrls.length;
            var indexShouldInImgs = index + 1;
            if (index <= -1) {
                index = -1;
                indexShouldInImgs = 0;
            }
            else if (index > beforL) {
                index = beforL - 1;
                indexShouldInImgs = beforL;
            }
            this.imgUrls.splice(index + 1, 0, image);
            if (index + 1 > this.imgs.length) {
                this.imgs[indexShouldInImgs] = null;
            }
            else {
                this.imgs.splice(index + 1, 0, null);
            }
            if (image instanceof Image) {
                if (typeof image._id == 'undefined') {
                    image._id = this.imgId++;
                }
                if (!image.complete) {
                    var load = function () {
                        var index = _this.imgUrls.indexOf(image);
                        _this.imgUrls[index] = _this.validateImg(image);
                        if (~[-2, -1, 0].indexOf(index - _this.curIndex)) {
                            _this.draw(_this.curIndex);
                        }
                    };
                    var error = function () {
                        var index = _this.imgUrls.indexOf(image);
                        image.loadError = true;
                        if (~[-2, -1, 0].indexOf(index - _this.curIndex)) {
                            _this.draw(_this.curIndex);
                        }
                    };
                    image.addEventListener('load', load);
                    image.addEventListener('error', error);
                    image.addEventListener('abort', error);
                }
                else {
                    this.imgUrls[index + 1] = this.validateImg(image);
                }
            }
            if (~[-2, -1, 0].indexOf(index - this.curIndex)) {
                this.draw(this.curIndex);
            }
        };
        webGl.prototype.delImg = function (index) {
            var beforL = this.imgUrls.length;
            if (index <= -1) {
                index = 0;
            }
            else if (index >= beforL) {
                index = beforL - 1;
            }
            this.imgUrls.splice(index, 1);
            if (this.imgs[index]) {
                this.textures.delete(this.imgs[index]._id);
            }
            this.imgs.splice(index, 1);
            index -= this.curIndex;
            if (~[-1, 0, 1].indexOf(index)) {
                this.draw(this.curIndex);
            }
        };
        webGl.prototype.initOtherTexture = function () {
            var _this = this;
            var gl = this.gl;
            var texture = gl.createTexture();
            this.texturesOther.set(0, texture);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            texture.cubicBgd = true;
            var r = 0;
            var g = 0;
            var b = 0;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([r, g, b, 255]));
            var img = new Image();
            img.onload = function () {
                var textureErrImg = gl.createTexture();
                _this.texturesOther.set(1, textureErrImg);
                gl.bindTexture(gl.TEXTURE_2D, textureErrImg);
                _this.texImage(img);
                _this.setTexParameteri(img.width, img.height);
            };
            img.src = errImgBase64;
        };
        webGl.prototype.initData = function () {
            this.draw(this.curIndex);
        };
        webGl.prototype.slideNext = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var _this = this;
                return __generator$1(this, function (_a) {
                    if (this.curIndex == this.imgUrls.length - 1) {
                        return [2, [true]];
                    }
                    return [2, this.slide(0.5 * Math.PI, function () { return _this.curIndex++; })];
                });
            });
        };
        webGl.prototype.slideBefore = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var _this = this;
                return __generator$1(this, function (_a) {
                    if (this.curIndex == 0) {
                        return [2, [true]];
                    }
                    return [2, this.slide(-0.5 * Math.PI, function () { return _this.curIndex--; })];
                });
            });
        };
        webGl.prototype.slide = function (deg, callback) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.baseModel = this.modelMatrix;
                            return [4, this.rotate(deg)];
                        case 1:
                            _a.sent();
                            callback();
                            this.modelMatrix = this.baseModel = this.initialModel;
                            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'), false, this.modelMatrix);
                            return [4, this.draw(this.curIndex)];
                        case 2:
                            _a.sent();
                            this.modelMatrix = this.baseModel = this.initialModel;
                            return [2, [false]];
                    }
                });
            });
        };
        webGl.prototype.rotate = function (end) {
            var _this = this;
            return this.animate({
                allTime: this.defaultAnimateTime,
                timingFun: linear,
                ends: [end],
                playGame: (function () {
                    var play = _this.rotatePosition.bind(_this);
                    return function (curPos) {
                        _this.clear();
                        play(curPos);
                    };
                })()
            });
        };
        webGl.prototype.rotateZ = function (deg) {
            var _this = this;
            this.curPlane = this.positions.slice(this.curPointAt, this.curPointAt + 16);
            var curImgShape = this.imgShape;
            var curImgShapeInitinal = this.imgShapeInitinal;
            this.imgShape = matrix.multiplyPoint(curImgShape, matrix.rotateZMatrix(deg));
            this.imgShapeInitinal = matrix.multiplyPoint(curImgShapeInitinal, matrix.rotateZMatrix(deg));
            var _a = this.curCenterCoordinate, curCenterX = _a[0], curCenterY = _a[1];
            var dx = -curCenterX, dy = -curCenterY;
            var playGame = function () {
                var rest = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    rest[_i] = arguments[_i];
                }
                _this.transformCurplane(matrix.translateMatrix(rest[1], rest[2], 0), matrix.rotateZMatrix(rest[0]));
                _this.bindPostion();
                _this.drawPosition();
            };
            return this.animate({
                allTime: this.defaultAnimateTime,
                timingFun: linear,
                ends: [deg, dx, dy],
                playGame: playGame
            });
        };
        webGl.prototype.genPostion = function (width, height, index) {
            var _a;
            var z = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev;
            var viewWidth = this.viewWidth;
            var sideZAxis = z - (viewWidth - width) / 2;
            var positionsMap = [
                [
                    -viewWidth / 2, -height / 2, sideZAxis - width, 1.0,
                    -viewWidth / 2, -height / 2, sideZAxis, 1.0,
                    -viewWidth / 2, height / 2, sideZAxis, 1.0,
                    -viewWidth / 2, height / 2, sideZAxis - width, 1.0,
                ],
                [
                    -width / 2, -height / 2, z, 1.0,
                    width / 2, -height / 2, z, 1.0,
                    width / 2, height / 2, z, 1.0,
                    -width / 2, height / 2, z, 1.0,
                ],
                [
                    viewWidth / 2, -height / 2, sideZAxis, 1.0,
                    viewWidth / 2, -height / 2, sideZAxis - width, 1.0,
                    viewWidth / 2, height / 2, sideZAxis - width, 1.0,
                    viewWidth / 2, height / 2, sideZAxis, 1.0,
                ]
            ];
            var key = index - this.curIndex;
            key += 1;
            (_a = this.positions).push.apply(_a, positionsMap[key]);
        };
        webGl.prototype.updatePosition = function (img, index) {
            var z = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev;
            var viewWidth = this.viewWidth;
            var naturalWidth = img.naturalWidth, naturalHeight = img.naturalHeight;
            if (img.loadError) {
                naturalWidth = naturalHeight = 200;
            }
            var _a = this.decideImgViewSize(naturalWidth * this.dpr, naturalHeight * this.dpr), width = _a[0], height = _a[1];
            if (index == 0) {
                this.imgShape = [naturalWidth * this.dpr, naturalHeight * this.dpr, 0, 1];
                this.imgShapeInitinal = [width, height, 0, 1];
            }
            var sideZAxis = z - (viewWidth - width) / 2;
            var positionsMap = [
                [
                    -viewWidth / 2, -height / 2, sideZAxis - width, 1.0,
                    -viewWidth / 2, -height / 2, sideZAxis, 1.0,
                    -viewWidth / 2, height / 2, sideZAxis, 1.0,
                    -viewWidth / 2, height / 2, sideZAxis - width, 1.0,
                ],
                [
                    -width / 2, -height / 2, z, 1.0,
                    width / 2, -height / 2, z, 1.0,
                    width / 2, height / 2, z, 1.0,
                    -width / 2, height / 2, z, 1.0,
                ],
                [
                    viewWidth / 2, -height / 2, sideZAxis, 1.0,
                    viewWidth / 2, -height / 2, sideZAxis - width, 1.0,
                    viewWidth / 2, height / 2, sideZAxis - width, 1.0,
                    viewWidth / 2, height / 2, sideZAxis, 1.0,
                ]
            ];
            var key = index;
            var indexInPosition = this.curPointAt + key * 16;
            key += 1;
            var curPlane = positionsMap[key];
            for (var i = indexInPosition; i < indexInPosition + 16; i++) {
                this.positions[i] = curPlane[i - indexInPosition];
            }
        };
        webGl.prototype.bindPostion = function () {
            var gl = this.gl;
            var positions = this.positions;
            if (this.positionBuffer) {
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);
                return;
            }
            var positionBuffer = this.gl.createBuffer();
            this.positionBuffer = positionBuffer;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);
            {
                var numComponents = 4;
                var type = gl.FLOAT;
                var normalize = false;
                var stride = 0;
                var offset = 0;
                var aVerLocate = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
                gl.vertexAttribPointer(aVerLocate, numComponents, type, normalize, stride, offset);
                gl.enableVertexAttribArray(aVerLocate);
            }
        };
        webGl.prototype.drawPosition = function () {
            this.clear();
            var gl = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this.texturesOther.get(0));
            for (var i = 0, L = 12; i < L; i += 4) {
                this.bindIndex(i);
            }
            var faces = (this.positions.length / 4 - 12) / 4;
            var textureIndex = (this.curIndex - 1);
            (textureIndex < 0) && (textureIndex = 0);
            for (var i = 0; i < faces; i++, textureIndex++) {
                var img = this.imgs[textureIndex];
                if (img) {
                    this.bindTexture(img, img._id);
                }
                else {
                    console.log("shouldn't have");
                }
                this.bindIndex(12 + i * 4);
            }
        };
        webGl.prototype.rotatePosition = function (deg) {
            var zInitial = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev;
            var centerX = this.viewWidth / 2;
            this.modelMatrix = matrix.multiplyMatrices(this.baseModel, matrix.translateMatrix(0, 0, centerX - zInitial), matrix.rotateYMatrix(deg), matrix.translateMatrix(0, 0, zInitial - (centerX)));
            this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'), false, this.modelMatrix);
            this.drawPosition();
        };
        webGl.prototype.scaleZPosition = function (_a) {
            var _this = this;
            var scaleX = _a.scaleX, scaleY = _a.scaleY, dx = _a.dx, dy = _a.dy;
            this.curPlane = this.positions.slice(this.curPointAt, this.curPointAt + 16);
            var playGame = function () {
                var rest = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    rest[_i] = arguments[_i];
                }
                rest[0] += 1;
                rest[1] += 1;
                _this.transformCurplane(matrix.scaleMatrix(rest[0], rest[1], 1), matrix.translateMatrix(rest[2], rest[3], 0));
                _this.bindPostion();
                _this.drawPosition();
            };
            return this.animate({
                allTime: this.defaultAnimateTime,
                timingFun: linear,
                ends: [scaleX, scaleY, dx, dy],
                playGame: playGame
            });
        };
        webGl.prototype.moveCurPlane = function (x, y, z) {
            var _this = this;
            var dx = x;
            var dy = y;
            this.curPlane = this.positions.slice(this.curPointAt, this.curPointAt + 16);
            var playGame = function () {
                var rest = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    rest[_i] = arguments[_i];
                }
                _this.transformCurplane(matrix.translateMatrix(rest[0], rest[1], 0));
                _this.bindPostion();
                _this.drawPosition();
            };
            return this.animate({
                allTime: 800,
                timingFun: easeOut1,
                ends: [dx, dy],
                playGame: playGame
            });
        };
        webGl.prototype.transformCurplane = function (a) {
            var matrixes = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                matrixes[_i - 1] = arguments[_i];
            }
            var positions = this.positions;
            var curPlane = this.curPlane;
            for (var i = this.curPointAt; i < this.curPointAt + 16; i += 4) {
                var planeIndex = i - this.curPointAt;
                var x = curPlane[planeIndex], y = curPlane[planeIndex + 1], z = curPlane[planeIndex + 2], w = curPlane[planeIndex + 3];
                var newPoint = matrix.multiplyPoint.apply(matrix, __spreadArray([[x, y, z, w],
                    a], matrixes));
                for (var j = i; j < 4 + i; j++) {
                    positions[j] = newPoint[j - i];
                }
            }
        };
        webGl.prototype.zoomCurPlan = function (sx, sy, dx, dy) {
            this.curPlane = this.positions.slice(this.curPointAt, this.curPointAt + 16);
            this.transformCurplane(matrix.scaleMatrix(sx, sy, 1), matrix.translateMatrix(dx, dy, 0));
            this.bindPostion();
            this.drawPosition();
        };
        webGl.prototype.setTextureCordinate = function () {
            var gl = this.gl;
            var textureCoordBuffer = this.gl.createBuffer();
            gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
            var textureCoordinates = [
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
            ];
            gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.gl.STATIC_DRAW);
            {
                var numComponents = 2;
                var type = gl.FLOAT;
                var normalize = false;
                var stride = 0;
                var offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
                var textureLocate = gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
                gl.vertexAttribPointer(textureLocate, numComponents, type, normalize, stride, offset);
                gl.enableVertexAttribArray(textureLocate);
            }
            gl.activeTexture(gl['TEXTURE0']);
            gl.uniform1i(gl.getUniformLocation(this.shaderProgram, 'uSampler0'), 0);
        };
        webGl.prototype.bindTexture = function (image, id) {
            if (image.loadError) {
                this.updateOtherTexture(1);
                return;
            }
            if (!image.complete) {
                this.updateOtherTexture(0);
                return;
            }
            if (this.textures.get(id)) {
                this.updateTexture(id, image);
                return;
            }
            var gl = this.gl;
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            this.textures.set(id, texture);
            this.texImage(image);
            this.setTexParameteri(image.width, image.height);
        };
        webGl.prototype.updateTexture = function (id, image) {
            var gl = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this.textures.get(id));
            this.setTexParameteri(image.width, image.height);
        };
        webGl.prototype.updateOtherTexture = function (id) {
            var gl = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this.texturesOther.get(id));
            this.setTexParameteri(0, 3);
        };
        webGl.prototype.texImage = function (image) {
            var gl = this.gl;
            var level = 0;
            var internalFormat = gl.RGBA;
            var srcFormat = gl.RGBA;
            var srcType = gl.UNSIGNED_BYTE;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        };
        webGl.prototype.setTexParameteri = function (width, height) {
            var gl = this.gl;
            if (isPowerOf2(width) && isPowerOf2(height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            }
        };
        webGl.prototype.bindIndex = function (index) {
            var gl = this.gl;
            var indices = [
                index, index + 1, index + 2,
                index, index + 2, index + 3,
            ];
            var drawType = gl.TRIANGLES;
            if (this.indinces.has(index)) {
                var indexBuffer_1 = this.indinces.get(index);
                {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_1);
                    var vertexCount = indices.length;
                    var type = gl.UNSIGNED_SHORT;
                    var offset = 0;
                    gl.drawElements(drawType, vertexCount, type, offset);
                }
                return;
            }
            var indexBuffer = this.gl.createBuffer();
            this.indinces[index] = indexBuffer;
            this.indinces.set(index, indexBuffer);
            gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
            {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                var vertexCount = indices.length;
                var type = gl.UNSIGNED_SHORT;
                var offset = 0;
                gl.drawElements(drawType, vertexCount, type, offset);
            }
        };
        webGl.prototype.generateCube = function (width, height) {
            var _a;
            var cubeMove = 0.1;
            width = this.viewWidth;
            height = this.viewHeight;
            var z = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev - cubeMove;
            width -= cubeMove;
            height -= cubeMove;
            var positionCube = [
                -width / 2, -height / 2, z - width, 1.0,
                -width / 2, -height / 2, z, 1.0,
                -width / 2, height / 2, z, 1.0,
                -width / 2, height / 2, z - width, 1.0,
                -width / 2, -height / 2, z, 1.0,
                width / 2, -height / 2, z, 1.0,
                width / 2, height / 2, z, 1.0,
                -width / 2, height / 2, z, 1.0,
                width / 2, -height / 2, z, 1.0,
                width / 2, -height / 2, z - width, 1.0,
                width / 2, height / 2, z - width, 1.0,
                width / 2, height / 2, z, 1.0,
            ];
            (_a = this.positions).splice.apply(_a, __spreadArray([0, 0], positionCube));
        };
        webGl.prototype.decideScaleRatio = function (clientX, clientY) {
            var width = 0, height = 0;
            var centerX = this.viewWidth / (2);
            var centerY = this.viewHeight / (2);
            var rect = this.viewRect;
            var curWidth = rect.width * this.dpr;
            var curHeight = rect.height * this.dpr;
            var curImgShape = this.imgShape;
            var nw = curImgShape[0], nh = curImgShape[1];
            nw = Math.abs(nw);
            nh = Math.abs(nh);
            var scaleX, scaleY, dx = 0, dy = 0;
            clientX *= this.dpr;
            clientY *= this.dpr;
            if (this.isEnlargementForScale) {
                var _a = this.imgShapeInitinal, initialWidth = _a[0], initinalHeight = _a[1];
                width = Math.abs(initialWidth);
                height = Math.abs(initinalHeight);
                scaleX = width / curWidth - 1;
                scaleY = height / curHeight - 1;
                var _b = this.curCenterCoordinate, curCenterX = _b[0], curCenterY = _b[1];
                dx = -(curCenterX * (1 + scaleX));
                dy = -(curCenterY * (1 + scaleY));
            }
            else {
                if (this.curIsLongImg()) {
                    width = this.viewWidth > nw ? nw : this.viewWidth;
                    height = nh / nw * width;
                }
                else {
                    width = nw;
                    height = nh;
                }
                scaleX = width / curWidth - 1;
                scaleY = height / curHeight - 1;
                dx = -((clientX - centerX) * (scaleX));
                dy = ((clientY - centerY) * (scaleY));
                if (this.curIsLongImg()) {
                    dx = 0;
                }
            }
            return [
                scaleX,
                scaleY,
                dx,
                dy
            ];
        };
        webGl.prototype.decideImgViewSize = function (imgWidth, imgHeight) {
            var width = 0, height = 0;
            if (this.viewWidth >= imgWidth) {
                width = imgWidth;
            }
            else {
                width = this.viewWidth;
            }
            height = imgHeight / imgWidth * width;
            if (height > this.viewHeight) {
                height = this.viewHeight;
                width = height * imgWidth / imgHeight;
            }
            return [
                width,
                height
            ];
        };
        webGl.prototype.draw = function (index) {
            this.positions = [];
            var imgLength = this.imgUrls.length;
            var maxWidth = 0, maxHeight = 0;
            for (var i = index - 1; i <= index + 1; i++) {
                if (i !== -1 && i <= imgLength - 1) {
                    var image = void 0;
                    if (this.imgs[i]) {
                        image = this.imgs[i];
                    }
                    else if (typeof this.imgUrls[i] == 'string') {
                        image = this.loadImage(this.imgUrls[i], i);
                    }
                    else {
                        image = this.imgUrls[i];
                        if (typeof image._id == 'undefined') {
                            this.imgUrls[i] = this.validateImg(image);
                            image = this.imgUrls[i];
                        }
                    }
                    this.imgs[i] = image;
                    var naturalWidth = image.naturalWidth, naturalHeight = image.naturalHeight;
                    if (image.loadError) {
                        naturalWidth = naturalHeight = 200;
                    }
                    var _a = this.decideImgViewSize(naturalWidth * this.dpr, naturalHeight * this.dpr), width = _a[0], height = _a[1];
                    if (i == this.curIndex) {
                        this.imgShape = [naturalWidth * this.dpr, naturalHeight * this.dpr, 0, 1];
                        this.imgShapeInitinal = [width, height, 0, 1];
                    }
                    this.genPostion(width, height, i);
                    maxWidth = Math.max(width, maxWidth);
                    maxHeight = Math.max(height, maxHeight);
                }
            }
            this.generateCube(maxWidth, maxHeight);
            this.bindPostion();
            this.drawPosition();
        };
        webGl.prototype.createPerspectiveMatrix = function () {
            var fieldOfViewInRadians = this.fieldOfViewInRadians;
            var aspectRatio = this.viewWidth / this.viewHeight;
            var near = this.zNear;
            var far = this.zFar;
            var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
            var rangeInv = 1 / (near - far);
            return [
                f / aspectRatio, 0, 0, 0,
                0, f, 0, 0,
                0, 0, (near + far) * rangeInv, -1,
                0, 0, near * far * rangeInv * 2, 0
            ];
        };
        Object.defineProperty(webGl.prototype, "curPointAt", {
            get: function () {
                var curPointAt = (4) * 16;
                if (this.curIndex == 0) {
                    curPointAt = 3 * 16;
                }
                return curPointAt;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(webGl.prototype, "IsBoundaryLeft", {
            get: function () {
                var rect = this.viewRect;
                return Math.round(rect.left) >= 0 && this.isBoudriedSide;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(webGl.prototype, "isBoundaryRight", {
            get: function () {
                var rect = this.viewRect;
                return Math.round(rect.right * this.dpr) <= Math.round(((this.viewWidth / 1))) && this.isBoudriedSide;
            },
            enumerable: false,
            configurable: true
        });
        webGl.prototype.curIsLongImg = function () {
            var _a = this.imgShape, width = _a[0], height = _a[1];
            return Math.abs(width) * 2 <= Math.abs(height);
        };
        Object.defineProperty(webGl.prototype, "curCenterCoordinate", {
            get: function () {
                var curPlaneIndex = this.curPointAt;
                var curCenterX = (this.positions[curPlaneIndex] + this.positions[curPlaneIndex + 8]) / 2;
                var curCenterY = (this.positions[curPlaneIndex + 1] + this.positions[curPlaneIndex + 9]) / 2;
                return [
                    curCenterX,
                    curCenterY
                ];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(webGl.prototype, "viewRect", {
            get: function () {
                var topOriginX = -this.viewWidth / 2;
                var topOriginY = this.viewHeight / 2;
                var curPlaneIndex = this.curPointAt;
                var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                for (var i = curPlaneIndex; i < curPlaneIndex + 16; i += 4) {
                    var x = this.positions[i];
                    var y = this.positions[i + 1];
                    minX = Math.min(x, minX);
                    maxX = Math.max(x, maxX);
                    minY = Math.min(y, minY);
                    maxY = Math.max(y, maxY);
                }
                var width = Math.abs(minX - maxX);
                var height = Math.abs(minY - maxY);
                return {
                    left: (minX - topOriginX) / this.dpr,
                    right: (maxX - topOriginX) / this.dpr,
                    width: width / this.dpr,
                    height: height / this.dpr,
                    top: -(maxY - topOriginY) / this.dpr,
                    bottom: -(minY - topOriginY) / this.dpr,
                };
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(webGl.prototype, "curPlanePosition", {
            get: function () {
                this.curPointAt;
                return [];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(webGl.prototype, "isEnlargement", {
            get: function () {
                var _a = this.imgShapeInitinal; _a[0]; _a[1];
                var viewRect = this.viewRect;
                return (viewRect.width * this.dpr - 1 > this.viewWidth
                    ||
                        viewRect.height * this.dpr - 1 > this.viewHeight);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(webGl.prototype, "isEnlargementForScale", {
            get: function () {
                var _a = this.imgShapeInitinal, iw = _a[0], ih = _a[1];
                var rect = this.viewRect;
                return Math.round(rect.width * this.dpr) > Math.round(Math.abs(iw))
                    ||
                        Math.round(rect.height * this.dpr) > Math.round(Math.abs(ih));
            },
            enumerable: false,
            configurable: true
        });
        webGl.prototype.isLoadingError = function (index) {
            arguments.length == 0 && (index = this.curIndex);
            return this.imgs[index]['loadError'];
        };
        webGl.prototype.loadImage = function (src, index) {
            var _this = this;
            var img = new Image();
            img._id = this.imgId++;
            this.imgs[index] = img;
            img.onload = function () {
                _this.handleImgLoaded(img, index);
            };
            img.onerror = function () {
                img.loadError = true;
                _this.handleImgLoaded(img, index);
            };
            img.onabort = function () {
                img.loadError = true;
                _this.handleImgLoaded(img, index);
            };
            img.crossOrigin = 'anonymous';
            (img.src = src);
            return img;
        };
        webGl.prototype.handleImgLoaded = function (img, index) {
            index = this.imgs.indexOf(img);
            if (!img.loadError) {
                img = this.validateImg(img);
                this.imgs[index] = img;
            }
            if (~[-1, 0, 1].indexOf(index - this.curIndex)) {
                this.updatePosition(img, index - this.curIndex);
                this.bindPostion();
                this.drawPosition();
            }
        };
        webGl.prototype.validateImg = function (img) {
            var gl = this.gl;
            var maxTextureSize = gl.MAX_TEXTURE_SIZE;
            var naturalWidth = img.naturalWidth, naturalHeight = img.naturalHeight;
            var max = Math.max(naturalHeight, naturalWidth);
            if (max >= maxTextureSize) {
                var shrinkFactor = this.dpr;
                var width = maxTextureSize / shrinkFactor;
                var height = naturalHeight / naturalWidth * width;
                if (height >= maxTextureSize) {
                    height = maxTextureSize / shrinkFactor;
                    width = naturalWidth / naturalHeight * height;
                }
                var canvas = tailor(img, width, height);
                canvas._id = this.imgId++;
                canvas.naturalHeight = height;
                canvas.naturalWidth = width;
                canvas.complete = true;
                return canvas;
            }
            else {
                return img;
            }
        };
        webGl.prototype.clear = function () {
            var gl = this.gl;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        };
        webGl.prototype.bindShader = function (gl, sourceFrag, sourceVer) {
            var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, sourceVer);
            var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, sourceFrag);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
                return null;
            }
            return shaderProgram;
        };
        webGl.prototype.loadShader = function (gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };
        webGl.prototype.createPlane = function (_a) {
            _a.x; _a.y; _a.width; _a.height;
            return {};
        };
        webGl.prototype.intialView = function () {
            var canvas = document.createElement('canvas');
            canvas.style.cssText = "\n            position: absolute;\n            top: 0;\n            left:0;\n            z-index: 9;\n            width:" + window.innerWidth + "px;\n            height:" + window.innerHeight + "px;\n            user-select:none;\n            font-size:0;\n        ";
            canvas.width = window.innerWidth * this.dpr;
            canvas.height = window.innerHeight * this.dpr;
            this.ref = canvas;
            var gl = canvas.getContext('webgl', { antialias: true });
            if (!gl) {
                console.error('webgl is not supported. please use before version.');
            }
            this.viewWidth = canvas.width;
            this.viewHeight = canvas.height;
            return gl;
        };
        webGl.prototype.animate = function (_a) {
            var _this = this;
            var allTime = _a.allTime, timingFun = _a.timingFun, ends = _a.ends, playGame = _a.playGame, callback = _a.callback;
            var startTime = Date.now();
            var curTime = startTime;
            var resolve;
            var pro = new Promise(function (res) { return (resolve = res); });
            var eL = ends.length;
            var run = function () {
                if (_this.curAimateBreaked) {
                    resolve([false, 3]);
                    _this.curAimateBreaked = false;
                    return;
                }
                var offsetT = curTime - startTime;
                offsetT > allTime && (offsetT = allTime);
                var curX = (offsetT) / allTime;
                curX > 1 && (curX = 1);
                var curEnd = timingFun.solve(curX);
                if (curEnd >= 1) {
                    curEnd = 1;
                }
                var ans = new Array(eL);
                ends.forEach(function (end, index) {
                    ans[index] = end * curEnd;
                });
                playGame.apply(void 0, ans);
                if (curX < 1) {
                    requestAnimationFrame(run);
                }
                else {
                    callback && callback();
                    resolve([false, 1]);
                }
                curTime = Date.now();
            };
            run();
            return pro;
        };
        return webGl;
    }());

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var ImagePreview = (function () {
        function ImagePreview(options) {
            this.options = options;
            this.showTools = true;
            this.lastClick = -Infinity;
            this.curIndex = 0;
            this.imgContainerMoveX = 0;
            this.imgContainerMoveY = 0;
            this.slideTime = 300;
            this.zoomScale = 0.05;
            this.isZooming = false;
            this.isAnimating = false;
            this.isEnlargeMove = false;
            this.isNormalMove = false;
            this.normalMoved = false;
            this.maxMovePointCounts = 3;
            this.touchIdentifier = 0;
            this.prefix = "__";
            this.defToggleClass = 'defToggleClass';
            this.movePoints = [];
            this.fingerDirection = '';
            this.moveStartTime = 0;
            this.moveEndTime = 0;
            this.doubleClickDuration = 300;
            this.initalMatrix = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 1],
            ];
            if (options.selector) {
                this.bindTrigger();
            }
            if (!this.options.imgs) {
                this.options.imgs = [];
            }
            this.actionExecutor = new webGl({
                images: this.options.imgs
            });
            this.taskExecuteAfterTEnd = new Map;
            this.envClient = this.testEnv();
            this.genFrame();
            this.handleReausetAnimate();
            this.imgContainer = this.ref.querySelector("." + this.prefix + "imgContainer");
            this.imgContainer.matrix = this.initalMatrix;
            this[this.envClient + 'Initial']();
        }
        ImagePreview.prototype.handleZoom = function (e) { };
        ImagePreview.prototype.handleMove = function (e) { };
        ImagePreview.prototype.handleMoveNormal = function (e) { };
        ImagePreview.prototype.handleMoveEnlage = function (e) { };
        ImagePreview.prototype.rotateLeft = function (e) { };
        ImagePreview.prototype.rotateRight = function (e) { };
        ImagePreview.prototype.autoMove = function (deg, startX, startY, _a) {
            _a.maxTop; _a.minTop; _a.maxLeft; _a.minLeft;
            return Promise.resolve(1);
        };
        ImagePreview.prototype.insertImageAfter = function (image, index) {
            this.actionExecutor.addImg(image, index);
        };
        ImagePreview.prototype.delImage = function (index) {
            this.actionExecutor.delImg(index);
        };
        ImagePreview.prototype.mobileInitial = function () {
            this.ref.addEventListener('touchstart', this.handleTouchStart.bind(this));
            this.ref.addEventListener('touchmove', this.handleMove.bind(this));
            this.ref.addEventListener('touchend', this.handleToucnEnd.bind(this));
            this.ref.querySelector("." + this.prefix + "close").addEventListener('touchstart', this.close.bind(this));
            this.handleResize = this.handleResize.bind(this);
            window.addEventListener('resize', this.handleResize);
            window.addEventListener('orientationchange', this.handleResize);
        };
        ImagePreview.prototype.handleResize = function () {
            this.actionExecutor.eventsHanlder.handleResize();
        };
        ImagePreview.prototype.bindTrigger = function () {
            var images = [];
            var triggerItems = document.querySelectorAll(this.options.selector);
            if (!triggerItems.length) ;
            triggerItems.forEach(function (element, index) {
                images.push(element.dataset.src || element.src);
            });
            this.options.imgs = images;
            var imgPreviewer = this;
            triggerItems.forEach(function (element, index) {
                element.addEventListener('click', function (e) {
                    imgPreviewer.show(index);
                });
            });
        };
        ImagePreview.prototype.addTouchEndTask = function (type, task) {
            if (!this.taskExecuteAfterTEnd.has(type)) {
                this.taskExecuteAfterTEnd.set(type, task);
            }
        };
        ImagePreview.prototype.handleTouchStart = function (e) {
            e.preventDefault();
            switch (e.touches.length) {
                case 1:
                    this.handleOneStart(e);
                    break;
                case 2:
                    this.handleTwoStart(e);
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
            if (this[type]) {
                this[type](e);
                return;
            }
            if (Date.now() - this.lastClick < this.doubleClickDuration) {
                clearTimeout(this.performerClick);
                this.handleDoubleClick(e);
            }
            else {
                this.performerClick = setTimeout(function () {
                    _this.handleClick(e);
                }, this.doubleClickDuration);
            }
            this.lastClick = Date.now();
            this.getMovePoints(e);
            this.startXForDirection = e.touches[0].clientX;
        };
        ImagePreview.prototype.handleClick = function (e) {
            var close = (this.ref.querySelector("." + this.prefix + "close"));
            var bottom = (this.ref.querySelector("." + this.prefix + "bottom"));
            this.showTools = !this.showTools;
            if (this.isAnimating) ;
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
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isAnimating) {
                                return [2];
                            }
                            this.isAnimating = true;
                            return [4, this.actionExecutor.eventsHanlder.handleDoubleClick(e.touches[0])];
                        case 1:
                            _a.sent();
                            this.isAnimating = false;
                            return [2];
                    }
                });
            });
        };
        ImagePreview.prototype.handleToucnEnd = function (e) {
            e.preventDefault();
            var taskArray = Array.
                from(this.taskExecuteAfterTEnd.values())
                .sort(function (a, b) { return b.priority - a.priority; });
            taskArray.forEach(function (item) {
                item.callback(e);
            });
            this.taskExecuteAfterTEnd.clear();
        };
        ImagePreview.prototype.handleTEndEnlarge = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var actionExecutor, curItemRect, conWidth, conHeight, curItemWidth, curItemHeihgt, curItemViewTop, curItemViewLeft, curItemViewRight, maxTop, minTop, maxLeft, minLeft, curItemTop, curItemLeft, recoverY, recoverX, endX, endY, endPoint, startPoint, dx, dy, degree, touchTime, boundryObj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            actionExecutor = this.actionExecutor;
                            curItemRect = actionExecutor.viewRect;
                            conWidth = actionExecutor.viewWidth / actionExecutor.dpr;
                            conHeight = actionExecutor.viewHeight / actionExecutor.dpr;
                            curItemWidth = curItemRect.width;
                            curItemHeihgt = curItemRect.height;
                            curItemViewTop = curItemRect.top;
                            curItemViewLeft = curItemRect.left;
                            curItemViewRight = curItemRect.right;
                            maxTop = 0;
                            minTop = conHeight - curItemHeihgt;
                            maxLeft = 0;
                            minLeft = conWidth - curItemWidth;
                            curItemTop = curItemRect.top;
                            curItemLeft = curItemRect.left;
                            recoverY = false;
                            recoverX = false;
                            endX = 0;
                            endY = 0;
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
                                endX = 0;
                            }
                            if (curItemHeihgt <= conHeight) {
                                recoverY = false;
                                endY = 0;
                            }
                            if (!(recoverX || recoverY)) return [3, 2];
                            this.isAnimating = true;
                            return [4, actionExecutor.eventsHanlder.handleTEndEnlarge(e, endX, endY, 0)];
                        case 1:
                            _a.sent();
                            this.isAnimating = false;
                            return [3, 4];
                        case 2:
                            this.moveEndTime = Date.now();
                            endPoint = {
                                x: this.startX,
                                y: this.startY
                            };
                            startPoint = {
                                x: this.touchStartX,
                                y: this.touchStartY
                            };
                            dx = endPoint.x - startPoint.x;
                            dy = endPoint.y - startPoint.y;
                            degree = Math.atan2(dy, dx) * 180 / Math.PI;
                            touchTime = this.moveEndTime - this.moveStartTime;
                            if (!(touchTime < 90 && ((Math.abs(dx) + Math.abs(dy)) > 5))) return [3, 4];
                            boundryObj = { maxTop: maxTop, minTop: minTop, maxLeft: maxLeft, minLeft: conWidth - curItemWidth };
                            this.isAnimating = true;
                            return [4, this.autoMove(degree, curItemViewLeft, curItemViewTop, boundryObj)];
                        case 3:
                            _a.sent();
                            this.isAnimating = false;
                            _a.label = 4;
                        case 4:
                            this.moveStartTime = 0;
                            return [2];
                    }
                });
            });
        };
        ImagePreview.prototype.handleTEndEnNormal = function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var endX, eventsHanlder, offset;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isAnimating) {
                                return [2];
                            }
                            endX = (e.changedTouches[0].clientX);
                            eventsHanlder = this.actionExecutor.eventsHanlder;
                            offset = endX - this.touchStartX;
                            if (offset === 0) {
                                return [2];
                            }
                            this.isAnimating = true;
                            return [4, eventsHanlder.handleTEndEnNormal(e, offset)];
                        case 1:
                            _a.sent();
                            this.isAnimating = false;
                            return [2];
                    }
                });
            });
        };
        ImagePreview.prototype.genFrame = function () {
            var _this = this;
            var images = this.options.imgs;
            if (!images || !images.length) ;
            this.imgsNumber = images.length;
            this.curIndex = 0;
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
                    case 'itemHeight':
                        if (_this.envClient == 'pc') {
                            return '100%';
                        }
                        else {
                            return 'auto';
                        }
                    case 'itemScroll':
                        if (_this.envClient == 'pc') {
                            return 'auto ';
                        }
                        else {
                            return 'hidden';
                        }
                    case 'item-text-align':
                        if (_this.envClient == 'pc') {
                            return 'center ';
                        }
                        else {
                            return 'initial';
                        }
                    default: return '';
                }
            };
            var html = "\n                <div class=\"" + this.prefix + "close\">\n                    <svg t=\"1563161688682\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"5430\">\n                        <path d=\"M10.750656 1013.12136c-13.822272-13.822272-13.822272-36.347457 0-50.169729l952.200975-952.200975c13.822272-13.822272 36.347457-13.822272 50.169729 0 13.822272 13.822272 13.822272 36.347457 0 50.169729l-952.200975 952.200975c-14.334208 14.334208-36.347457 14.334208-50.169729 0z\" fill=\"#ffffff\" p-id=\"5431\"></path><path d=\"M10.750656 10.750656c13.822272-13.822272 36.347457-13.822272 50.169729 0L1013.633296 963.463567c13.822272 13.822272 13.822272 36.347457 0 50.169729-13.822272 13.822272-36.347457 13.822272-50.169729 0L10.750656 60.920385c-14.334208-14.334208-14.334208-36.347457 0-50.169729z\" fill=\"#ffffff\" p-id=\"5432\">\n                        </path>\n                    </svg>\n                </div>\n                <div class=\"" + this.prefix + "imgContainer\"></div>\n                <div class=\"" + this.prefix + "bottom\">\n                    " + (this.envClient == 'pc' ?
                "<div class=\"" + this.prefix + "item\" title=\"before\">\n                        <svg data-type=\"slideBefore\" t=\"1563884004339\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1099\" width=\"200\" height=\"200\"><path d=\"M170.666667 477.866667L349.866667 298.666667l29.866666 29.866666-149.333333 149.333334h669.866667v42.666666H128l42.666667-42.666666z\" p-id=\"1100\" fill=\"#ffffff\"></path></svg>\n                    </div>\n                    <div class=\"" + this.prefix + "item \" title=\"next\">\n                        <svg data-type=\"slideNext\" t=\"1563884004339\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1099\" width=\"200\" height=\"200\"><path d=\"M849.066667 512l-179.2 179.2-29.866667-29.866667 149.333333-149.333333H128v-42.666667h763.733333l-42.666666 42.666667z\" p-id=\"1100\" fill=\"#ffffff\"></path></svg>\n                    </div>" : '') + "\n                    <div class=\"" + this.prefix + "item \">\n                        <svg data-type=\"rotateLeft\" t=\"1563884004339\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1099\" width=\"200\" height=\"200\"><path d=\"M520.533333 285.866667c140.8 12.8 251.733333 132.266667 251.733334 277.333333 0 153.6-123.733333 277.333333-277.333334 277.333333-98.133333 0-192-55.466667-238.933333-140.8-4.266667-8.533333-4.266667-21.333333 8.533333-29.866666 8.533333-4.266667 21.333333-4.266667 29.866667 8.533333 42.666667 72.533333 119.466667 119.466667 204.8 119.466667 128 0 234.666667-106.666667 234.666667-234.666667s-98.133333-230.4-226.133334-234.666667l64 102.4c4.266667 8.533333 4.266667 21.333333-8.533333 29.866667-8.533333 4.266667-21.333333 4.266667-29.866667-8.533333l-89.6-145.066667c-4.266667-8.533333-4.266667-21.333333 8.533334-29.866667L597.333333 187.733333c8.533333-4.266667 21.333333-4.266667 29.866667 8.533334 4.266667 8.533333 4.266667 21.333333-8.533333 29.866666l-98.133334 59.733334z\" p-id=\"1100\" fill=\"#ffffff\"></path></svg>\n                    </div>\n                    <div class=\"" + this.prefix + "item\">\n                        <svg data-type=\"rotateRight\"  t=\"1563884064737\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1251\" width=\"200\" height=\"200\"><path d=\"M503.466667 285.866667L405.333333 226.133333c-8.533333-8.533333-12.8-21.333333-8.533333-29.866666 8.533333-8.533333 21.333333-12.8 29.866667-8.533334l145.066666 89.6c8.533333 4.266667 12.8 17.066667 8.533334 29.866667l-89.6 145.066667c-4.266667 8.533333-17.066667 12.8-29.866667 8.533333-8.533333-4.266667-12.8-17.066667-8.533333-29.866667l64-102.4c-123.733333 4.266667-226.133333 106.666667-226.133334 234.666667s106.666667 234.666667 234.666667 234.666667c85.333333 0 162.133333-46.933333 204.8-119.466667 4.266667-8.533333 17.066667-12.8 29.866667-8.533333 8.533333 4.266667 12.8 17.066667 8.533333 29.866666-51.2 85.333333-140.8 140.8-238.933333 140.8-153.6 0-277.333333-123.733333-277.333334-277.333333 0-145.066667 110.933333-264.533333 251.733334-277.333333z\" p-id=\"1252\" fill=\"#ffffff\"></path></svg>\n                    </div>\n                </div>\n        ";
            var isIPhoneX = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812;
            var isIPhoneXSMax = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896;
            var isIPhoneXR = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896;
            var needHigher = isIPhoneX || isIPhoneXSMax || isIPhoneXR;
            var style = "\n            ." + this.prefix + "imagePreviewer{\n                position: fixed;\n                top:0;\n                left: 100%;\n                width: 100%;\n                height: 100%;\n                background: " + genStyle('conBackground') + ";\n                color:#fff;\n                transform: translate3d(0,0,0);\n                transition: left 0.5s;\n                overflow:hidden;\n                user-select: none;\n            }\n            \n            ." + this.prefix + "imagePreviewer." + this.defToggleClass + "{\n                left: 0%;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "close{\n                position: absolute;\n                top: 20px;\n                right: 20px;\n                z-index: 10;\n                box-sizing: border-box;\n                width: 22px;\n                height: 22px;\n                cursor:pointer;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "close svg{\n                width: 100%;\n                height: 100%;             \n            }\n            ." + this.prefix + "imagePreviewer svg{\n                overflow:visible;\n            }\n            ." + this.prefix + "imagePreviewer svg path{\n                stroke: #948888;\n                stroke-width: 30px;\n            }\n            \n            ." + this.prefix + "imagePreviewer " + this.prefix + ".close." + this.prefix + "scroll{\n                height: 0;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "imgContainer{\n                position: relative;\n                height: 100%;\n                font-size: 0;\n                white-space: nowrap;\n            }\n            \n            ." + this.prefix + "imagePreviewer ." + this.prefix + "bottom{\n                position: absolute;\n                bottom: " + (needHigher ? 20 : 0) + "px;\n                left: 20px;\n                right: 20px;\n                z-index: 10;\n                padding: 0 10px;\n                text-align: center;\n                border-top: 1px solid rgba(255, 255, 255, .2);\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "bottom ." + this.prefix + "item{\n                display:inline-block;\n                width: 42px;\n                height: 42px;\n                cursor:pointer;\n            }\n            ." + this.prefix + "imagePreviewer ." + this.prefix + "bottom ." + this.prefix + "item svg{\n                box-sizing: border-box;\n                width: 100%;\n                height: 100%;\n                padding:10px;\n            }\n        ";
            this.ref = document.createElement('div');
            this.ref.className = this.prefix + "imagePreviewer";
            this.ref.innerHTML = html;
            if (!document.querySelector("#" + this.prefix + "style")) {
                var styleElem = document.createElement('style');
                styleElem.id = this.prefix + "style";
                styleElem.innerHTML = style;
                document.querySelector('head').appendChild(styleElem);
            }
            this.ref.querySelector("." + this.prefix + "imgContainer").append(this.actionExecutor.ref);
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
            this[this.envClient + 'BeforeClose']();
            this.toggleClass(this.ref, this.defToggleClass);
        };
        ImagePreview.prototype.pcBeforeClose = function () {
            document.body.style['overflow'] = document.body.dataset['imgPreOverflow'];
        };
        ImagePreview.prototype.mobileBeforeClose = function () { };
        ImagePreview.prototype.show = function (index) {
            this.actionExecutor.curIndex = index;
            this.actionExecutor.draw(index);
            this.toggleClass(this.ref, this.defToggleClass);
        };
        ImagePreview.prototype.mobileReadyShow = function () { };
        ImagePreview.prototype.pcReadyShow = function () {
            var styleDesc = window.getComputedStyle(document.body);
            document.body.dataset['imgPreOverflow'] = styleDesc.overflow;
            document.body.style['overflow'] = 'hidden';
        };
        ImagePreview.prototype.toggleClass = function (ref, className) {
            var classes = ref.className.split(' ');
            var index = classes.indexOf(className);
            if (index !== -1) {
                classes.splice(index, 1);
            }
            else {
                classes.push(className);
            }
            ref.className = classes.join(' ');
        };
        ImagePreview.prototype.getMovePoints = function (e) {
            var _this = this;
            if (this.movePoints.length > this.maxMovePointCounts) {
                return;
            }
            this.movePoints.push({
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            });
            var type = 'resetMovePoints';
            this.addTouchEndTask(type, {
                priority: 1,
                callback: function () { return (_this.movePoints = []); }
            });
        };
        ImagePreview.prototype.decideMoveDirection = function () {
            var _this = this;
            var L = this.movePoints.length;
            var endPoint = this.movePoints[L - 1];
            var startPoint = this.movePoints[0];
            var dx = endPoint.x - startPoint.x;
            var dy = endPoint.y - startPoint.y;
            var degree = Math.atan2(dy, dx) * 180 / Math.PI;
            if (Math.abs(90 - Math.abs(degree)) < 30) {
                this.fingerDirection = 'vertical';
            }
            else {
                this.fingerDirection = 'horizontal';
            }
            var type = 'resetFingerDirection';
            this.addTouchEndTask(type, {
                priority: 1,
                callback: function () {
                    _this.fingerDirection = '';
                }
            });
        };
        ImagePreview.prototype.destroy = function () {
            this.ref.parentNode.removeChild(this.ref);
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('orientationchange', this.handleResize);
        };
        ImagePreview.prototype.testEnv = function () {
            if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                return 'mobile';
            }
            else {
                return 'pc';
            }
        };
        ImagePreview = __decorate([
            adapterPC
        ], ImagePreview);
        return ImagePreview;
    }());
    applyMixins(ImagePreview, [Move, Zoom, Rotate]);
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }

    exports.ImagePreview = ImagePreview;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
