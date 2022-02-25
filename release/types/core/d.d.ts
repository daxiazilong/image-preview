declare type ImagePreviewConstrucor = {
    imgs?: Array<string | HTMLImageElement>;
} & {
    selector?: string;
};
declare type interFaceElementMatrix = HTMLElement & {
    matrix: Array<Array<number>>;
    intialMatrix: Array<Array<number>>;
} & transformParam;
declare type transformParam = {
    rotateDeg: number;
};
declare type task = {
    priority: number;
    callback: (e: any) => any;
};
declare type image = HTMLImageElement & {
    loadError: boolean;
    _id: number;
};
declare type animateProps = {
    el: HTMLElement;
    prop: string;
    endStr: string;
    timingFunction?: string;
    callback?: () => any;
    duration?: number;
};
declare type setTransitionPropertyProps = {
    el: HTMLElement;
    time: number;
    timingFunction?: string;
    prop?: string;
};
declare module "*.vert" {
    const sourceVer: string;
    export { sourceVer };
}
declare module "*.frag" {
    const sourceFrag: string;
    export { sourceFrag };
}
declare type createPlaneParam = {
    x: number;
    y: number;
    width: number;
    height: number;
};
