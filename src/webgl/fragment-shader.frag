precision mediump float;
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}