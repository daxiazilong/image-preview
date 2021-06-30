import {linear,easeOut,cubicBezier} from './animateJs'

const easeOut1 =  new cubicBezier(0.04, 1.04, 0.37, 1.04)
const wraper = document.createElement('div')
wraper.style.cssText = `
    position:fixed;
    top:0;
    left:0;
    z-index:1005;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,1)
`
export function run (){
    wraper.innerHTML = `
        <input />
    `
    const canvas = document.createElement('canvas')
    const width = canvas.width = 300;
    const height = canvas.height = 300;

    const ctx = canvas.getContext('2d');

    ctx.moveTo(0,300)
    for( let i = 0 ; i <= width; i += 10){
        let curT = i / width;
        let curTop = height * (1 - easeOut1.solve(curT));
        // console.log('run',curT,easeOut1.solve(curT))
        ctx.lineTo(i,curTop)
    }
    ctx.strokeStyle = "red";
    ctx.stroke();
    wraper.appendChild(canvas)
    document.body.append(wraper)
}