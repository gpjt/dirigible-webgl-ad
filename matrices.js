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


        self.setUniforms = function(shaderProgram) {
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, self.p);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, self.mv);
        }

    }


})(jQuery);
