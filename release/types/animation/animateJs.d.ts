type coordinate = {
    x: number;
    y: number;
};
export declare class cubicBezier {
    p1: coordinate;
    p2: coordinate;
    cachedY: Map<number, number>;
    precision: number;
    constructor(x1: any, y1: any, x2: any, y2: any);
    getX(t: number): number;
    getY(t: number): number;
    solveCurveX(x: number): number;
    solve(x: number): number;
}
export declare var linear: cubicBezier;
export declare var ease: cubicBezier;
export declare var easeIn: cubicBezier;
export declare var easeOut: cubicBezier;
export declare var easeInOut: cubicBezier;
export {};
