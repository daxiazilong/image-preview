import { sourceFrag } from './fragment-shader.frag'
import { sourceVer } from './vertext-shader.vert';
import { matrix } from './matrix'
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

class webGl {

    viewWidth: number;
    viewHeight: number;
    dpr: number = window.devicePixelRatio || 1;
    gl: WebGLRenderingContext;
    shaderProgram: WebGLProgram;
    fieldOfViewInRadians = 0.25 * Math.PI
    zNear = 100.0;
    zFar = 10000.0;
    curIndex = 0;
    modelMatrixes: Array<number> = [];
    initialModel: Array<number> = [
        1.0, 0, 0, 0,
        0, 1.0, 0, 0,
        0, 0, 1.0, 0,
        0, 0, 0, 1.0
    ]
    initialVertextes;
    imgs: Array<HTMLImageElement> = [];
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
        let z = (this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2));
        z > this.zFar && ( z = this.zFar )
        console.log(z)
        const modelViewMatrix = [
            1.0, 0, 0, 0,
            0, 1.0, 0, 0,
            0, 0, 1.0, 0,
            0, 0, 0, 1.0
        ]
        const deg = -Math.PI / 4;
        const rotateModel = matrix.multiplyArrayOfMatrices([
            matrix.rotateYMatrix(deg) ,// step 1
            matrix.translateMatrix(0,0,-z),
            // modelViewMatrix, // step 4
            //  todo 平移y轴 旋转

        ]);
        this.gl.uniformMatrix4fv(
            this.gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
            false,
            rotateModel
        );

        this.initData(images);
    }
    initData(images: Array<string>) {
        images.forEach((item, index) => {
            this.modelMatrixes.push(...this.initialModel)
        })
        this.drawIndex(this.curIndex)
    }
    async drawIndex(index: number) {
        if (!this.imgs[index]) {
            const [err, img] = await this.loadImage('/testImage/IMG_0512.JPG')
            if (!err) {
                this.imgs[index] = img;
            }
        }
        this.draw(this.imgs[index], index);
    }
    bindPostion(width: number, height: number) {

        const gl = this.gl;
        const z = 0.0 //-(this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2))
        const positions = [
            // front
            -width / 2, -height / 2, z, 1.0,
            width / 2, -height / 2, z, 1.0,
            width / 2, height / 2, z, 1.0,
            -width / 2, height / 2, z, 1.0,
            // right
            width / 2, -height / 2, -width, 1.0,
            width / 2, height / 2, -width, 1.0,
            width / 2, height / 2,0, 1.0,
            width / 2, -height / 2, 0, 1.0,
            // left
            -width / 2, -height / 2, -width, 1.0,
            -width / 2, height / 2, -width, 1.0,
            -width / 2, height / 2,0, 1.0,
            -width / 2, -height / 2, 0, 1.0,
    
        ]

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

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
    bindTexture(image: HTMLImageElement) {
        const gl = this.gl;

        const textureCoordBuffer = this.gl.createBuffer();
        gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // right
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,
            // left
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0,

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
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
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
        // Bind the texture to texture unit 0
        gl.activeTexture(gl['TEXTURE0']);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, 'uSampler'), 0);
    }
    bindIndex(index: number) {
        const gl = this.gl;
        const indexBuffer = this.gl.createBuffer();
        gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const indices = [
            index, index + 1, index + 2, index, index + 2, index + 3,
            index+4,index + 5, index + 6, index + 4, index + 6, index + 7,
            index+8,index + 9, index + 10, index + 8, index + 10, index + 11,
        ];
        // console.log(indices)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            const vertexCount = 18;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            // gl.drawArrays(gl.TRIANGLE_STRIP,0,vertexCount)
        }
    }
    async draw(image: HTMLImageElement, index: number) {
        let width, height;
        {
            // const [err, img] = await this.loadImage('/testImage/cubetexture.png')
            const { naturalWidth, naturalHeight } = image;
            width = this.viewWidth;
            height = naturalHeight / naturalWidth * width;
        }
        this.clear();
        let z = (this.viewHeight) / (2 * Math.tan(this.fieldOfViewInRadians / 2))
    
        this.bindPostion(width, height)
        this.bindTexture(image)



        this.bindIndex(index);
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
}



export { webGl };