console.log('login.build.js called', Date.now())
setTimeout(() => {
    console.log("about to load second script", Date.now())
    loadScript('dist/build.js')
}, 3000)
function loadScript(path) {
    const script = document.createElement('script')
    script.setAttribute('src', path)
    const body = document.querySelector('body')
    body.appendChild(script);
}