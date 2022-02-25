import { webGl } from "../index";
export declare class events {
    viewInstance: webGl;
    curBehaviorCanBreak: boolean;
    throldDeg: number;
    resizeTimer: any;
    constructor(viewInstance: webGl);
    handleResize(): void;
    handleDoubleClick({ clientX, clientY }: {
        clientX: number;
        clientY: number;
    }): Promise<unknown>;
    handleMoveEnlage(x: number, y: number, z: number): void;
    handleMoveNormal(e: TouchEvent & MouseEvent, offset: number): void;
    handleZoom(sx: number, sy: number, dx: number, dy: number): void;
    handleTEndEnNormal(e: TouchEvent & MouseEvent, offset: number): Promise<string>;
    handleTEndEnlarge(e: TouchEvent & MouseEvent, x: number, y: number, z: number): Promise<void>;
    moveCurPlaneTo(x: number, y: number, z: number): Promise<void>;
}
