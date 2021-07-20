var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var sourceFrag = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler0;\nuniform vec2 iResolution;\nvoid main() {\n\n    // vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);\n    vec4 color0 = texture2D(uSampler0, vTextureCoord) ;\n    gl_FragColor = color0;\n}";
var sourceVer = "attribute vec4 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\n\nvarying mediump vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n    vTextureCoord = aTextureCoord;\n}";
import { matrix } from './matrix';
import { cubicBezier, linear } from '../animation/animateJs';
import { events } from './eventSystem/index';
import { errImgBase64 } from './static/index';
import { tailor } from './tools/canvas-tools';
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
            ;
            if (typeof image._id == 'undefined') {
                image._id = this.imgId++;
            }
            if (!image.complete) {
                var load = function () {
                    ;
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
                ;
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
        this.rotate(0.5 * Math.PI);
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
        ;
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
        ;
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
        ;
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
        ;
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
                width = this.viewWidth;
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
        ;
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
            var curPlaneIndex = this.curPointAt;
            return [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(webGl.prototype, "isEnlargement", {
        get: function () {
            var _a = this.imgShapeInitinal, iw = _a[0], ih = _a[1];
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
            ;
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
        ;
        arguments.length == 0 && (index = this.curIndex);
        return this.imgs[index]['loadError'];
    };
    webGl.prototype.loadImage = function (src, index) {
        var _this = this;
        var img = new Image();
        img._id = this.imgId++;
        this.imgs[index] = img;
        var isHandled = false;
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
        ;
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
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
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
            ;
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
export { webGl };
