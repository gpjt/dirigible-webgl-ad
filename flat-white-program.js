(function($) {
    // register namespace
    $.extend(true, window, {
        "DirigibleDemo": {
            "FlatWhiteProgram": FlatWhiteProgram
        }
    });


    function Shader(gl, url, type, onLoadCallback) {
        var self = this;

        $.ajax({
            url: url,
            dataType: "text",
            statusCode: {
                200: onLoad,
                0: onLoad
            }
        });


        function onLoad(data) {
            var shader = gl.createShader(type);

            gl.shaderSource(shader, data.responseText);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return;
            }

            self.shader = shader;
            onLoadCallback();
        }
    }


    function FlatWhiteProgram(gl) {
        var self = this;

        var pMatrixUniform;
        var mvMatrixUniform;

        initShaders();

        function initShaders() {
            var vertexShader = new Shader(gl, "flat-white-program.vs", gl.VERTEX_SHADER, linkProgramIfPossible);
            var fragmentShader = new Shader(gl, "flat-white-program.fs", gl.FRAGMENT_SHADER, linkProgramIfPossible);

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

                self.attributes = {
                    vertexPosition: gl.getAttribLocation(program, "aVertexPosition")
                };
                gl.enableVertexAttribArray(self.attributes.vertexPosition);

                pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
                mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");

                self.program = program;
            }
        }


        self.setMatrices = function(matrices) {
            gl.uniformMatrix4fv(pMatrixUniform, false, matrices.p);
            gl.uniformMatrix4fv(mvMatrixUniform, false, matrices.mv);
        };

    }


})(jQuery);
