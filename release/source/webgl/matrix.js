var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
export var matrix = {
    multiplyPoint: function (point, rowMatrix) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        ;
        var result = [];
        for (var col = 0; col < 4; col++) {
            result[col] = rowMatrix[col] * point[0] + rowMatrix[col + 4] * point[1]
                +
                    rowMatrix[col + 8] * point[2] + rowMatrix[col + 12] * point[3];
        }
        if (!rest.length) {
            return result;
        }
        return matrix.multiplyPoint.apply(matrix, __spreadArray([result, rest.splice(0, 1)[0]], rest));
    },
    multiplyMatrices: function (a, b) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        var result = [];
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                result[row * 4 + col] =
                    a[row * 4] * b[col] + a[row * 4 + 1] * b[col + 4] +
                        a[row * 4 + 2] * b[col + 8] + a[row * 4 + 3] * b[col + 12];
            }
        }
        if (!rest.length) {
            return result;
        }
        return matrix.multiplyMatrices.apply(matrix, __spreadArray([result, rest.splice(0, 1)[0]], rest));
    },
    rotateByArbitrayAxis: function (x, y, z, deg) {
        var cos = Math.cos, sin = Math.sin, pow = Math.pow;
        var aNumber = (1 - cos(deg));
        var c = cos(deg), s = sin(deg);
        return [
            aNumber * pow(x, 2) + c, aNumber * x * y - s * z, aNumber * x * z + s * y, 0,
            aNumber * x * y + s * z, aNumber * pow(y, 2) + c, aNumber * y * z - s * x, 0,
            aNumber * x * z - s * y, aNumber * y * z + s * x, aNumber * pow(z, 2) + c, 0,
            0, 0, 0, 1
        ];
    },
    multiplyArrayOfMatrices: function (matrices) {
        var inputMatrix = matrices[0];
        for (var i = 1; i < matrices.length; i++) {
            inputMatrix = matrix.multiplyMatrices(inputMatrix, matrices[i]);
        }
        return inputMatrix;
    },
    rotateXMatrix: function (a) {
        var cos = Math.cos;
        var sin = Math.sin;
        return [
            1, 0, 0, 0,
            0, cos(a), -sin(a), 0,
            0, sin(a), cos(a), 0,
            0, 0, 0, 1
        ];
    },
    rotateYMatrix: function (deg) {
        var cos = Math.cos;
        var sin = Math.sin;
        return [
            cos(deg), 0, sin(deg), 0,
            0, 1, 0, 0,
            -sin(deg), 0, cos(deg), 0,
            0, 0, 0, 1
        ];
    },
    rotateZMatrix: function (a) {
        var cos = Math.cos;
        var sin = Math.sin;
        return [
            cos(a), -sin(a), 0, 0,
            sin(a), cos(a), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },
    translateMatrix: function (x, y, z) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ];
    },
    scaleMatrix: function (w, h, d) {
        return [
            w, 0, 0, 0,
            0, h, 0, 0,
            0, 0, d, 0,
            0, 0, 0, 1
        ];
    }
};
