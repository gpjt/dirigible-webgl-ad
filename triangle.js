(function($) {
    // register namespace
    $.extend(true, window, {
        "DirigibleDemo": {
            "Triangle": Triangle
        }
    });

    function Triangle(gl, shaderProgram) {
        var self = this;

        initBuffers();

        function initBuffers() {
            self.vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexPositionBuffer);
            var vertices = [
                 0.0,  1.0,  0.0,
                -1.0, -1.0,  0.0,
                 1.0, -1.0,  0.0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            self.vertexPositionBuffer.itemSize = 3;
            self.vertexPositionBuffer.numItems = 3;
        }


        self.draw = function(matrices) {
            matrices.pushMV();
            mat4.translate(matrices.mv, [-1.5, 0.0, 0.0]);
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.attributes.vertexPosition, self.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            shaderProgram.setMatrices(matrices);
            gl.drawArrays(gl.TRIANGLES, 0, self.vertexPositionBuffer.numItems);
            matrices.popMV();
        };
    }


})(jQuery);
