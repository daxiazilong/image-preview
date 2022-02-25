declare type matrixType = Array<number>;
export declare const matrix: {
    multiplyPoint(point: matrixType, rowMatrix: matrixType, ...rest: Array<matrixType>): any;
    multiplyMatrices(a: matrixType, b: matrixType, ...rest: any[]): any;
    rotateByArbitrayAxis(x: number, y: number, z: number, deg: number): number[];
    multiplyArrayOfMatrices(matrices: Array<matrixType>): matrixType;
    rotateXMatrix(a: number): number[];
    rotateYMatrix(deg: number): number[];
    rotateZMatrix(a: number): number[];
    translateMatrix(x: number, y: number, z: number): number[];
    scaleMatrix(w: number, h: number, d: number): number[];
};
export {};
