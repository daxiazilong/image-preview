function initialCanvas(img, width, height) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.drawImage(img, 0, 0, width * dpr, height * dpr);
    // document.body.innerHTML = ''
    document.body.append(canvas);
    return canvas;
}
export var tailor = initialCanvas;
