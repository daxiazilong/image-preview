export default class ImgPreview {
    [key: string]: any;
    lastClick: number;
    performerClick: any;
    threshold: number;
    startX: number;
    touchStartX: number;
    startY: number;
    touchStartY: number;
    curIndex: number;
    imgContainerMoveX: number;
    imgContainerMoveY: number;
    screenWidth: number;
    imgsNumber: number;
    slideTime: number;
    zoomScale: number;
    isZooming: boolean;
    curPoint1: {
        x: number;
        y: number;
    };
    curPoint2: {
        x: number;
        y: number;
    };
    curStartPoint1: {
        x: number;
        y: number;
    };
    curStartPoint2: {
        x: number;
        y: number;
    };
    maxMoveX: number;
    minMoveX: number;
    isAnimating: boolean;
    isMotionless: boolean;
    prefix: string;
    ref: HTMLElement;
    imgContainer: HTMLElement;
    imgItems: NodeListOf<HTMLElement>;
    operateMaps: {
        [key: string]: string;
    };
    constructor(options: Object);
    reCordInitialData(els: NodeListOf<HTMLElement>): void;
    handleTouchStart(e: TouchEvent & MouseEvent): void;
    handleTwoStart(e: TouchEvent & MouseEvent): void;
    handleOneStart(e: TouchEvent & MouseEvent): void;
    handleRotateLeft(e: TouchEvent & MouseEvent): void;
    handleRotateRight(e: TouchEvent & MouseEvent): void;
    handleClick(e: TouchEvent & MouseEvent): void;
    handleDoubleClick(e: TouchEvent & MouseEvent): void;
    setToNaturalImgSize(scaleX: number, scaleY: number, e: TouchEvent & MouseEvent): void;
    setToInitialSize(scaleX: number, scaleY: number, e: TouchEvent & MouseEvent): void;
    handleMove(e: TouchEvent & MouseEvent): void;
    handleMoveNormal(e: TouchEvent & MouseEvent): void;
    handleMoveEnlage(e: TouchEvent & MouseEvent): void;
    handleZoom(e: TouchEvent & MouseEvent): void;
    handleToucnEnd(e: TouchEvent & MouseEvent): void;
    handleTEndEnlarge(e: TouchEvent & MouseEvent): void;
    handleTEndEnNormal(e: TouchEvent & MouseEvent): void;
    slideNext(): void;
    slidePrev(): void;
    slideSelf(): void;
    animate(el: HTMLElement, prop: string, start: number, end: number, step: number): void;
    animateMultiValue(el: HTMLElement, options: Array<{
        prop: string;
        start: number;
        end: number;
        step: number;
    }>): void;
    computeStep(displacement: number, time: number): number;
    genFrame(): void;
    handleReausetAnimate(): void;
}
