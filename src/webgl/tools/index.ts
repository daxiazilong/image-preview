// export default{
    // 组合多张图片成一张图片
   export function canvasForTextures(images:Array<HTMLImageElement> ){
        const canvasWidth = 128;
        const canvasHeight = 128;

        const canvas = document.createElement('canvas')
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left:0;
            z-index:100;
            width:${canvasWidth}px;
            height:${canvasHeight}px;
            user-select:none;
            font-size:0;
        `;
        document.body.append(canvas)

        const ctx = canvas.getContext('2d')
        let allWidth = 0 , allHeight = 0;
        
        images.forEach((item) => {
            
        })
        images.forEach((item) => {
            allWidth += item.naturalWidth;
        })

        let curImgWidth = 0 ;
        let curImgHeight = 0;
        let strtY = 0, startX = 0;
        ctx.rect(0,0,canvas.width,canvas.height);
        ctx.fill();
        images.forEach((item) => {
            curImgWidth = item.naturalWidth / allWidth ;
            curImgHeight = item.naturalHeight / item.naturalWidth * curImgWidth;
            if( curImgHeight > canvasHeight ){
                // 按排排成一行图片，对于高度超过canvasHeight的 将图片进行缩放 
                reSizeItem(item)
                curImgHeight  *= canvasWidth;
                curImgWidth = item.naturalHeight / item.naturalWidth * curImgHeight;
            }else{
                curImgWidth *= canvasWidth;
                curImgHeight = item.naturalHeight / item.naturalWidth * curImgWidth;
            }
            

            console.log(curImgWidth,curImgHeight)
            ctx.drawImage(item,0,0,item.naturalWidth,item.naturalHeight,startX,strtY,curImgWidth,curImgHeight )
            startX += curImgWidth;
        })
        // resize img by canvasHeight
        function reSizeItem(item:HTMLImageElement){
            curImgHeight = 1;
            let curImgAfterResizeWidth = item.naturalWidth / item.naturalHeight * curImgHeight;

            allWidth -= item.naturalWidth;
            allWidth += (curImgAfterResizeWidth / curImgWidth * item.naturalWidth)
        }
    }

    function fps(){
        let allCount = 0;
        let start ;
        const stat = document.createElement('pre');
        stat.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            padding: 10px;
            font-size:12px;
            background: rgba(255,255,255,0.5);
            color:#000;
        `
        document.body.append(stat)
        function run(){
            if(!start){
                start = Date.now();
            }
            allCount++;
            // console.log(allCount)
            if( Date.now() - start >= 1000 ){
                stat.innerHTML = allCount.toString();
                allCount = 0;
                start = Date.now();
            }

            requestAnimationFrame(run)
        }

        return run
    }
    export const showFps = fps();
// }