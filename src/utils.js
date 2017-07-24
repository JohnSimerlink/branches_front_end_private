export function toggleVisibility(el){
    var style = el.style
    if (style.display == 'block') {
        style.display = 'none'
    } else {
        style.display = 'block'
    }
}
