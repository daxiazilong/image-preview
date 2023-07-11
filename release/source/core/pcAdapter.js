var __extends = (this && this.__extends) || (function () {
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
export default (function (constructor) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mouseDown = false;
            return _this;
        }
        class_1.prototype.pcInitial = function () {
            this.ref.querySelector(".".concat(this.prefix, "close")).addEventListener('mousedown', this.close.bind(this));
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
            return __awaiter(this, void 0, void 0, function () {
                var centerFingerX, centerFingerY, actionExecutor, centerImgCenterX, centerImgCenterY, x, y, sx, sy, zoomScale;
                return __generator(this, function (_a) {
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
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
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
            return __awaiter(this, void 0, void 0, function () {
                var isFirst;
                return __generator(this, function (_a) {
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
                                    querySelectorAll(".".concat(this.prefix, "bottom .").concat(this.prefix, "item "))[0].style
                                    .cursor = "not-allowed";
                            }
                            else {
                                this.
                                    ref.
                                    querySelectorAll(".".concat(this.prefix, "bottom .").concat(this.prefix, "item "))[1].style
                                    .cursor = "pointer";
                            }
                            this.isAnimating = false;
                            return [2];
                    }
                });
            });
        };
        class_1.prototype.slideNext = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isLast;
                return __generator(this, function (_a) {
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
                                    querySelectorAll(".".concat(this.prefix, "bottom .").concat(this.prefix, "item "))[1].style
                                    .cursor = "not-allowed";
                            }
                            else {
                                this.
                                    ref.
                                    querySelectorAll(".".concat(this.prefix, "bottom .").concat(this.prefix, "item "))[0].style
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
