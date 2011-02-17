(function($) {
    // register namespace
    $.extend(true, window, {
        "DirigibleDemo": {
            "Laptop": Laptop
        }
    });


    function Laptop(gl) {
        var self = this;

        init();

        function init() {
            self.screenVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.screenVertexPositionBuffer);
            vertices = [
               0.580687, 0.659, 0.813106,
              -0.580687, 0.659, 0.813107,
               0.580687, 0.472, 0.113121,
              -0.580687, 0.472, 0.113121,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            self.screenVertexPositionBuffer.itemSize = 3;
            self.screenVertexPositionBuffer.numItems = 4;

            self.screenVertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.screenVertexNormalBuffer);
            var vertexNormals = [
              0.000000, -0.965926, 0.258819,
              0.000000, -0.965926, 0.258819,
              0.000000, -0.965926, 0.258819,
              0.000000, -0.965926, 0.258819,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
            self.screenVertexNormalBuffer.itemSize = 3;
            self.screenVertexNormalBuffer.numItems = 4;

            self.screenVertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.screenVertexTextureCoordBuffer);
            var textureCoords = [
              1.0, 1.0,
              0.0, 1.0,
              1.0, 0.0,
              0.0, 0.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
            self.screenVertexTextureCoordBuffer.itemSize = 2;
            self.screenVertexTextureCoordBuffer.numItems = 4;

            DirigibleDemo.AjaxUtils.FileSystemSafeGet("laptop.json", "json", handleLoadedVertices);
        }


        function handleLoadedVertices(data) {
            self.vertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexNormals), gl.STATIC_DRAW);
            self.vertexNormalBuffer.itemSize = 3;
            self.vertexNormalBuffer.numItems = data.vertexNormals.length / 3;

            self.vertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexTextureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexTextureCoords), gl.STATIC_DRAW);
            self.vertexTextureCoordBuffer.itemSize = 2;
            self.vertexTextureCoordBuffer.numItems = data.vertexTextureCoords.length / 2;

            self.vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, self.vertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexPositions), gl.STATIC_DRAW);
            self.vertexPositionBuffer.itemSize = 3;
            self.vertexPositionBuffer.numItems = data.vertexPositions.length / 3;

            self.vertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, self.vertexIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STREAM_DRAW);
            self.vertexIndexBuffer.itemSize = 1;
            self.vertexIndexBuffer.numItems = data.indices.length;
        }


        function draw() {
            mvTranslate([0, -0.4, -2.2]);
            mvRotate(laptopAngle, [0, 1, 0]);
            mvRotate(-90, [1, 0, 0]);

            gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, true);
            gl.uniform3f(shaderProgram.pointLightingLocationUniform, -1, 2, -1);

            gl.uniform3f(shaderProgram.ambientLightingColorUniform, 0.2, 0.2, 0.2);
            gl.uniform3f(shaderProgram.pointLightingDiffuseColorUniform, 0.8, 0.8, 0.8);
            gl.uniform3f(shaderProgram.pointLightingSpecularColorUniform, 0.8, 0.8, 0.8);

            // The laptop body is quite shiny and has no texture.  It reflects lots of specular light
            gl.uniform3f(shaderProgram.materialAmbientColorUniform, 1.0, 1.0, 1.0);
            gl.uniform3f(shaderProgram.materialDiffuseColorUniform, 1.0, 1.0, 1.0);
            gl.uniform3f(shaderProgram.materialSpecularColorUniform, 1.5, 1.5, 1.5);
            gl.uniform1f(shaderProgram.materialShininessUniform, 5);
            gl.uniform3f(shaderProgram.materialEmissiveColorUniform, 0.0, 0.0, 0.0);
            gl.uniform1i(shaderProgram.useTexturesUniform, false);

            if (laptopVertexPositionBuffer) {
              gl.bindBuffer(gl.ARRAY_BUFFER, laptopVertexPositionBuffer);
              gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, laptopVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

              gl.bindBuffer(gl.ARRAY_BUFFER, laptopVertexTextureCoordBuffer);
              gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, laptopVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

              gl.bindBuffer(gl.ARRAY_BUFFER, laptopVertexNormalBuffer);
              gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, laptopVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, laptopVertexIndexBuffer);
              setMatrixUniforms();
              gl.drawElements(gl.TRIANGLES, laptopVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }

            gl.uniform3f(shaderProgram.materialAmbientColorUniform, 0.0, 0.0, 0.0);
            gl.uniform3f(shaderProgram.materialDiffuseColorUniform, 0.0, 0.0, 0.0);
            gl.uniform3f(shaderProgram.materialSpecularColorUniform, 0.5, 0.5, 0.5);
            gl.uniform1f(shaderProgram.materialShininessUniform, 20);
            gl.uniform3f(shaderProgram.materialEmissiveColorUniform, 1.5, 1.5, 1.5);
            gl.uniform1i(shaderProgram.useTexturesUniform, true);

            gl.bindBuffer(gl.ARRAY_BUFFER, laptopScreenVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, laptopScreenVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, laptopScreenVertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, laptopScreenVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, laptopScreenVertexTextureCoordBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, laptopScreenVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, rttTexture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);

            setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, laptopScreenVertexPositionBuffer.numItems);
        }

    }


})(jQuery);


