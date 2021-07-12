/**
* 移动端自己调试要显示的数据
*/
var msgs = [];
var timer;
function showDebugger(msg) {
    clearTimeout(timer);
    msgs.push(msg);
    var stat = document.getElementById('stat');
    timer = setTimeout(function () {
        stat.innerHTML = "<pre style=\"word-break: break-all;white-space: pre-line;\">" + msgs.join('\n') + "</pre>";
        msgs = [];
    }, 200);
}
export { showDebugger };
