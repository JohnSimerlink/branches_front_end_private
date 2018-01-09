import {log} from '../../core/log'
let count = 0
export function configureSigma(sigma) {
    log('configureSigma configureSigma called', ++count)
    sigma.settings.font = 'Fredoka One'
    sigma.renderers.def = sigma.renderers.canvas
    sigma.canvas.labels.def = sigma.canvas.labels.prioritizable
    log('configureSigma just finished calling! sigma.renderers is', sigma.renderers)
}
