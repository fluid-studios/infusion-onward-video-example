precision lowp float;

uniform sampler2D layerSampler;
uniform vec2 textureSize;
uniform mat3 colourMatrix;

vec4 applyColourMatrix (vec4 fragment) {
    return vec4(fragment.rgb * colourMatrix, 1.0);
}

void main(void) {
    vec2 coords = vec2(gl_FragCoord.x / textureSize.x, gl_FragCoord.y / textureSize.y);
    vec4 layerFragment = texture2D(layerSampler, coords);

    gl_FragColor = applyColourMatrix(layerFragment);
}
