var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var Matrix = /** @class */ (function () {
    function Matrix() {
    }
    Matrix.prototype.matrixMultipy = function (a, b) {
        var res = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            res[_i - 2] = arguments[_i];
        }
        var r = a.length;
        var col = a[0].length;
        var result = [];
        for (var i = 0; i < r; i++) {
            var row = a[i];
            result[i] = [];
            for (var j = 0; j < r; j++) {
                var count = 0;
                for (var x = 0; x < col; x++) {
                    var item1 = row[x];
                    var item2 = b[x][j];
                    count += (item1 * item2);
                }
                result[i].push(count);
            }
        }
        if (res.length) {
            return this.matrixMultipy.apply(this, __spreadArray([result, res.splice(0, 1)[0]], res));
        }
        return result;
    };
    Matrix.prototype.matrixTostr = function (arr) {
        var ans = '';
        var lastIndex = arr.length - 1;
        arr.forEach(function (item, index) {
            item.forEach(function (item, innerIndex) {
                ans += (item + (index == innerIndex && index == lastIndex ? '' : ','));
            });
        });
        return "matrix3d(" + ans + ")";
    };
    Matrix.prototype.getTranslateMatrix = function (_a) {
        var x = _a.x, y = _a.y, z = _a.z;
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [x, y, z, 1],
        ];
    };
    Matrix.prototype.getRotateZMatrix = function (deg) {
        return [
            [Math.cos(deg), Math.sin(deg), 0, 0],
            [-Math.sin(deg), Math.cos(deg), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ];
    };
    Matrix.prototype.getScaleMatrix = function (_a) {
        var x = _a.x, y = _a.y, z = _a.z;
        return [
            [x, 0, 0, 0],
            [0, y, 0, 0],
            [0, 0, z, 0],
            [0, 0, 0, 1],
        ];
    };
    return Matrix;
}());
export { Matrix };
