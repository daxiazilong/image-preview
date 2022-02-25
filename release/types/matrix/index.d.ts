export declare class Matrix {
    matrixMultipy(a: any, b: any, ...res: any[]): any;
    matrixTostr(arr: Array<Array<number>>): string;
    getTranslateMatrix({ x, y, z }: {
        x: any;
        y: any;
        z: any;
    }): any[][];
    getRotateZMatrix(deg: number): number[][];
    getScaleMatrix({ x, y, z }: {
        x: any;
        y: any;
        z: any;
    }): any[][];
}
