import { sourceFrag } from './shaders/fragment-shader.frag'
import { sourceVer } from './shaders/vertext-shader.vert';
import { matrix } from './matrix'
import { cubicBezier,linear } from '../animation/animateJs'

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}
const forDev = 4000


class webGl {

    viewWidth: number;
    viewHeight: number;
    dpr: number = window.devicePixelRatio || 1;
    gl: WebGLRenderingContext;
    shaderProgram: WebGLProgram;
    fieldOfViewInRadians = 0.1 * Math.PI
    zNear = 100.0;
    zFar = 10000.0;
    curIndex = 0;
    defaultAnimateTime = 300;
    modelMatrixes: Array<number> = [];
    textures: Array<WebGLTexture> = [];
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
    constructor(images: Array<string>) {
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
        this.setTextureCordinate();
        this.initData();

        this.initEvent();
    }
    initEvent(){
        
        let z = (this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2));

        (z > this.zFar) && (z = this.zFar)
        
        let deg = Math.PI / 20;

        let beginMove = false;
        let startX = 0;
        let startY = 0;
        let degX = 0;
        this.gl.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            beginMove = true;
            startX = e.clientX;
            startY = e.clientY;

            // this.slideNext();
        })
        const handleMove = (e: MouseEvent) =>{
            if (beginMove) {
                let offset = (e.clientX - startX) / this.dpr;
                let offsetX = (e.clientY - startY) / this.dpr;
                deg = -offset * 0.01;
                degX = -offsetX * 0.01;

                startX = e.clientX;
                startY = e.clientY;
                this.clear();

                this.rotatePosition(deg);
                this.bindPostion();

                const index = this.curIndex;
                const imgLength = this.imgs.length;
                for( let i = index - 1; i <= index + 1; i++ ){
                    if( i !== -1 && i !== imgLength ){
                        {   
                            const img = this.imgs[i]
                            this.updateTexture(i);
                            this.bindIndex(i*4)
                        }
                    }
                }
            }
        }
        this.gl.canvas.addEventListener('mousemove',handleMove )
        this.gl.canvas.addEventListener('mouseup', (e) => {
            beginMove = false;
        })
        this.gl.canvas.addEventListener('click', (e) => {
            this.slideNext();
        })
        this.gl.canvas.addEventListener('touchstart', (e: TouchEvent) => {
            beginMove = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        })
        this.gl.canvas.addEventListener('touchmove', (e: TouchEvent) => {
            if (beginMove) {
                this.clear();
                let offset = (e.touches[0].clientX - startX) / this.dpr;
                let offsetX = (e.touches[0].clientY - startY) / this.dpr;
                deg = -offset * 0.01;
                degX = -offsetX * 0.01;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY ;
                this.rotatePosition(deg);
                this.bindPostion();

                const index = this.curIndex;
                const imgLength = this.imgs.length;
                for( let i = index - 1; i <= index + 1; i++ ){
                    if( i !== -1 && i !== imgLength ){
                        {   
                            const img = this.imgs[i]
                            this.updateTexture(i);
                            this.bindIndex(i*4)
                        }
                    }
                }

            }
        })
        this.gl.canvas.addEventListener('touchend', (e) => {
            beginMove = false;
        })
    }
    initData() {
        this.drawIndex(this.curIndex)
    }
    // place a substitute by subterfuge
    placeAsubstituteBySubterfuge(){

    }
    slideNext(){
        this.rotate(0.5 * Math.PI)
    }
    rotate(end){
        this.animate({
            allTime: this.defaultAnimateTime,
            timingFun: linear,
            end,
            playGame: (() => {
                /**
                 矩阵旋转乘法时是累加的。因此直接通过timingFun计算出的结果直接应用的话最后的结果是个若
                 干个某数列元素的和 所以需要前后值的差值来按步进行动画
                 * 
                 */
                let beforePos = 0; 
                const play = this.rotatePosition.bind(this);
                return (curPos:number) => {
                    this.clear();
                    let step = curPos - beforePos;
                    play(step);
                    this.bindPostion();
                    const index = this.curIndex;
                    const imgLength = this.imgs.length;
                    for( let i = index - 1; i <= index + 1; i++ ){
                        if( i !== -1 && i !== imgLength ){
                            {   
                                const img = this.imgs[i]
                                this.updateTexture(i);
                                this.bindIndex(i*4)
                            }
                        }
                    }
                    beforePos = curPos;
                }
                
            })()
        })
    }

    async drawIndex(index: number) {
        this.draw( index) ;
    }
    genPostion(width: number, height: number,index:number) {
        if( this.positions[index * 16 ]  ){ // 顶点数据已经有缓存到该数据了 则无需再次初始化咯
            return;
        }

        
        const gl = this.gl;
        const z = -(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2)) - forDev

        if( index == this.curIndex ){
            // front 面加入一个黑色的底层
            let width = this.viewWidth;
            let height = this.viewHeight;
            this.positions.push(...[
                -width / 2, -height / 2, z, 1.0,
                width / 2, -height / 2, z, 1.0,
                width / 2, height / 2, z, 1.0,
                -width / 2, height / 2, z, 1.0,
            ])
            this.imgs.splice(index - 1,null)
        }
        // console.log(z)
        const positionsMap = [
            [// left
                -width / 2, -height / 2, z-width, 1.0,
                -width / 2, -height / 2, z, 1.0,
                -width / 2, height / 2, z, 1.0,
                -width / 2, height / 2, z-width, 1.0,
            ],
            [//fornt
                -width / 2, -height / 2, z, 1.0,
                width / 2, -height / 2, z, 1.0,
                width / 2, height / 2, z, 1.0,
                -width / 2, height / 2, z, 1.0,
            ],
            [// right
                width / 2, -height / 2, z, 1.0,
                width / 2, -height / 2, z-width, 1.0,
                width / 2, height / 2, z-width, 1.0,
                width / 2, height / 2, z, 1.0,
            ]
        ]
        let key = index - this.curIndex; // -1 , 0 , 1;
        key  += 1; // -1,0,1 -> 0,1,2
        this.positions.push( ...positionsMap[key] )
        
        // console.log(this.positions)
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
            // z = zInitial; //移动到原位置
            for( let j = i ; j < 4 + i; j++ ){
                positions[j] = newPoint[j-i]
            }
        }
        // console.log(positions)
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
    bindTexture(image: HTMLImageElement,index:number) {
        const gl = this.gl;
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const texture = gl.createTexture();

        this.textures[index] = texture;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        if( image == null ){//front面的黑色的底面

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
        gl.bindTexture(gl.TEXTURE_2D,this.textures[index])

    }
    bindIndex(index: number) {
        const gl = this.gl;
        const indexBuffer = this.gl.createBuffer();
        gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const indices = [
            index, index + 1, index + 2, 
            index, index + 2, index + 3,
        ];
        // console.log(indices)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.DYNAMIC_DRAW);
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            const vertexCount = indices.length;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            // gl.drawArrays(gl.TRIANGLE_STRIP,0,vertexCount)
        }
    }
    async draw( index: number) {
        let width, height;
        this.clear();
        const imgLength = this.imgUrls.length;
        for( let i = index - 1; i <= index + 1; i++ ){
            if( i !== -1 && i !== imgLength ){
                {   
                    console.log(this.imgUrls[i],i,imgLength)
                    const [err, img] = await this.loadImage(this.imgUrls[i])
                    this.imgs[i] = img;
                    const { naturalWidth, naturalHeight } = img;
                    width = this.viewWidth;
                    height = naturalHeight / naturalWidth * width;
                    this.genPostion(width, height,i);
                    // to do fornt面需要个底面去遮挡侧面的展示
                }
            }
        }
        this.bindPostion();
        for( let i = index - 1; i <= index + 2; i++ ){
            if( i !== -1 && i !== imgLength ){
                {   
                    const img = this.imgs[i]
                    this.bindTexture(img,i);
                    this.bindIndex(i*4)
                }
            }
        }

        
    }
    createPerspectiveMatrix() {
        const fieldOfViewInRadians = this.fieldOfViewInRadians;   // in radians
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
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

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
        canvas.width = window.innerWidth * this.dpr;
        canvas.height = window.innerHeight * this.dpr;
        document.body.append(canvas);

        const gl = canvas.getContext('webgl')
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
        end,
        playGame
    }:{
        allTime:number,
        timingFun: cubicBezier,
        end: number,
        playGame: Function
    }){
        const startTime = new Date().getTime();
        let curTime = startTime;
        function run(){
            let curT = (curTime - startTime) / allTime ;

            curT > 1 && (curT == 1 )
            let curEnd = timingFun.solve( curT )
            if( curEnd >= 1 ){
                curEnd = 1;
            }
            playGame( curEnd * end );
        
            if( curT <= 1 ){
                requestAnimationFrame(run)
            }
            curTime = new Date().getTime();
        }
        run();
    }
}



export { webGl };