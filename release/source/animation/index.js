var Animation = (function () {
    function Animation() {
    }
    Animation.prototype.animate = function (_a) {
        var _this = this;
        var el = _a.el, prop = _a.prop, endStr = _a.endStr, timingFunction = _a.timingFunction, callback = _a.callback, duration = _a.duration;
        if (this.isAnimating) {
            return;
        }
        this.setTransitionProperty({
            el: el,
            timingFunction: timingFunction,
            time: duration || 0.3,
            prop: prop
        });
        el['style'][prop] = endStr;
        el.addEventListener(this.supportTransitionEnd, function () {
            _this.isAnimating = false;
            typeof callback == 'function' && callback();
        }, { once: true });
    };
    Animation.prototype.animateMultiValue = function (el, options, timingFunction, callback) {
        var _this = this;
        if (this.isAnimating) {
            return;
        }
        this.isAnimating = true;
        this.setTransitionProperty({
            el: el,
            time: 0.3,
            timingFunction: timingFunction
        });
        var styleText = el.style.cssText;
        options.forEach(function (_a) {
            var prop = _a.prop, endStr = _a.endStr;
            styleText += prop + ":" + endStr + ";";
        });
        el.style.cssText = styleText;
        el.addEventListener(this.supportTransitionEnd, function () {
            _this.isAnimating = false;
            typeof callback == 'function' && callback();
        }, { once: true });
    };
    Animation.prototype.computeStep = function (displacement, time) {
        var v = displacement / time;
        var frequency = 1000 / 60;
        return v * frequency;
    };
    Animation.prototype.setTransitionProperty = function (_a) {
        var el = _a.el, prop = _a.prop, time = _a.time, timingFunction = _a.timingFunction;
        timingFunction = timingFunction || 'linear';
        prop = prop || 'all';
        el['style'][this.transitionEndPrefix] = " " + prop + " " + time + "s " + timingFunction;
    };
    Animation.prototype.transitionEnd = function () {
        var el = document.createElement('bootstrap');
        var transEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'transition': 'transitionend'
        };
        var transEndPrefixNames = {
            'WebkitTransition': '-webkit-transition',
            'MozTransition': '-moz-transition',
            'OTransition': '-o-transition',
            'transition': 'transition'
        };
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                this.transitionEndPrefix = transEndPrefixNames[name];
                return transEndEventNames[name];
            }
        }
        throw '当前环境不支持transition ，无法使用该插件。\n Transition not supported,can\'t use this plugin.';
    };
    return Animation;
}());
export { Animation };
