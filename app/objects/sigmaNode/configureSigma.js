export function configureSigma() {
    console.log('sigma renderers at start of configure settings is', sigma.renderers)
    console.log('sigma renderers def at start of configure settings is', sigma.renderers.def)
    sigma.settings.font = 'Fredoka One'
    sigma.renderers.def = sigma.renderers.canvas
    sigma.canvas.labels.def = sigma.canvas.labels.prioritizable
    console.log('sigma renderers def at end of configure settings is', sigma.renderers.def)
}
