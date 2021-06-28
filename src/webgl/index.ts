import { sourceFrag } from './shaders/fragment-shader.frag'
import { sourceVer } from './shaders/vertext-shader.vert';
import { matrix } from './matrix'
import { cubicBezier,linear,easeOut } from '../animation/animateJs'
import { events } from './eventSystem/index'
import {fps} from './tools/index'

const easyOut1 = new cubicBezier({x:0, y:0}, {x:0, y:0.93})

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

type webGlConstructorProps = {
    images: Array<string>,
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
    modelMatrixes: Array<number> = [];
    textures: Map<number,WebGLTexture> = new Map;
    indinces: Map<number,WebGLTexture> = new Map;
    initialModel: Array<number> = [
        1.0, 0, 0, 0,
        0, 1.0, 0, 0,
        0, 0, 1.0, 0,
        0, 0, 0, 1.0
    ]

    initialVertextes;
    positions: Array<number> = [];
    imgs: Array<HTMLImageElement> = [];
    imgUrls: Array<string> = [];
    imgShape: Array<Array<number>> = [];//快速定位旋转之后图片的尺寸
    curPlane: Array<number> = []; // 动画执行前的当前面的位置信息

    eventsHanlder: events;

    constructor({images,}:webGlConstructorProps) {

        fps()();

        this.gl = this.intialView();
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.shaderProgram = this.bindShader(this.gl, sourceFrag, sourceVer)
        
        const projectionMatrix = this.createPerspectiveMatrix();
        this.gl.useProgram(this.shaderProgram);
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
            false,
            projectionMatrix
        );
        const modelViewMatrix = [
            1.0, 0, 0, 0,
            0, 1.0, 0, 0,
            0, 0, 1.0, 0,
            0, 0, 0, 1.0
        ]
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
            false,
            modelViewMatrix
        );

        this.gl.uniform4fv(
            this.gl.getUniformLocation(this.shaderProgram,'bgdColor'), 
            new Float32Array([0, 0, 0, 0.1])
        );
        
        this.imgUrls = images;
        const gl = this.gl;
      

        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE) // anti-aliasing
        // gl.enable(gl.SAMPLE_COVERAGE) // anti-aliasing

        this.setTextureCordinate();
        this.initData();
        
        this.eventsHanlder = new events(this);
        this.initEvent();
    }
    initEvent(){
        
        let z = (this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2));

        (z > this.zFar) && (z = this.zFar)
        
        let deg = 0;

        let beginMove = false;
        let startX = 0;
        let startY = 0;
        let degX = 0;

        let beginMoveX = 0;
      
        this.gl.canvas.addEventListener('click', (e) => {
            // this.slideNext();
        })
        this.gl.canvas.addEventListener('touchstart', (e: TouchEvent) => {
            beginMove = true;
            beginMoveX = startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        })
     
        this.gl.canvas.addEventListener('touchend', async (e:TouchEvent) => {
            return;
            beginMove = false;
            let offsetX = (e.changedTouches[0].clientX - beginMoveX) / this.dpr;
            
        })
    }

    initData() {
        this.draw(this.curIndex)
    }
    // place a substitute by subterfuge
    placeAsubstituteBySubterfuge(){

    }
    slideNext(){
        this.rotate(0.5 * Math.PI)
    }
    rotate(end) {
        return this.animate({
            allTime: this.defaultAnimateTime,
            timingFun: linear,
            ends:[end],
            playGame: (() => {
                /**
                 矩阵旋转乘法时是累加的。因此直接通过timingFun计算出的结果直接应用的话最后的结果是个若
                 干个某数列元素的和 所以需要前后值的差值来按步进行动画
                 * 
                 */
                let beforePos = 0;
                const play = this.rotatePosition.bind(this);
                return (curPos: number) => {
                    this.clear();
                    let step = curPos - beforePos;
                    play(step);
                    this.bindPostion();
                    this.drawPosition();
                    beforePos = curPos;
                }

            })()
        })


    }

    genPostion(width: number, height: number,index:number) {
        const gl = this.gl;
        const z = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev;
        const viewWidth = this.viewWidth;
        const viewHeight = this.viewHeight;
        
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
        this.positions.push( ...positionsMap[key] )
    }
    bindPostion(){
        const gl = this.gl;
        const positions = this.positions;
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.DYNAMIC_DRAW);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
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
        this.bindTexture(null,0);
        for( let i = 0, L = 12 ; i < L ; i += 4 ){
            this.bindIndex(i)
        }
        // 生成 真真的 图片
        let faces = (this.positions.length / 4 - 12) / 4;
        let textureIndex = (this.curIndex - 1);
        ;( textureIndex == -1 ) && (textureIndex = 0 );
        for( let i = 0; i < faces ; i++ ,textureIndex++ ){
            {;
                // console.log(1 + textureIndex)
                const img = this.imgs[textureIndex];
                this.bindTexture(img,1 + textureIndex);
                this.bindIndex( 12 + i*4 )
            }
        }
        // console.log('\n')

        // console.log( this.positions )
    }
    rotatePosition(deg:number){
        const gl = this.gl;
        const zInitial = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev;
        const centerX = this.viewWidth / 2;
        const positions = this.positions;
        for( let i = 0 , L = positions.length; i < L; i += 4){
            let x = positions[i] , y = positions[i+1], z = positions[ i + 2], w = positions[i+3];
            const newPoint = matrix.multiplyPoint( 
                [x,y,z,w],
                matrix.translateMatrix(0,0,centerX - zInitial),// 挪到坐标原点
                matrix.rotateYMatrix(deg), //开始旋转
                matrix.translateMatrix(0,0,zInitial-(centerX )) // 挪到原位置
            );
            for( let j = i ; j < 4 + i; j++ ){
                positions[j] = newPoint[j-i]
            }
        }
        // console.log(positions)
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
            allTime: this.defaultAnimateTime,
            timingFun: easyOut1,
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
    bindTexture(image: HTMLImageElement,index:number) {;
        if(this.textures.has(index)){ // 该图片已经创建过贴图 直接拿来复用
            this.updateTexture(index)
            return;
        }
        const gl = this.gl;
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const texture = gl.createTexture();
        
        this.textures.set(index,texture);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        if( image == null ){//front面的黑色的底面
            return;
        }
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        {
            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
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
        
        // gl.bindTexture(gl.TEXTURE_2D, null);
    }
    updateTexture(index:number){
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D,this.textures.get(index))
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
    decideScaleRatio(cw: number, ch: number, nw: number, nh: number) {
        const [initialW,initialH] = this.decideImgViewSize(nw,nh);


    }
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
    async draw( index: number) {
        this.positions = [];// 期望positions只保留一个底层的立方体，三个展示图片的面 共计六个面
        const imgLength = this.imgUrls.length;
        let maxWidth = 0,maxHeight = 0;
        for( let i = index - 1; i <= index + 1; i++ ){
            if( i !== -1 && i <= imgLength - 1 ){
                {   
                    const [err, img] = await this.loadImage(this.imgUrls[i])

                    this.imgs[i] = img;

                    const { naturalWidth, naturalHeight } = img;
                    let [width,height] = this.decideImgViewSize(naturalWidth * this.dpr,naturalHeight * this.dpr)
                    this.imgShape[i] = [ naturalWidth*this.dpr, naturalHeight * this.dpr, 0, 1 ]
                    this.genPostion(width, height,i);
                    maxWidth = Math.max(width,maxWidth)
                    maxHeight = Math.max(height,maxHeight)

                }
            }
        }
        this.generateCube(maxWidth,maxHeight);

        this.bindPostion();
        this.drawPosition();
    }
    handleMove(e: TouchEvent & MouseEvent){

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
        return rect.left >= 0;
    }
    get isBoundaryRight(){
        const rect = this.viewRect;
        return rect.right <= this.viewWidth / 2;
    }
    get viewRect(){

        const topOriginX = -this.viewWidth / 2;
        const topOriginY = this.viewHeight / 2;

        const curPlaneIndex = this.curPointAt;

        const bottomLeftPlanX = this.positions[curPlaneIndex];
        const bottomLeftPlaneY = this.positions[curPlaneIndex + 1];

        const topLeftPlaneX = this.positions[curPlaneIndex + 12];
        const topLeftPlaneY = this.positions[curPlaneIndex + 13];

        const bottomRightPlaneX = this.positions[curPlaneIndex + 4]
        const bottomRightPlaneY = this.positions[curPlaneIndex + 5]

        const topRightPlaneX = this.positions[curPlaneIndex + 8]
        const topRightPlaneY = this.positions[curPlaneIndex + 9]


        return{
            left: (topLeftPlaneX - topOriginX) / this.dpr,
            right: (topRightPlaneX - topOriginX) / this.dpr,
            width: Math.abs(topLeftPlaneX - topRightPlaneX ) / this.dpr,
            height: Math.abs( bottomRightPlaneY - topRightPlaneY ) / this.dpr,
            top: -(topLeftPlaneY - topOriginY) / this.dpr,
            bottom:-(bottomRightPlaneY - topOriginY) / this.dpr,
        }
    }
    get isEnlargement(){
        const {naturalWidth,naturalHeight} = this.imgs[this.curIndex]
        const [initialWidth, intinalHeight] = this.decideImgViewSize(naturalWidth*this.dpr,naturalHeight*this.dpr)
        const rect = this.viewRect;

        return rect.width > initialWidth || rect.height > intinalHeight;
    }
    isLoadingError(index?:number ){
        ;arguments.length == 0 && ( index = this.curIndex );
        return !this.imgs[index] // to do 定义错误图片样式及数据结构
    }
   
    loadImage(src: string): Promise<[boolean, HTMLImageElement]> {
        return new Promise((res) => {
            const img = new Image()
            img.onload = () => {
                res([false, img])
            }
            img.onerror = () => {
                res([true, img])
            }
            img.src = src;
            if( img.complete ){
                res([false, img]);
            }
        })
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
            position: fixed;
            top: 0;
            left:0;
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
        const startTime = new Date().getTime();
        let curTime = startTime;
        let resolve;
        const pro = new Promise( res => (resolve = res) )
        const eL = ends.length;

        function run(){
            let curT = (curTime - startTime) / allTime ;

            curT > 1 && ( curT == 1 )
            let curEnd = timingFun.solve( curT )
            if( curEnd >= 1 ){
                curEnd = 1;
            }
            const ans = new Array(eL)
            ends.forEach((end,index) => {
                ans[index] = end * curEnd;
            })
            playGame( ...ans );
        
            if( curT <= 1 ){
                requestAnimationFrame(run)
            }else{
                callback && callback();
                resolve([false,1])
            }
            curTime = new Date().getTime();
        }
        run();

        return pro
    }
}



export { webGl };