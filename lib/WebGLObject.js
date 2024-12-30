export default class WebGLObject {
    static async loadShaderFolder(vertexName, fragmentName) {
        return await Promise.all([
            fetch(`/screen/${vertexName}.vert`).then(response => response.text()),
            fetch(`/screen/${fragmentName}.frag`).then(response => response.text())
        ]);
    }

    static lastId = -1;
    static idAccum = 0;

    static squareTriangles = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];

    /**
     * @param {WebGL2RenderingContext} gl The WebGL2RenderingContext to use
     * @param {string} vertSource The source as text of the vertex shader
     * @param {string} fragSource The source as text of the fragment shader
     * @param {number[]} buffers The buffers to use
     */
    constructor(gl, vertSource, fragSource, buffers) {
        this.gl = gl;
        this.id = WebGLObject.idAccum++;

        this.program = this.createProgram(this.createShader(this.gl.VERTEX_SHADER, vertSource), this.createShader(this.gl.FRAGMENT_SHADER, fragSource));
        this.buffers = this.createBuffers(buffers);
        this.trianglesCount = buffers.length / 2;
        this.uniformLocations = {};
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error("An error occurred compiling the shaders:", this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createProgram(vert, frag) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vert);
        this.gl.attachShader(program, frag);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error("Unable to initialize the shader program: ", this.gl.getProgramInfoLog(program));
            return null;
        }

        return program;
    }

    createBuffers(buffers) {
        const positions = new Float32Array(buffers);

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        return positionBuffer;
    }

    getUniformLocation(name) {
        return this.uniformLocations[name] || (this.uniformLocations[name] = this.gl.getUniformLocation(this.program, name));
    }

    draw(x, y, rotation, scaleX, scaleY, options = {}) {
        if (this.id !== WebGLObject.lastId) {
            WebGLObject.lastId = this.id;

            this.gl.useProgram(this.program);

            const positionLocation = this.gl.getAttribLocation(this.program, "a_position");
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers);
            this.gl.enableVertexAttribArray(positionLocation);
            this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        }

        const matrix = new Float32Array([
            Math.cos(-rotation) * scaleX, Math.sin(-rotation) * scaleX, 0, 0,
            -Math.sin(-rotation) * scaleY, Math.cos(-rotation) * scaleY, 0, 0,
            0, 0, 1, 0,
            x, -y, 0, 1
        ]);

        const matrixLocation = this.getUniformLocation("u_matrix");
        this.gl.uniformMatrix4fv(matrixLocation, false, matrix);

        const resolutionLocation = this.getUniformLocation("u_resolution");
        this.gl.uniform2f(resolutionLocation, scaleX, scaleY);

        for (const key in options) {
            this.gl[options[key].type](this.getUniformLocation(key), options[key].value);
        }

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.trianglesCount);
    }
}