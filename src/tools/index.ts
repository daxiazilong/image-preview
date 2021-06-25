/**
* 移动端自己调试要显示的数据
*/
function showDebugger(msg: string) : void{
    
    let stat = document.getElementById('stat');
    stat.innerHTML = `<pre style="word-break: break-all;white-space: pre-line;">${msg}</pre>` ;
}

export { showDebugger };