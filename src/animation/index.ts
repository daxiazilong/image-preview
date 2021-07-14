//@ts-nocheck
import { ImagePreview } from '../core/image-preview'

export class Animation {
    animate(
        this: ImagePreview,
        {
            el,
            prop,
            endStr,
            timingFunction,
            callback,
            duration
        }: animateProps
    ) {
        if (this.isAnimating) {
            return;
        }
        this.setTransitionProperty({
            el,
            timingFunction,
            time: duration || 0.3,
            prop
        })
        el['style'][prop] = endStr;
        el.addEventListener(this.supportTransitionEnd, () => {
            this.isAnimating = false;
            typeof callback == 'function' && callback();
        }, { once: true })
    }
    animateMultiValue(
        this: ImagePreview,
        el: HTMLElement,
        options: Array<{
            prop: string,
            endStr: string
        }>,
        timingFunction?: string,
        callback?: () => void
    ) {
        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;

        this.setTransitionProperty({
            el,
            time: 0.3,
            timingFunction
        })
        let styleText = el.style.cssText;

        options.forEach(({ prop, endStr }) => {
            styleText += `${prop}:${endStr};`
        })

        el.style.cssText = styleText;
        el.addEventListener(this.supportTransitionEnd, () => {
            this.isAnimating = false;
            typeof callback == 'function' && callback();
        }, { once: true })

    }
    computeStep(displacement: number, time: number): number {
        let v: number = displacement / time;
        let frequency: number = 1000 / 60;

        return v * frequency;
    }

    setTransitionProperty(this: ImagePreview, {el,prop, time, timingFunction}:setTransitionPropertyProps) {
        timingFunction = timingFunction || 'linear'
        prop = prop || 'all'
        el['style'][this.transitionEndPrefix] = ` ${prop} ${time}s ${timingFunction}`
    }
    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================
    transitionEnd(this: ImagePreview) {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'transition': 'transitionend'
        }
        var transEndPrefixNames = {
            'WebkitTransition': '-webkit-transition',
            'MozTransition': '-moz-transition',
            'OTransition': '-o-transition',
            'transition': 'transition'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                this.transitionEndPrefix = transEndPrefixNames[name];
                return transEndEventNames[name];
            }
        }

        throw '当前环境不支持transition ，无法使用该插件。\n Transition not supported,can\'t use this plugin.'
    }
}