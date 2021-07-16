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
import { fps } from './tools/index';
var easeOut1 = new cubicBezier(0.18, 0.96, 0.18, 0.96);
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}
var forDev = 0;
var webGl = /** @class */ (function () {
    function webGl(_a) {
        var images = _a.images;
        this.dpr = window.devicePixelRatio || 1;
        this.fieldOfViewInRadians = 0.1 * Math.PI;
        this.zNear = 100.0;
        this.zFar = 10000.0;
        this.curIndex = 0;
        this.defaultAnimateTime = 300;
        this.indinces = new Map;
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
        this.positions = [];
        this.imgs = [];
        this.imgUrls = [];
        this.imgShape = []; //快速定位旋转之后图片的尺寸
        this.imgShapeInitinal = []; //快速定位旋转之后图片的尺寸
        this.textures = new Map; //贴图 保存图片贴图
        this.texturesOther = new Map; // 保存背景色及其他贴图
        this.curPlane = []; // 动画执行前的当前面的位置信息
        this.isBoudriedSide = false; //放大移动时 是否曾到达过边界 在移动放大得图片至超过边界后 恢复到最大边界位置后为true
        this.curAimateBreaked = false; // 当前动画是否被打断
        this.imgId = 0;
        fps()();
        this.gl = this.intialView();
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.imgUrls = images;
        var gl = this.gl;
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE) // anti-aliasing
        // gl.enable(gl.SAMPLE_COVERAGE) // anti-aliasing
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
            gl.enable(gl.DEPTH_TEST); // Enable depth testing
            gl.depthFunc(gl.LEQUAL); // Near things obscure far things
            // gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE) // anti-aliasing
            // gl.enable(gl.SAMPLE_COVERAGE) // anti-aliasing
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
        var beforL = this.imgUrls.length;
        var indexShouldInImgs = index + 1;
        if (index <= -1) {
            index = -1;
            indexShouldInImgs = 0;
        }
        else if (index > beforL) {
            index = beforL;
            indexShouldInImgs = beforL;
        }
        this.imgUrls.splice(index + 1, 0, image);
        // use splice will make  different  order between imgs and imgUrls
        this.imgs[indexShouldInImgs] = null;
        if (image instanceof Image) {
            if (typeof image._id == 'undefined') {
                image._id = this.imgId++;
            }
        }
        index -= this.curIndex;
        // the inserted index is -1 0 1 , is in current view so need draw again
        if (~[-2, -1, 0].indexOf(index)) {
            console.log(this.imgUrls);
            console.log(this.imgs);
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
        // bgd of cubic
        this.texturesOther.set(0, texture);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //@ts-ignore
        texture.cubicBgd = true;
        var r = 0; //Math.round( Math.random() * 255 )
        var g = 0; //Math.round( Math.random() * 255 )
        var b = 0; //Math.round( Math.random() * 255 )
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([r, g, b, 255]));
        // err img
        var img = new Image();
        img.onload = function () {
            // 200 200
            var textureErrImg = gl.createTexture();
            _this.texturesOther.set(1, textureErrImg);
            gl.bindTexture(gl.TEXTURE_2D, textureErrImg);
            _this.texImage(img);
            _this.setTexParameteri(img.width, img.height);
        };
        img.src = errImgBase64;
        // document.body.append(img)
    };
    webGl.prototype.initData = function () {
        this.draw(this.curIndex);
    };
    webGl.prototype.slideNext = function () {
        this.rotate(0.5 * Math.PI);
    };
    // rotate around y axis
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
    // rotate around z axis
    webGl.prototype.rotateZ = function (deg) {
        var _this = this;
        this.curPlane = this.positions.slice(this.curPointAt, this.curPointAt + 16);
        var curImgShape = this.imgShape;
        var curImgShapeInitinal = this.imgShapeInitinal;
        // 储存旋转位置变化信息
        this.imgShape = matrix.multiplyPoint(curImgShape, matrix.rotateZMatrix(deg));
        this.imgShapeInitinal = matrix.multiplyPoint(curImgShapeInitinal, matrix.rotateZMatrix(deg));
        // todo . every rotate should reCenter the img center
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
        // console.log(z)
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
        var key = index - this.curIndex; // -1 , 0 , 1;
        key += 1; // -1,0,1 -> 0,1,2
        (_a = this.positions).push.apply(_a, positionsMap[key]);
    };
    /**
     * 图片异步加载之后更新顶点坐标位置。
     * @param index 相对于 curIndex 的位置 -1,0,1
     */
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
        // console.log(z)
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
        key += 1; // -1,0,1 -> 0,1,2;
        var curPlane = positionsMap[key];
        for (var i = indexInPosition; i < indexInPosition + 16; i++) {
            this.positions[i] = curPlane[i - indexInPosition];
        }
    };
    webGl.prototype.bindPostion = function () {
        var gl = this.gl;
        var positions = this.positions;
        var positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);
        {
            var numComponents = 4;
            var type = gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            var aVerLocate = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
            gl.vertexAttribPointer(aVerLocate, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(aVerLocate);
        }
    };
    webGl.prototype.drawPosition = function () {
        // 生成黑色立方体作为背景
        this.clear();
        var gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.texturesOther.get(0));
        for (var i = 0, L = 12; i < L; i += 4) {
            this.bindIndex(i);
        }
        // 生成 真真的 图片
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
                // loading
                console.log("shouldn't have");
            }
            this.bindIndex(12 + i * 4);
        }
        // console.log('\n')
        // console.log( this.positions )
    };
    webGl.prototype.rotatePosition = function (deg) {
        var zInitial = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev;
        var centerX = this.viewWidth / 2;
        this.modelMatrix = matrix.multiplyMatrices(this.baseModel, matrix.translateMatrix(0, 0, centerX - zInitial), // 挪到坐标原点
        matrix.rotateYMatrix(deg), //开始旋转
        matrix.translateMatrix(0, 0, zInitial - (centerX)) // 挪到原位置
        );
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
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            //  right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            //  right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // left
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
        // Bind the texture to texture unit 0
        gl.activeTexture(gl['TEXTURE0']);
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, 'uSampler0'), 0);
    };
    webGl.prototype.bindTexture = function (image, id) {
        ;
        if (image.loadError) {
            this.updateOtherTexture(1);
            return;
        }
        if (!image.complete) { //loading ing
            this.updateOtherTexture(0);
            return;
        }
        if (this.textures.get(id)) { // 该图片已经创建过贴图 直接拿来复用
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
        this.setTexParameteri(0, 3); // default
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
        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(width) && isPowerOf2(height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //gl.LINEAR_MIPMAP_LINE
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
                // gl.drawArrays(gl.TRIANGLES,index,vertexCount)
            }
            return;
        }
        var indexBuffer = this.gl.createBuffer();
        this.indinces[index] = indexBuffer;
        this.indinces.set(index, indexBuffer);
        gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // console.log(indices)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            var vertexCount = indices.length;
            var type = gl.UNSIGNED_SHORT;
            var offset = 0;
            gl.drawElements(drawType, vertexCount, type, offset);
            // gl.drawArrays(gl.TRIANGLES,index,vertexCount)
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
            // left
            -width / 2, -height / 2, z - width, 1.0,
            -width / 2, -height / 2, z, 1.0,
            -width / 2, height / 2, z, 1.0,
            -width / 2, height / 2, z - width, 1.0,
            //front
            -width / 2, -height / 2, z, 1.0,
            width / 2, -height / 2, z, 1.0,
            width / 2, height / 2, z, 1.0,
            -width / 2, height / 2, z, 1.0,
            // right
            width / 2, -height / 2, z, 1.0,
            width / 2, -height / 2, z - width, 1.0,
            width / 2, height / 2, z - width, 1.0,
            width / 2, height / 2, z, 1.0,
        ];
        (_a = this.positions).splice.apply(_a, __spreadArray([0, 0], positionCube));
    };
    /**
     * @param clientX 缩放点得x坐标
     * @param clientY 缩放点得y坐标
     * @returns [缩放x比率,缩放y比率,x轴偏移 y轴偏移]
     */
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
        if (this.isEnlargementForScale) { // 放大双击得时候就缩小
            var _a = this.imgShapeInitinal, initialWidth = _a[0], initinalHeight = _a[1];
            width = Math.abs(initialWidth);
            height = Math.abs(initinalHeight);
            // eg. if ratio is 0.2 then result is -0.8 ,during animate  it becomes 1 0.9 .0.8 
            scaleX = width / curWidth - 1;
            scaleY = height / curHeight - 1;
            //  it's should be the offset of the img's center Point
            //  this coordinate center is 0 , 0  on the center of screen
            var _b = this.curCenterCoordinate, curCenterX = _b[0], curCenterY = _b[1];
            dx = -(curCenterX * (1 + scaleX));
            dy = -(curCenterY * (1 + scaleY));
        }
        else { //缩小得时候双击就放大
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
            if (this.curIsLongImg()) { // a long img dont need a horisontal offset
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
    /**
     *
     * @param imgWidth 图片宽度
     * @param imgHeight 图片高度
     * @returns  返回适配当前视口得图片宽高
     */
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
        this.positions = []; // 期望positions只保留一个底层的立方体，三个展示图片的面 共计六个面
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
                }
                this.imgs[i] = image;
                var naturalWidth = image.naturalWidth, naturalHeight = image.naturalHeight;
                if (image.loadError) { // a load wrong img
                    naturalWidth = naturalHeight = 200; // default size. here maybe 
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
        var _a = this.imgShape, naturalWidth = _a[0], naturalHeight = _a[1];
        return Math.abs(naturalWidth) * 2.5 < Math.abs(naturalHeight);
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
        /**
         * a position ,return this rect's coordinate like htmlElement.getBoundingClientRect()
         */
        get: function () {
            var topOriginX = -this.viewWidth / 2;
            var topOriginY = this.viewHeight / 2;
            var curPlaneIndex = this.curPointAt;
            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            // 点的位置会旋转的,旋转之后 再去用固定的坐标计算的时候你就把握不住
            //  so dynamic find the correct coordinate
            //  
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
        /**
         *    top      right
         *    bottom   bottomright
         */
        get: function () {
            var curPlaneIndex = this.curPointAt;
            return [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(webGl.prototype, "isEnlargement", {
        /**
         * should return a value that indicate whether the curViewRect over the viewPort's boundry
         */
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
        /**
         * should return curViewRect is enlarge or shrink compare with initialSize;
         */
        get: function () {
            ;
            var _a = this.imgShapeInitinal, iw = _a[0], ih = _a[1];
            var rect = this.viewRect;
            return rect.width * this.dpr > Math.abs(iw) || rect.height * this.dpr > Math.abs(ih);
        },
        enumerable: false,
        configurable: true
    });
    webGl.prototype.isLoadingError = function (index) {
        ;
        arguments.length == 0 && (index = this.curIndex);
        return this.imgs[index]['loadError']; // to do 定义错误图片样式
    };
    webGl.prototype.loadImage = function (src, index) {
        var _this = this;
        var img = new Image();
        img._id = this.imgId++;
        this.imgs[index] = img;
        var isHandled = false;
        img.onload = function () {
            if (isHandled) {
                return;
            }
            isHandled = true;
            _this.handleImgLoaded(img, index);
        };
        img.onerror = function () {
            if (isHandled) {
                return;
            }
            isHandled = true;
            img.loadError = true;
            _this.handleImgLoaded(img, index);
        };
        img.crossOrigin = 'anonymous';
        ;
        (img.src = src);
        return img;
    };
    webGl.prototype.handleImgLoaded = function (img, index) {
        if (~[-1, 0, 1].indexOf(index - this.curIndex)) {
            this.updatePosition(img, index - this.curIndex);
            this.bindPostion();
            this.drawPosition();
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
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
    };
    webGl.prototype.loadShader = function (gl, type, source) {
        var shader = gl.createShader(type);
        // Send the source to the shader object
        gl.shaderSource(shader, source);
        // Compile the shader program
        gl.compileShader(shader);
        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
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
        document.body.style.overflow = "hidden";
        canvas.width = window.innerWidth * this.dpr;
        canvas.height = window.innerHeight * this.dpr;
        this.ref = canvas;
        var gl = canvas.getContext('webgl', { antialias: true });
        if (!gl) {
            alert('webgl is not supported. please use before version.');
        }
        this.viewWidth = canvas.width;
        this.viewHeight = canvas.height;
        // gl.viewport(0,0,this.viewWidth,this.viewHeight)
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
