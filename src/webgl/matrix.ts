type matrixType = Array<number>;
export const matrix = {
    multiplyPoint(matrix: matrixType, point: matrixType) {
        var result = [];
        for (var row = 0; row < 4; row++) {
            result[row] = matrix[row * 4] * point[0] + matrix[row * 4 + 1] * point[1]
                +
                matrix[row * 4 + 2] * point[2] + matrix[row * 4 + 3] * point[3]
        }
        return result;
    },
    multiplyMatrices(a: matrixType, b: matrixType) {
        var result = [];
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                result[row * 4 + col] =
                    a[row * 4] * b[col] + a[row * 4 + 1] * b[col + 4] +
                    a[row * 4 + 2] * b[col + 8] + a[row * 4 + 3] * b[col + 12]
            }

        }
        return result;
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
    rotateYMatrix(a: number) {

        var cos = Math.cos;
        var sin = Math.sin;

        return [
            cos(a), 0, sin(a), 0,
            0, 1, 0, 0,
            -sin(a), 0, cos(a), 0,
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








