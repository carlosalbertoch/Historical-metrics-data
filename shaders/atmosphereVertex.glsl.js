const atmosphereVertexShader=`
varying vec3 vertexNormal;
void main() {
    gl_Position= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vertexNormal=normalize(normalMatrix * normal);
}

`
export default atmosphereVertexShader