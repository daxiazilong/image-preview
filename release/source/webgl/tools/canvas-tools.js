function initialCanvas(img, width, height) {
    var naturalWidth = img.naturalWidth, naturalHeight = img.naturalHeight;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    var start = Date.now();
    ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight, 0, 0, width * dpr, height * dpr);
    // console.log('花费了：', Date.now() - start )
    // document.body.innerHTML = ''
    document.body.append(canvas);
    return canvas;
}
export var tailor = initialCanvas;
