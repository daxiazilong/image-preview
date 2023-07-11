var msgs = [];
var timer;
function showDebugger(msg) {
    clearTimeout(timer);
    msgs.push(msg);
    var stat = document.getElementById('stat');
    timer = setTimeout(function () {
        stat.innerHTML = "<pre style=\"word-break: break-all;white-space: pre-line;\">".concat(msgs.join('\n'), "</pre>");
        msgs = [];
    }, 200);
}
export { showDebugger };
