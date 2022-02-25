import { ImagePreview } from '../core/image-preview';
export declare class Animation {
    animate(this: ImagePreview, { el, prop, endStr, timingFunction, callback, duration }: animateProps): void;
    animateMultiValue(this: ImagePreview, el: HTMLElement, options: Array<{
        prop: string;
        endStr: string;
    }>, timingFunction?: string, callback?: () => void): void;
    computeStep(displacement: number, time: number): number;
    setTransitionProperty(this: ImagePreview, { el, prop, time, timingFunction }: setTransitionPropertyProps): void;
    transitionEnd(this: ImagePreview): any;
}
