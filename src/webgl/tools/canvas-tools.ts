function initialCanvas(img: HTMLImageElement,width:number,height:number){
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
 
    ctx.drawImage(img,0,0,width * dpr,height * dpr);
    // document.body.innerHTML = ''
    document.body.append(canvas)
    return canvas
}

export const tailor = initialCanvas;