import { ImagePreview } from '../core/image-preview';
export declare class Move {
    handleMove(this: ImagePreview, e: TouchEvent & MouseEvent): void;
    handleMoveNormal(this: ImagePreview, e: TouchEvent & MouseEvent): void;
    handleMoveEnlage(this: ImagePreview, e: TouchEvent & MouseEvent): void;
    autoMove(this: ImagePreview, deg: number, startX: number, startY: number, { maxTop, minTop, maxLeft, minLeft }: {
        maxTop: any;
        minTop: any;
        maxLeft: any;
        minLeft: any;
    }): Promise<void>;
}
