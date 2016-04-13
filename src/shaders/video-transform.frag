precision lowp float;

uniform sampler2D layerSampler;
uniform vec2 textureSize;
uniform mat3 colourMatrix;
uniform mat3 coordinateMatrix;

vec4 applyColourMatrix(vec4 fragment) {
    return vec4(fragment.rgb * colourMatrix, 1.0);
}

void main(void) {
    vec3 coords = vec3(gl_FragCoord.x / textureSize.x - 0.5, gl_FragCoord.y / textureSize.y - 0.5, 1.0);
    coords = coordinateMatrix * coords;
    vec2 transCoords = vec2(coords[0] + 0.5, coords[1] + 0.5);
    
    vec4 layerFragment = texture2D(layerSampler, transCoords);

    gl_FragColor = applyColourMatrix(layerFragment);
}
