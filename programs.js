(function($) {
    // register namespace
    $.extend(true, window, {
        "DirigibleDemo": {
            "Programs": {
                "FlatWhite": FlatWhite
            }
        }
    });


    function FlatWhite(gl) {
        return new Program(
            gl,
            "flat-white-program.vs",
            "flat-white-program.fs",
            {
                vertexPosition: "aVertexPosition"
            },
            {
                pMatrix: "uPMatrix",
                mvMatrix: "uMVMatrix"
            }
        );
    }


    function Shader(gl, url, type, onLoadCallback) {
        var self = this;

        DirigibleDemo.AjaxUtils.FileSystemSafeGet(url, "text", onLoad);

        function onLoad(source) {
            var shader = gl.createShader(type);

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return;
            }

            self.shader = shader;
            onLoadCallback();
        }
    }


    function Program(gl, vsURL, fsURL, vertexArrayAttributes, uniforms) {
        var self = this;

        var pMatrixUniform;
        var mvMatrixUniform;

        initShaders();

        function initShaders() {
            var vertexShader = new Shader(gl, vsURL, gl.VERTEX_SHADER, linkProgramIfPossible);
            var fragmentShader = new Shader(gl, fsURL, gl.FRAGMENT_SHADER, linkProgramIfPossible);

            function linkProgramIfPossible() {
                if (!vertexShader.shader || !fragmentShader.shader) {
                    return;
                }

                var program = gl.createProgram();
                gl.attachShader(program, vertexShader.shader);
                gl.attachShader(program, fragmentShader.shader);
                gl.linkProgram(program);

                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    alert("Could not initialise shaders");
                }

                self.attributes = {}
                for (attribute in vertexArrayAttributes) {
                    self.attributes[attribute] = gl.getAttribLocation(program, vertexArrayAttributes[attribute]);
                    gl.enableVertexAttribArray(self.attributes[attribute]);
                }

                self.uniforms = {}
                for (uniform in uniforms) {
                    self.uniforms[uniform] = gl.getUniformLocation(program, uniforms[uniform]);
                }

                self.program = program;
            }
        }


        self.setMatrices = function(matrices) {
            gl.uniformMatrix4fv(self.uniforms.pMatrix, false, matrices.p);
            gl.uniformMatrix4fv(self.uniforms.mvMatrix, false, matrices.mv);
        };

    }


})(jQuery);
