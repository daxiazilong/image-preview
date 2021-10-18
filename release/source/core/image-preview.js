var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import adapterPC from './pcAdapter';
import { Move, Zoom, Rotate } from '../action/index';
import { webGl } from '../webgl/index';
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
        var maxTop = _a.maxTop, minTop = _a.minTop, maxLeft = _a.maxLeft, minLeft = _a.minLeft;
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
        ;
        this.actionExecutor.eventsHanlder.handleResize();
    };
    ImagePreview.prototype.bindTrigger = function () {
        var images = [];
        var triggerItems = document.querySelectorAll(this.options.selector);
        if (!triggerItems.length) {
        }
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
        if (this.isAnimating) {
        }
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
        if (!images || !images.length) {
        }
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
export { ImagePreview };
