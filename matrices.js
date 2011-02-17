(function($) {
    // register namespace
    $.extend(true, window, {
        "DirigibleDemo": {
            "Matrices": Matrices
        }
    });


    function Matrices() {
        var self = this;

        self.p = mat4.create();
        self.mv = mat4.create();

        var mvStack = [];

        self.setUniforms = function(gl, shaderProgram) {
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, self.p);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, self.mv);
        }


        self.pushMV = function() {
            var copy = mat4.create();
            mat4.set(self.mv, copy);
            mvStack.push(copy);
        }


        self.popMV = function() {
            if (mvStack.length == 0) {
              throw "Invalid popMatrix!";
            }
            self.mv = mvStack.pop();
        }

    }


})(jQuery);
