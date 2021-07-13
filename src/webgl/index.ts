
const sourceFrag = `precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler0;
uniform vec2 iResolution;
void main() {

    // vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
    vec4 color0 = texture2D(uSampler0, vTextureCoord) ;
    gl_FragColor = color0;
}`;
const sourceVer = `attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying mediump vec2 vTextureCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
}`;

import { matrix } from './matrix'
import { cubicBezier,linear,easeOut ,easeIn,easeInOut} from '../animation/animateJs'
import { events } from './eventSystem/index'
import {errImgBase64} from './static/index'
import {fps} from './tools/index'
import { showDebugger } from '../tools/index';

const easeOut1 = new cubicBezier(0.18, 0.96, 0.18, 0.96)

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

type webGlConstructorProps = {
    images: Array<string|HTMLImageElement>,
}
const forDev = 0

class webGl {

    viewWidth: number;
    viewHeight: number;

    dpr: number = window.devicePixelRatio || 1;
    gl: WebGLRenderingContext;
    ref: HTMLCanvasElement;
    shaderProgram: WebGLProgram;

    fieldOfViewInRadians = 0.1 * Math.PI
    zNear = 100.0;
    zFar = 10000.0;

    curIndex = 0;
    defaultAnimateTime = 300;
    indinces: Map<number,WebGLTexture> = new Map;
    initialModel: Array<number> = [
        1.0, 0, 0, 0,
        0, 1.0, 0, 0,
        0, 0, 1.0, 0,
        0, 0, 0, 1.0
    ]
    baseModel: Array<number> = [
        1.0, 0, 0, 0,
        0, 1.0, 0, 0,
        0, 0, 1.0, 0,
        0, 0, 0, 1.0
    ]
    modelMatrix: Array<number> = [
        1.0, 0, 0, 0,
        0, 1.0, 0, 0,
        0, 0, 1.0, 0,
        0, 0, 0, 1.0
    ];

    initialVertextes;
    positions: Array<number> = [];
    imgs: Array<image> = [];
    imgUrls: Array<string|image> = [];
    imgShape: Array<number> = [];//快速定位旋转之后图片的尺寸
    imgShapeInitinal: Array<number> = [];//快速定位旋转之后图片的尺寸
    textures: Map<number,WebGLTexture> = new Map;//贴图 保存图片贴图
    texturesOther: Map<number,WebGLTexture> = new Map // 保存背景色及其他贴图

    curPlane: Array<number> = []; // 动画执行前的当前面的位置信息

    eventsHanlder: events;

    isBoudriedSide: boolean = false //放大移动时 是否曾到达过边界 在移动放大得图片至超过边界后 恢复到最大边界位置后为true
    curAimateBreaked: boolean = false // 当前动画是否被打断

    imgId = 0;

    constructor({images,}:webGlConstructorProps) {

        fps()();

        this.gl = this.intialView();
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        
        this.imgUrls = images as Array<image>;
        const gl = this.gl;
      
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE) // anti-aliasing
        // gl.enable(gl.SAMPLE_COVERAGE) // anti-aliasing
        this.readyWebgl();
        this.initData();
        this.contextHandle();

