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
import { matrix } from "../matrix";
var events = /** @class */ (function () {
    function events(viewInstance) {
        this.curBehaviorCanBreak = false;
        this.throldDeg = Math.PI * 0.12;
        this.viewInstance = viewInstance;
    }
    events.prototype.handleSingleStart = function (e) {
        throw new Error('Method not implemented.');
    };
    events.prototype.handleDoubleClick = function (e) {
        var _a = e.touches[0], clientX = _a.clientX, clientY = _a.clientY;
        var viewInstance = this.viewInstance;
        var _b = viewInstance.decideScaleRatio(clientX, clientY), scaleX = _b[0], scaleY = _b[1], dx = _b[2], dy = _b[3];
        return viewInstance.scaleZPosition({ scaleX: scaleX, scaleY: scaleY, dx: dx, dy: dy });
    };
    events.prototype.handleMoveEnlage = function (e, x, y, z) {
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
    events.prototype.handleZoom = function (e, sx, sy, dx, dy) {
        var viewInstance = this.viewInstance;
        var _a = viewInstance.imgShape, nw = _a[0], nh = _a[1];
        var _b = viewInstance.imgShapeInitinal, iW = _b[0], iH = _b[1];
        nw = Math.abs(nw);
        nh = Math.abs(nh);
        iW = Math.abs(iW);
        iH = Math.abs(iH);
        var curItemRect = viewInstance.viewRect;
        var curItemWidth = curItemRect.width * viewInstance.dpr;
        // biggest width for zoom in
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
        return __awaiter(this, void 0, void 0, function () {
            var viewInstance, maxDeg, degX, plusOrMinus, beforeIndex, nextIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        viewInstance = this.viewInstance;
                        maxDeg = Math.PI / 2;
                        degX = -offset / (viewInstance.viewWidth / viewInstance.dpr) * maxDeg;
                        plusOrMinus = degX / Math.abs(degX);
                        viewInstance.baseModel = viewInstance.modelMatrix;
                        if (!(Math.abs(degX) >= this.throldDeg)) return [3 /*break*/, 6];
                        beforeIndex = viewInstance.curIndex;
                        nextIndex = viewInstance.curIndex + (plusOrMinus * 1);
                        if (!(nextIndex == -1 || nextIndex == viewInstance.imgUrls.length)) return [3 /*break*/, 2];
                        viewInstance.curIndex = beforeIndex;
                        return [4 /*yield*/, viewInstance.rotate(-degX)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 2: return [4 /*yield*/, viewInstance.rotate(plusOrMinus * Math.PI / 2 - degX)];
                    case 3:
                        _a.sent();
                        viewInstance.curIndex = nextIndex;
                        viewInstance.modelMatrix = viewInstance.baseModel = viewInstance.initialModel;
                        viewInstance.gl.uniformMatrix4fv(viewInstance.gl.getUniformLocation(viewInstance.shaderProgram, 'uModelViewMatrix'), false, viewInstance.modelMatrix);
                        return [4 /*yield*/, viewInstance.draw(nextIndex)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 8];
                    case 6: // 复原
                    return [4 /*yield*/, viewInstance.rotate(-degX)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        viewInstance.modelMatrix = viewInstance.baseModel = viewInstance.initialModel;
                        return [2 /*return*/, 'handled'];
                }
            });
        });
    };
    events.prototype.handleTEndEnlarge = function (e, x, y, z) {
        return __awaiter(this, void 0, void 0, function () {
            var viewInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ;
                        viewInstance = this.viewInstance;
                        x *= viewInstance.dpr;
                        y *= -viewInstance.dpr;
                        z *= viewInstance.dpr;
                        console.log('handleTEndEnlarge', x, y, z);
                        this.curBehaviorCanBreak = true;
                        return [4 /*yield*/, viewInstance.moveCurPlane(x, y, 0)];
                    case 1:
                        _a.sent();
                        this.curBehaviorCanBreak = false;
                        if (x !== 0) {
                            viewInstance.isBoudriedSide = true;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    events.prototype.moveCurPlaneTo = function (x, y, z) {
        return __awaiter(this, void 0, void 0, function () {
            var viewInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        viewInstance = this.viewInstance;
                        x *= viewInstance.dpr;
                        y *= -viewInstance.dpr;
                        z *= viewInstance.dpr;
                        this.curBehaviorCanBreak = true;
                        return [4 /*yield*/, viewInstance.moveCurPlane(x, y, 0)];
                    case 1:
                        _a.sent();
                        this.curBehaviorCanBreak = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    return events;
}());
export { events };
