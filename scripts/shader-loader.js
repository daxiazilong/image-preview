module.exports = function(sourcs){
    const exportsNames = [
        'sourceFrag',
        'sourceVer',
    ]
    const regs = [
        /\.frag/,
        /\.vert/
    ]

    let exportsName = ''

    regs.forEach((item,index) => {
        if( item.test(this.resourcePath) ){
            exportsName = exportsNames[index]
        }
    })

    let result = `Object.defineProperty(exports, "__esModule", ({ value: true }));
        exports.${exportsName} = void 0;
        var ${ exportsName } = \`${sourcs}\`
        exports.${exportsName} = ${exportsName}
    `;
    return result;
}