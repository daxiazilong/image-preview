/**
* 移动端自己调试要显示的数据
*/
let msgs:string[] = [];
let timer;
function showDebugger(msg: string) : void{
    clearTimeout(timer);
    msgs.push(msg);
    let stat = document.getElementById('stat');
    timer = setTimeout(() => {
        stat.innerHTML = `<pre style="word-break: break-all;white-space: pre-line;">${msgs.join('\n')}</pre>` ;
        msgs = [];
    },200)
}

export { showDebugger };