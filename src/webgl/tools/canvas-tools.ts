function initialCanvas(img: HTMLImageElement,width:number,height:number){

    const {naturalWidth,naturalHeight} = img
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    let start = Date.now();
    ctx.drawImage(
        img,0,0,
        naturalWidth,naturalHeight,
        0, 0,
        width * dpr,height * dpr
    );
    // console.log('花费了：', Date.now() - start )
    // document.body.innerHTML = ''
    // document.body.append(canvas)
    return canvas
}

export const tailor = initialCanvas;