import { cubicBezier } from './animateJs';
var easeOut1 = new cubicBezier(0.04, 1.04, 0.37, 1.04);
var wraper = document.createElement('div');
wraper.style.cssText = "\n    position:fixed;\n    top:0;\n    left:0;\n    z-index:1005;\n    width: 100vw;\n    height: 100vh;\n    background: rgba(0,0,0,1)\n";
export function run() {
    wraper.innerHTML = "\n        <input />\n    ";
    var canvas = document.createElement('canvas');
    var width = canvas.width = 300;
    var height = canvas.height = 300;
    var ctx = canvas.getContext('2d');
    ctx.moveTo(0, 300);
    for (var i = 0; i <= width; i += 10) {
        var curT = i / width;
        var curTop = height * (1 - easeOut1.solve(curT));
        ctx.lineTo(i, curTop);
    }
    ctx.strokeStyle = "red";
    ctx.stroke();
    wraper.appendChild(canvas);
    document.body.append(wraper);
}
