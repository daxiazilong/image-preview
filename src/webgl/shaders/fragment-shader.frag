precision highp float;
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler0;
uniform vec4 bgdColor;

void main(void) {
    vec4 color0 = texture2D(uSampler0, vTextureCoord) ;
    gl_FragColor = color0;
}