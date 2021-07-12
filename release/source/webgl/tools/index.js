// export default{
// 组合多张图片成一张图片
export function canvasForTextures(images) {
    var canvasWidth = 128;
    var canvasHeight = 128;
    var canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.cssText = "\n            position: fixed;\n            top: 0;\n            left:0;\n            z-index:100;\n            width:" + canvasWidth + "px;\n            height:" + canvasHeight + "px;\n            user-select:none;\n            font-size:0;\n        ";
    document.body.append(canvas);
    var ctx = canvas.getContext('2d');
    var allWidth = 0, allHeight = 0;
    images.forEach(function (item) {
    });
    images.forEach(function (item) {
        allWidth += item.naturalWidth;
    });
    var curImgWidth = 0;
    var curImgHeight = 0;
    var strtY = 0, startX = 0;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    images.forEach(function (item) {
        curImgWidth = item.naturalWidth / allWidth;
        curImgHeight = item.naturalHeight / item.naturalWidth * curImgWidth;
        if (curImgHeight > canvasHeight) {
            // 按排排成一行图片，对于高度超过canvasHeight的 将图片进行缩放 
            reSizeItem(item);
            curImgHeight *= canvasWidth;
            curImgWidth = item.naturalHeight / item.naturalWidth * curImgHeight;
        }
        else {
            curImgWidth *= canvasWidth;
            curImgHeight = item.naturalHeight / item.naturalWidth * curImgWidth;
        }
        console.log(curImgWidth, curImgHeight);
        ctx.drawImage(item, 0, 0, item.naturalWidth, item.naturalHeight, startX, strtY, curImgWidth, curImgHeight);
        startX += curImgWidth;
    });
    // resize img by canvasHeight
    function reSizeItem(item) {
        curImgHeight = 1;
        var curImgAfterResizeWidth = item.naturalWidth / item.naturalHeight * curImgHeight;
        allWidth -= item.naturalWidth;
        allWidth += (curImgAfterResizeWidth / curImgWidth * item.naturalWidth);
    }
}
export function fps() {
    ;
    var allCount = 0;
    var start;
    var stat = document.createElement('pre');
    stat.style.cssText = "\n            position: fixed;\n            top: 0;\n            right: 0;\n            z-index:100;\n            padding: 10px;\n            font-size:12px;\n            background: rgba(255,255,255,0.5);\n            color:#000;\n        ";
    document.body.append(stat);
    function run() {
        if (!start) {
            start = Date.now();
        }
        allCount++;
        // console.log(allCount)
        if (Date.now() - start >= 1000) {
            stat.innerHTML = allCount.toString();
            allCount = 0;
            start = Date.now();
        }
        requestAnimationFrame(run);
    }
    return run;
}
// }
