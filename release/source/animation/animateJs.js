var cubicBezier = (function () {
    function cubicBezier(x1, y1, x2, y2) {
        this.precision = 1e-5;
        this.p1 = {
            x: x1,
            y: y1
        };
        this.p2 = {
            x: x2,
            y: y2
        };
    }
    cubicBezier.prototype.getX = function (t) {
        var x1 = this.p1.x, x2 = this.p2.x;
        return 3 * x1 * t * Math.pow(1 - t, 2) + 3 * x2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
    };
    cubicBezier.prototype.getY = function (t) {
        var y1 = this.p1.y, y2 = this.p2.y;
        return 3 * y1 * t * Math.pow(1 - t, 2) + 3 * y2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
    };
    cubicBezier.prototype.solveCurveX = function (x) {
        var t2 = x;
        var derivative;
        var x2;
        var p1x = this.p1.x, p2x = this.p2.x;
        var ax = 3 * p1x - 3 * p2x + 1;
        var bx = 3 * p2x - 6 * p1x;
        ;
        var cx = 3 * p1x;
        ;
        function sampleCurveDerivativeX(t) {
            return (3 * ax * t + 2 * bx) * t + cx;
        }
        for (var i = 0; i < 8; i++) {
            x2 = this.getX(t2) - x;
            if (Math.abs(x2) < this.precision) {
                return t2;
            }
            derivative = sampleCurveDerivativeX(t2);
            if (Math.abs(derivative) < this.precision) {
                break;
            }
            t2 -= x2 / derivative;
        }
        var t1 = 1;
        var t0 = 0;
        t2 = x;
        while (t1 > t0) {
            x2 = this.getX(t2) - x;
            if (Math.abs(x2) < this.precision) {
                return t2;
            }
            if (x2 > 0) {
                t1 = t2;
            }
            else {
                t0 = t2;
            }
            t2 = (t1 + t0) / 2;
        }
        return t2;
    };
    cubicBezier.prototype.solve = function (x) {
        return this.getY(this.solveCurveX(x));
    };
    return cubicBezier;
}());
export { cubicBezier };
export var linear = new cubicBezier(0, 0, 1, 1);
export var ease = new cubicBezier(.25, .1, .25, 1);
export var easeIn = new cubicBezier(.42, 0, 1, 1);
export var easeOut = new cubicBezier(0, 0, .58, 1);
export var easeInOut = new cubicBezier(.42, 0, .58, 1);
