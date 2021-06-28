precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler0;
uniform vec2 iResolution;
// uniform vec4 bgdColor;
void main() {

    // vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
    vec4 color0 = texture2D(uSampler0, vTextureCoord) ;
    gl_FragColor = color0;
}