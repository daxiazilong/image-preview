
type coordinate = {
    x: number,
    y: number
}

/**
 * B(t) = p0(1-t)^3 + 3p1*t*(1-t)^2+3*p2*t^2(1-t) + p3*t^3;
 * let p0 = (0,0) p3 = (1,1)
 * B(t) = 3p1*t*(1-t)^2 + 3*p2*t^2(1-t) + t^3
 */
export class cubicBezier{
    p1: coordinate
    p2: coordinate
    precision = 1e-7;
    constructor(x1,y1,x2,y2){
        this.p1 = {
            x:x1,
            y:y1
        };
        this.p2 = {
            x:x2,
            y:y2
        };
    }
    getX(t:number){
        let x1 = this.p1.x,x2=this.p2.x;
        return 3*x1*t*Math.pow(1-t,2) + 3* x2*Math.pow(t,2) * (1-t) + Math.pow(t,3)
    }
    getY(t:number){
        let y1 = this.p1.y,y2=this.p2.y;
        return 3*y1*t*Math.pow(1-t,2) + 3*y2*Math.pow(t,2) * (1-t) + Math.pow(t,3)
    }
    // https://github.com/amfe/amfe-cubicbezier/blob/master/src/index.js
    solveCurveX(x:number){
        var t2 = x;
        var derivative;
        var x2;

        var p1x = this.p1.x, p2x = this.p2.x;

        var ax =  3 * p1x - 3 * p2x + 1;
        var bx = 3 * p2x - 6 * p1x;;
        var cx = 3 * p1x;;

        function sampleCurveDerivativeX(t:number){
            // `ax t^3 + bx t^2 + cx t' expanded using Horner 's rule.
            return (3 * ax * t + 2 * bx) * t + cx;
        }
        // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
        // First try a few iterations of Newton's method -- normally very fast.
        // http://en.wikipedia.org/wiki/Newton's_method
        for (let i = 0; i < 8; i++) {
            // f(t)-x=0
            x2 = this.getX(t2) - x;
            if (Math.abs(x2) < this.precision) {
                return t2;
            }
            derivative = sampleCurveDerivativeX(t2);
            // == 0, failure
            if (Math.abs(derivative) < this.precision) {
                break;
            }
            t2 -= x2 / derivative;
        }

        // Fall back to the bisection method for reliability.
        // bisection
        // http://en.wikipedia.org/wiki/Bisection_method
        var t1 = 1;
        /* istanbul ignore next */
        var t0 = 0;

        /* istanbul ignore next */
        t2 = x;
        /* istanbul ignore next */
        while (t1 > t0) {
            x2 = this.getX(t2) - x;
            if (Math.abs(x2) < this.precision) {
                return t2;
            }
            if (x2 > 0) {
                t1 = t2;
            } else {
                t0 = t2;
            }
            t2 = (t1 + t0) / 2;
        }

        // Failure
        return t2;
    }
    solve(x:number){
        return this.getY( this.solveCurveX(x) )
    }
}
export var linear = new cubicBezier(0, 0, 1, 1);
export var ease = new cubicBezier(.25, .1, .25, 1);
export var easeIn = new cubicBezier(.42, 0, 1, 1);
export var easeOut = new cubicBezier(0, 0, .58, 1);
export var easeInOut = new cubicBezier(.42, 0, .58, 1);

import {run} from './animateTest'
// run()