        this.eventsHanlder = new events(this);
    }
    contextHandle(){
        const canvas = this.ref;
        canvas.addEventListener('webglcontextlost',(e)=>{
            this.textures.clear();
            this.texturesOther.clear();
            this.ref.parentNode.removeChild(this.ref)
        })
        canvas.addEventListener('webglcontextrestored',(e)=>{
            this.gl = this.intialView();
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
            
            const gl = this.gl;
            gl.enable(gl.DEPTH_TEST);           // Enable depth testing
            gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
            // gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE) // anti-aliasing
            // gl.enable(gl.SAMPLE_COVERAGE) // anti-aliasing
            this.readyWebgl();
            this.initData();
            this.contextHandle();
        })

    }
    readyWebgl(){
        this.shaderProgram = this.bindShader(this.gl, sourceFrag, sourceVer)
        
        const projectionMatrix = this.createPerspectiveMatrix();
        this.gl.useProgram(this.shaderProgram);
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
            false,
            projectionMatrix
        );
        
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
            false,
            this.modelMatrix
        );
        this.setTextureCordinate();
        this.initOtherTexture();
        
    }
    addImg(image: string | image , index: number){
        this.imgUrls.splice(index + 1,0,image);
        this.imgs.splice(index + 1, 0 ,null);
        if( image instanceof Image ){
            if( typeof image._id == 'undefined' ){
                image._id = this.imgId++;
            }
        }
        
        index -= this.curIndex;

        if( ~[-2,-1,0].indexOf(index) ){
            this.draw(this.curIndex)
        }
    }
    delImg(index:number){

        this.imgUrls.splice(index,1);
        this.imgs.splice(index, 1);
        this.textures.delete(this.imgs[index]._id);

        index -= this.curIndex;
        if( ~[-1,0,1].indexOf(index) ){
            this.draw(this.curIndex)
        }
    }
    initOtherTexture(){

        const gl = this.gl;
        const texture = gl.createTexture();
        // bgd of cubic
        this.texturesOther.set(0,texture);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //@ts-ignore
        texture.cubicBgd = true;
        const r = 0//Math.round( Math.random() * 255 )
        const g = 0//Math.round( Math.random() * 255 )
        const b = 0//Math.round( Math.random() * 255 )
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, 
            gl.UNSIGNED_BYTE,
                new Uint8Array([r, g, b, 255])
        );
        // err img
        const img = new Image() as image;
        img.onload = () => {
            // 200 200
            const textureErrImg = gl.createTexture();
            this.texturesOther.set(1,textureErrImg);
            gl.bindTexture(gl.TEXTURE_2D, textureErrImg);
            this.texImage(img)
            this.setTexParameteri(img.width,img.height)
        }
        img.src = errImgBase64;
        // document.body.append(img)
        
    }
    initData() {
        this.draw(this.curIndex)
    }
    
    slideNext(){
        this.rotate(0.5 * Math.PI)
    }
    // rotate around y axis
    rotate(end) {
        return this.animate({
            allTime: this.defaultAnimateTime,
            timingFun: linear,
            ends:[end],
            playGame: (() => {
                const play = this.rotatePosition.bind(this);
                return (curPos: number) => {
                    this.clear();
                    play(curPos);
                }

            })()
        })


    }
    // rotate around z axis
    rotateZ(deg){
        this.curPlane = this.positions.slice(this.curPointAt, this.curPointAt + 16)
        const curImgShape = this.imgShape;
        const curImgShapeInitinal = this.imgShapeInitinal;
        // 储存旋转位置变化信息
        this.imgShape = matrix.multiplyPoint(curImgShape,matrix.rotateZMatrix(deg))
        this.imgShapeInitinal = matrix.multiplyPoint(curImgShapeInitinal,matrix.rotateZMatrix(deg))
        // todo . every rotate should reCenter the img center
        const [curCenterX,curCenterY] = this.curCenterCoordinate;
        const dx = -curCenterX, dy = -curCenterY;
        const playGame = (...rest) => {
            this.transformCurplane(
                matrix.translateMatrix(rest[1],rest[2],0),
                matrix.rotateZMatrix(rest[0]),
            )
            this.bindPostion();
            this.drawPosition();
        }
        return this.animate({
            allTime: this.defaultAnimateTime,
            timingFun: linear,
            ends:[deg,dx,dy],
            playGame
        })
    }
    genPostion(width: number, height: number,index:number) {
        const z = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev;
        const viewWidth = this.viewWidth;
        
        let sideZAxis = z - ( viewWidth - width ) / 2;

        // console.log(z)
        const positionsMap = [
            [// left
                -viewWidth / 2, -height / 2, sideZAxis-width, 1.0,
                -viewWidth / 2, -height / 2, sideZAxis, 1.0,
                -viewWidth / 2, height / 2, sideZAxis, 1.0,
                -viewWidth / 2, height / 2, sideZAxis-width, 1.0,
            ],
            [//fornt
                -width / 2, -height / 2, z, 1.0,
                width / 2, -height / 2, z, 1.0,
                width / 2, height / 2, z, 1.0,
                -width / 2, height / 2, z, 1.0,
            ],
            [// right
                viewWidth / 2, -height / 2, sideZAxis, 1.0,
                viewWidth / 2, -height / 2, sideZAxis-width, 1.0,
                viewWidth / 2, height / 2, sideZAxis-width, 1.0,
                viewWidth / 2, height / 2, sideZAxis, 1.0,
            ]
        ]
        let key = index - this.curIndex; // -1 , 0 , 1;
        key  += 1; // -1,0,1 -> 0,1,2
        // 可以优化为插入
        this.positions.push( ...positionsMap[key] )
    }
    /**
     * 图片异步加载之后更新顶点坐标位置。
     * @param index 相对于 curIndex 的位置 -1,0,1
     */
    updatePosition(img:image,index){
        const z = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev;
        const viewWidth = this.viewWidth;
        
        let { naturalWidth, naturalHeight } = img;
        if( img.loadError ){
            naturalWidth = naturalHeight = 200;
        }
        let [width,height] = this.decideImgViewSize(naturalWidth * this.dpr,naturalHeight * this.dpr)

        if( index == 0 ){
            this.imgShape = [ naturalWidth*this.dpr, naturalHeight * this.dpr, 0, 1 ];
            this.imgShapeInitinal = [width,height,0,1]
        }
        let sideZAxis = z - ( viewWidth - width ) / 2;

        // console.log(z)
        const positionsMap = [
            [// left
                -viewWidth / 2, -height / 2, sideZAxis-width, 1.0,
                -viewWidth / 2, -height / 2, sideZAxis, 1.0,
                -viewWidth / 2, height / 2, sideZAxis, 1.0,
                -viewWidth / 2, height / 2, sideZAxis-width, 1.0,
            ],
            [//fornt
                -width / 2, -height / 2, z, 1.0,
                width / 2, -height / 2, z, 1.0,
                width / 2, height / 2, z, 1.0,
                -width / 2, height / 2, z, 1.0,
            ],
            [// right
                viewWidth / 2, -height / 2, sideZAxis, 1.0,
                viewWidth / 2, -height / 2, sideZAxis-width, 1.0,
                viewWidth / 2, height / 2, sideZAxis-width, 1.0,
                viewWidth / 2, height / 2, sideZAxis, 1.0,
            ]
        ]
        let key = index;
        let indexInPosition = this.curPointAt + key * 16;

        key  += 1; // -1,0,1 -> 0,1,2;

        let curPlane = positionsMap[key];
        for( let i = indexInPosition ; i < indexInPosition + 16; i++ ){
            this.positions[i] = curPlane[i-indexInPosition]
        }
    }
    bindPostion(){
        const gl = this.gl;
        const positions = this.positions;
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            const aVerLocate = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
            gl.vertexAttribPointer(
                aVerLocate,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(aVerLocate);
        }
    }
    drawPosition(){
        // 生成黑色立方体作为背景
        this.clear();
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.texturesOther.get(0));
        for( let i = 0, L = 12 ; i < L ; i += 4 ){
            this.bindIndex(i)
        }
        // 生成 真真的 图片
        let faces = (this.positions.length / 4 - 12) / 4;
        let textureIndex = ( this.curIndex - 1); 
        ;( textureIndex < 0 ) && (textureIndex = 0);
        for( let i = 0; i < faces ; i++ ,textureIndex++ ){
            const img = this.imgs[textureIndex];
            if(img){
                this.bindTexture(img,img._id);
            }else{
                // loading
                console.log(`shouldn't have`)
            }
            this.bindIndex( 12 + i*4 )
        }
        // console.log('\n')

        // console.log( this.positions )
    }
    rotatePosition(deg:number){
        const zInitial = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev;
        const centerX = this.viewWidth / 2;
        this.modelMatrix = matrix.multiplyMatrices(
            this.baseModel,
            matrix.translateMatrix(0,0,centerX - zInitial),// 挪到坐标原点
            matrix.rotateYMatrix(deg), //开始旋转
            matrix.translateMatrix(0,0,zInitial-(centerX )) // 挪到原位置
        )
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
            false,
            this.modelMatrix
        );
        this.drawPosition();
    }
    scaleZPosition({
        scaleX,
        scaleY,
        dx,
        dy
    }:{
        scaleX:number,
        scaleY:number,
        dx:number,
        dy:number,
    }){
        this.curPlane = this.positions.slice(this.curPointAt, this.curPointAt + 16)
        const playGame = (...rest) => {
            rest[0] += 1;
            rest[1] += 1;
            this.transformCurplane(
                matrix.scaleMatrix(rest[0],rest[1],1),
                matrix.translateMatrix(rest[2],rest[3],0)
            )
            this.bindPostion();
            this.drawPosition();
        }
        return this.animate({
            allTime: this.defaultAnimateTime,
            timingFun: linear,
            ends:[scaleX,scaleY,dx,dy],
            playGame
        })
    }
    moveCurPlane(x: number, y: number, z: number) {
        let dx = x;
        let dy = y;
        this.curPlane = this.positions.slice(this.curPointAt, this.curPointAt + 16)
        const playGame = (...rest) => {
            this.transformCurplane(
                matrix.translateMatrix(rest[0],rest[1],0)
            )
            this.bindPostion();
            this.drawPosition();
        }
        return this.animate({
            allTime: 800 ,//this.defaultAnimateTime,
            timingFun: easeOut1,
            ends:[dx,dy],
            playGame
        })
    }
    transformCurplane(a,...matrixes){;
        const positions  = this.positions
        const curPlane = this.curPlane;
        for( let i = this.curPointAt ; i < this.curPointAt + 16; i += 4){
            let planeIndex = i - this.curPointAt;
            let x = curPlane[planeIndex] , y = curPlane[planeIndex+1], z = curPlane[ planeIndex + 2], w = curPlane[planeIndex+3];
            const newPoint = matrix.multiplyPoint( 
                [x,y,z,w],
                a,
                ...matrixes
            );
            for( let j = i ; j < 4 + i; j++ ){
                positions[j] = newPoint[j-i]
            }
        }
    }
    zoomCurPlan(sx,sy,dx,dy){
        this.curPlane = this.positions.slice(this.curPointAt, this.curPointAt + 16)
        this.transformCurplane(
            matrix.scaleMatrix(sx,sy,1),
            matrix.translateMatrix(dx,dy,0),
        )
        this.bindPostion(); 
        this.drawPosition();
    }
    setTextureCordinate(){
        const gl = this.gl;

        const textureCoordBuffer = this.gl.createBuffer();
        gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            //  right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0, // 贴图纹理坐标始终是不变的 从左下角开始依次逆时针是 0 0  ，1 0 ，1 1 ，0 1  具体对应的时候 找到矩形的第一个点  然后和矩形的顺序一样逆时针贴图  一一对应上就好 
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
            0.0, 1.0, // 贴图纹理坐标始终是不变的 从左下角开始依次逆时针是 0 0  ，1 0 ，1 1 ，0 1  具体对应的时候 找到矩形的第一个点  然后和矩形的顺序一样逆时针贴图  一一对应上就好 
            // left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,

        ];

        gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.gl.STATIC_DRAW);
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
            const textureLocate = gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
            gl.vertexAttribPointer(
                textureLocate,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(textureLocate);
        }

        // Bind the texture to texture unit 0
        gl.activeTexture(gl['TEXTURE0']);
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, 'uSampler0'), 0);
    }
    bindTexture(image: image,id:number) {;

        if(image.loadError){
            this.updateOtherTexture(1);
            return;
        }
      
        if( !image.complete ){//loading ing
            this.updateOtherTexture(0);
            return;
        }
       
        if(this.textures.get(id)){ // 该图片已经创建过贴图 直接拿来复用
            this.updateTexture(id,image)
            return;
        }
        const gl = this.gl;
        
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.textures.set(id,texture);

        this.texImage(image)
        this.setTexParameteri(image.width,image.height)
    }
    updateTexture(id:number,image: image){
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D,this.textures.get(id));
        this.setTexParameteri(image.width,image.height)
    }
    updateOtherTexture(id:number){
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D,this.texturesOther.get(id));
        this.setTexParameteri(0,3)// default
    }
    texImage(image:image){
        const gl = this.gl;
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;

        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    }
    setTexParameteri(width:number,height:number){
        const gl = this.gl;
        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(width) && isPowerOf2(height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);//gl.LINEAR_MIPMAP_LINE
        }
    }
    bindIndex(index: number) {;
        const gl = this.gl;
        const indices = [
            index, index + 1, index + 2, 
            index, index + 2, index + 3,
        ];
        const drawType = gl.TRIANGLES;
        if( this.indinces.has(index) ){
            const indexBuffer = this.indinces.get(index);
            {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                const vertexCount = indices.length;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(drawType, vertexCount, type, offset);
                // gl.drawArrays(gl.TRIANGLES,index,vertexCount)
            }
            return;
        }

        const indexBuffer = this.gl.createBuffer();
        this.indinces[index] = indexBuffer;

        gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        
        // console.log(indices)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            const vertexCount = indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(drawType, vertexCount, type, offset);
            // gl.drawArrays(gl.TRIANGLES,index,vertexCount)
        }
    }
    generateCube(width: number, height: number,){
        const cubeMove = 0.1; 
        width = this.viewWidth;
        height = this.viewHeight
        const z = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev - cubeMove
        width -= cubeMove
        height -= cubeMove;
        const positionCube = [
            // left
                -width / 2, -height / 2, z-width, 1.0,
                -width / 2, -height / 2, z, 1.0,
                -width / 2, height / 2, z, 1.0,
                -width / 2, height / 2, z-width, 1.0,
            //front
                -width / 2, -height / 2, z, 1.0,
                width / 2, -height / 2, z, 1.0,
                width / 2, height / 2, z, 1.0,
                -width / 2, height / 2, z, 1.0,
            // right
                width / 2, -height / 2, z, 1.0,
                width / 2, -height / 2, z-width, 1.0,
                width / 2, height / 2, z-width, 1.0,
                width / 2, height / 2, z, 1.0,
        ]
        this.positions.splice(0,0,...positionCube);

    }
    /**
     * @param clientX 缩放点得x坐标
     * @param clientY 缩放点得y坐标
     * @returns [缩放x比率,缩放y比率,x轴偏移 y轴偏移]
     */
    decideScaleRatio( clientX: number, clientY: number ) {
        let width = 0, height = 0;

        const centerX: number = this.viewWidth / (2);
        const centerY: number = this.viewHeight / (2);

        const rect = this.viewRect;
        const curWidth =  rect.width * this.dpr;
        const curHeight = rect.height * this.dpr;

        const curImgShape = this.imgShape;
        let [nw,nh] = curImgShape;
        nw = Math.abs(nw);
        nh = Math.abs(nh);

        let scaleX, scaleY,dx = 0,dy = 0;

        clientX *= this.dpr;
        clientY *= this.dpr;
        if( this.isEnlargementForScale ){// 放大双击得时候就缩小
            let [initialWidth,initinalHeight] = this.imgShapeInitinal
            width = Math.abs(initialWidth);
            height = Math.abs(initinalHeight)

            // eg. if ratio is 0.2 then result is -0.8 ,during animate  it becomes 1 0.9 .0.8 
            scaleX = width / curWidth - 1;
            scaleY = height / curHeight - 1;
            //  it's should be the offset of the img's center Point
            //  this coordinate center is 0 , 0  on the center of screen
            const [curCenterX,curCenterY] = this.curCenterCoordinate;

            dx = -(curCenterX * ( 1 + scaleX ) );
            dy = -(curCenterY * ( 1 + scaleY ) )

        }else{//缩小得时候双击就放大
            if( this.curIsLongImg() ){
                width = this.viewWidth;
                height = nh/nw * width;
            }else{
                width = nw;
                height = nh;
            }
            scaleX = width / curWidth - 1;
            scaleY = height / curHeight - 1;

            
            dx = -((clientX - centerX) * (scaleX));
            dy = ((clientY  - centerY) * (scaleY));

            if( this.curIsLongImg()){// a long img dont need a horisontal offset
                dx = 0
            }

        }
        
        return [
            scaleX,
            scaleY,
            dx,
            dy
        ]

    }
    /**
     * 
     * @param imgWidth 图片宽度
     * @param imgHeight 图片高度
     * @returns  返回适配当前视口得图片宽高
     */
    decideImgViewSize(imgWidth,imgHeight){

        let width = 0, height = 0;
        
        if( this.viewWidth >= imgWidth ){
            width = imgWidth;
        }else{
            width = this.viewWidth
        }

        height = imgHeight / imgWidth * width;
        if( height > this.viewHeight ){
            height = this.viewHeight;
            width = height * imgWidth / imgHeight
        }
        return [
            width,
            height
        ]
    }
    draw( index: number) {
        this.positions = [];// 期望positions只保留一个底层的立方体，三个展示图片的面 共计六个面
        const imgLength = this.imgUrls.length;
        let maxWidth = 0,maxHeight = 0;
        for( let i = index - 1; i <= index + 1; i++ ){
            if( i !== -1 && i <= imgLength - 1 ){
                let image:image;
                if( this.imgs[i] ){
                    image = this.imgs[i]
                }else if( typeof this.imgUrls[i] == 'string' ){
                    image = this.loadImage(this.imgUrls[i] as string,i);
                }else{
                    image = this.imgUrls[i] as image;
                }
                this.imgs[i] = image;
                let { naturalWidth, naturalHeight } = image;

                if( image.loadError){// a load wrong img
                    naturalWidth = naturalHeight = 200; // default size. here maybe 
                }
                let [width,height] = this.decideImgViewSize(naturalWidth * this.dpr,naturalHeight * this.dpr)
                
                if( i == this.curIndex ){
                    this.imgShape = [ naturalWidth*this.dpr, naturalHeight * this.dpr, 0, 1 ];
                    this.imgShapeInitinal = [width,height,0,1]
                }
                this.genPostion(width, height,i);
                maxWidth = Math.max(width,maxWidth)
                maxHeight = Math.max(height,maxHeight)
            }
        }
        this.generateCube(maxWidth,maxHeight);
        this.bindPostion();
        this.drawPosition();
    }
    createPerspectiveMatrix() {
        const fieldOfViewInRadians = this.fieldOfViewInRadians;
        const aspectRatio = this.viewWidth / this.viewHeight;
        const near = this.zNear;
        const far = this.zFar;

        const f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
        const rangeInv = 1 / (near - far);

        return [
            f / aspectRatio, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    }
    get curPointAt(){
        let curPointAt = (4) * 16;
        if( this.curIndex == 0 ){
            curPointAt = 3 * 16;
        }
        return curPointAt;
    }
    get IsBoundaryLeft(){
        const rect = this.viewRect;
        return Math.round(rect.left) >= 0 && this.isBoudriedSide;
    }
    get isBoundaryRight(){
        const rect = this.viewRect;
        return Math.round(rect.right * this.dpr) <= Math.round(((this.viewWidth / 1))) && this.isBoudriedSide;
    }
    curIsLongImg(){
        const [naturalWidth,naturalHeight] = this.imgShape;
        return Math.abs(naturalWidth) * 2.5 < Math.abs(naturalHeight);
    }
    get curCenterCoordinate(){
        const curPlaneIndex = this.curPointAt;
        const curCenterX = (this.positions[curPlaneIndex] + this.positions[curPlaneIndex + 8 ]) / 2;
        const curCenterY = (this.positions[curPlaneIndex + 1] + this.positions[curPlaneIndex + 9 ]) / 2;
        return [
            curCenterX,
            curCenterY
        ]
    }
    /**
     * a position ,return this rect's coordinate like htmlElement.getBoundingClientRect()
     */
    get viewRect(){

        const topOriginX = -this.viewWidth / 2;
        const topOriginY = this.viewHeight / 2;

        const curPlaneIndex = this.curPointAt;

        let minX = Infinity, maxX = -Infinity,
            minY = Infinity, maxY = -Infinity;
        // 点的位置会旋转的,旋转之后 再去用固定的坐标计算的时候你就把握不住
        //  so dynamic find the correct coordinate
        //  
        for( let i = curPlaneIndex ; i < curPlaneIndex + 16; i += 4 ){
            let x = this.positions[i];
            let y = this.positions[i+1];
            minX = Math.min(x,minX)
            maxX = Math.max(x,maxX)
            minY = Math.min(y,minY)
            maxY = Math.max(y,maxY)
        }

        const width = Math.abs(minX - maxX );
        const height =  Math.abs(minY - maxY);
      
        return{
            left: (minX - topOriginX) / this.dpr,
            right: (maxX - topOriginX) / this.dpr,
            width: width / this.dpr,
            height: height / this.dpr,
            top: -(maxY - topOriginY) / this.dpr,
            bottom:-(minY - topOriginY) / this.dpr,
        }
    }
    /**
     *    top      right
     *    bottom   bottomright
     */
    get curPlanePosition(){

        const curPlaneIndex = this.curPointAt;

        return [

        ]
    }
    /**
     * should return a value that indicate whether the curViewRect over the viewPort's boundry
     */
    get isEnlargement(){
        const [iw,ih] = this.imgShapeInitinal
        const viewRect = this.viewRect;
        
        return (
            viewRect.width * this.dpr - 1 > this.viewWidth
                ||
            viewRect.height * this.dpr - 1 > this.viewHeight
        )

    }
    /**
     * should return curViewRect is enlarge or shrink compare with initialSize;
     */
    get isEnlargementForScale(){;
        const [iw,ih] = this.imgShapeInitinal;
        const rect = this.viewRect;
        return rect.width * this.dpr > Math.abs(iw) || rect.height * this.dpr > Math.abs(ih);
    }
    isLoadingError(index?:number ){
        ;arguments.length == 0 && ( index = this.curIndex );
        return this.imgs[index]['loadError'] // to do 定义错误图片样式
    }
    loadImage(src: string,index:number){
        const img = new Image() as image;
        img._id = this.imgId++;
        this.imgs[index] = img;
        let isHandled = false;
        img.onload = () => {
            if( isHandled ){
                return;
            }
            isHandled = true;
            this.handleImgLoaded(img,index);
        }
        img.onerror = () => {
            if( isHandled ){
                return;
            }
            isHandled = true;
            img.loadError = true;
            this.handleImgLoaded(img,index);
        }
        img.crossOrigin='anonymous';
        ;(img.src = src);
        return img;
    }
    handleImgLoaded(img:image,index:number){
        if( ~[-1,0,1].indexOf(index - this.curIndex) ){
            this.updatePosition(img,index - this.curIndex)
            this.bindPostion();
            this.drawPosition();
        }
    }
    clear() {
        const gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  
        gl.clearDepth(1.0);                 
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    bindShader(gl: WebGLRenderingContext, sourceFrag, sourceVer) {

        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, sourceVer);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, sourceFrag);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }
    loadShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type);
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
    }
    createPlane({ x, y, width, height }: createPlaneParam) {
        return {

        }
    }
    intialView() {
        const canvas = document.createElement('canvas')
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left:0;
            z-index: 9;
            width:${window.innerWidth}px;
            height:${window.innerHeight}px;
            user-select:none;
            font-size:0;
        `;
        document.body.style.overflow="hidden"
        canvas.width = window.innerWidth * this.dpr;
        canvas.height = window.innerHeight * this.dpr;
        this.ref = canvas;
        const gl = canvas.getContext('webgl',{ antialias:true })
        if (!gl) {
            alert('webgl is not supported. please use before version.')
        }

        this.viewWidth = canvas.width;
        this.viewHeight = canvas.height;

        // gl.viewport(0,0,this.viewWidth,this.viewHeight)

        return gl;
    }
    
    animate({
        allTime,
        timingFun,
        ends,
        playGame,
        callback
    }:{
        allTime:number,
        timingFun: cubicBezier,
        ends: Array< number >,
        playGame: Function
        callback?: Function
    }){
        const startTime = Date.now();
        let curTime = startTime;
        let resolve;
        const pro = new Promise( res => (resolve = res) )
        const eL = ends.length;

        const run = () => {

            if( this.curAimateBreaked ){
                resolve([false,3]);
                this.curAimateBreaked = false;
                return;
            }
            let offsetT = curTime - startTime;
            ;offsetT > allTime && ( offsetT = allTime );
            let curX = (offsetT) / allTime ;
            curX > 1 && ( curX = 1 )
            let curEnd = timingFun.solve( curX )
            if( curEnd >= 1 ){
                curEnd = 1;
            }
            const ans = new Array(eL)
            ends.forEach((end,index) => {
                ans[index] = end * curEnd;
            })
            playGame( ...ans );
        
            if( curX < 1 ){
                requestAnimationFrame(run)
            }else{
                callback && callback();
                resolve([false,1])
            }
            curTime = Date.now();
        }
        run();

        return pro
    }
}



export { webGl };