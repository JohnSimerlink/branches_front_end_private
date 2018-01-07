import {log} from '../../core/log'
export function configureSigma(sigma) {
    log('configureSigma configureSigma called')
    sigma.settings.font = 'Fredoka One'
    sigma.renderers.def = sigma.renderers.canvas
    sigma.canvas.labels.def = sigma.canvas.labels.prioritizable
}
