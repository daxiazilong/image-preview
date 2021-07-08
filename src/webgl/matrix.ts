type matrixType = Array<number>;
export const matrix = {
    multiplyPoint(point: matrixType,rowMatrix: matrixType,...rest: Array< matrixType >) {;
        var result = [];
        for (var col = 0; col < 4; col++) {
            result[col] = rowMatrix[col] * point[0] + rowMatrix[col + 4] * point[1]
                +
                rowMatrix[col + 8] * point[2] + rowMatrix[col + 12] * point[3]
        }
        if(rest.length > 0){
            return matrix.multiplyPoint(result,rest.splice(0,1)[0],...rest)
        }
        return result;
    },
    multiplyMatrices(a: matrixType, b: matrixType,...rest) {
        var result = [];
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                result[row * 4 + col] =
                    a[row * 4] * b[col] + a[row * 4 + 1] * b[col + 4] +
                    a[row * 4 + 2] * b[col + 8] + a[row * 4 + 3] * b[col + 12]
            }

        }
        if( rest.length ){
            return matrix.multiplyMatrices(result,rest.splice(0,1),...rest)
        }
        return result;
    },
    // https://www.songho.ca/opengl/gl_rotate.html
    rotateByArbitrayAxis(x:number,y:number,z:number,deg:number){
    
        var {cos,sin,pow} = Math;
        var aNumber = (1-cos(deg));
        var c = cos(deg),s = sin(deg)
        return[
            aNumber*pow(x,2) + c, aNumber*x*y-s*z ,      aNumber*x*z + s*y,    0,
            aNumber*x*y+s*z     , aNumber*pow(y,2) + c,  aNumber*y*z - s*x,    0,
            aNumber*x*z-s*y     , aNumber*y*z + s*x   ,  aNumber*pow(z,2) + c, 0,
            0                   ,     0               ,         0            , 1
        ]
    },
    multiplyArrayOfMatrices(matrices: Array<matrixType>) {
        var inputMatrix = matrices[0];
        for (var i = 1; i < matrices.length; i++) {
            inputMatrix = matrix.multiplyMatrices(inputMatrix, matrices[i]);
        }
        return inputMatrix;
    },
    rotateXMatrix(a: number) {

        var cos = Math.cos;
        var sin = Math.sin;

        return [
            1, 0, 0, 0,
            0, cos(a), -sin(a), 0,
            0, sin(a), cos(a), 0,
            0, 0, 0, 1
        ];
    },
    rotateYMatrix(deg: number) {

        var cos = Math.cos;
        var sin = Math.sin;

        return [
            cos(deg), 0, sin(deg), 0,
            0, 1, 0, 0,
            -sin(deg), 0, cos(deg), 0,
            0, 0, 0, 1
        ];
    },
    rotateZMatrix(a: number) {

        var cos = Math.cos;
        var sin = Math.sin;

        return [
            cos(a), -sin(a), 0, 0,
            sin(a), cos(a), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    translateMatrix(x: number, y: number, z: number) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ];
    },

    scaleMatrix(w: number, h: number, d: number) {
        return [
            w, 0, 0, 0,
            0, h, 0, 0,
            0, 0, d, 0,
            0, 0, 0, 1
        ];
    }
}








