function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
window.hexToRgb = hexToRgb

function hexToRgbString(hex) {
    const rgb = hexToRgb(hex)
    var result ="rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")"
    return result
}
window.hexToRgbString = hexToRgbString
function setOpacityOfRgbString(rgb, opacity){
    var newColor = rgb.replace(/rgb/i, "rgba");
    newColor = newColor.replace(/\)/i,', ' + opacity + ')');
    return newColor
}
window.setOpacityOfRgbString = setOpacityOfRgbString

function colorToRGBA(color) {
    // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
    // color must be a valid canvas fillStyle. This will cover most anything
    // you'd want to use.
    // Examples:
    // colorToRGBA('red')  # [255, 0, 0, 255]
    // colorToRGBA('#f00') # [255, 0, 0, 255]
    var cvs, ctx;
    cvs = document.createElement('canvas');
    cvs.height = 1;
    cvs.width = 1;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}
window.colorToRGBA = colorToRGBA
function colorToRgbString(color){
    var rgbaArray = colorToRGBA(color)
    return "rgb(" +rgbaArray[0] + ", " + rgbaArray[1] + ", " + rgbaArray[2] + ")"
}
window.colorToRgbString = colorToRgbString
