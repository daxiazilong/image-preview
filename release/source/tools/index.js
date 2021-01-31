/**
* 移动端自己调试要显示的数据
*/
function showDebugger(msg) {
    var stat = document.getElementById('stat');
    stat.innerHTML = "<pre style=\"word-break: break-all;white-space: pre-line;\">" + msg + "</pre>";
}
module.exports = showDebugger;
