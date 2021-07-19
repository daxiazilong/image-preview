type ImagePreviewConstrucor = {
    imgs?: Array<string|HTMLImageElement>,
} & {
    selector?: string
}
type interFaceElementMatrix =
    HTMLElement & {
        matrix: Array<Array<number>>,
        intialMatrix: Array<Array<number>>,
    } & transformParam;


type transformParam = {
    rotateDeg: number
}

type task = {
    priority:number,
    callback: (e:any) => any
}
type image = 
    HTMLImageElement & {
        loadError: boolean,
        _id: number
    }

type animateProps = {
    el: HTMLElement,
    prop: string,
    endStr: string,//
    timingFunction?: string,
    callback?: () => any
    duration?: number
}
type setTransitionPropertyProps = { 
    el: HTMLElement, 
    time: number, 
    timingFunction?: string, prop?: string 
}
declare module "*.vert" {
    const sourceVer: string;
    export  {sourceVer};
}
declare module "*.frag" {
    const sourceFrag: string;
    export  {sourceFrag};
}
type createPlaneParam = {
    x:number,
    y:number
    width: number,
    height: number
}
