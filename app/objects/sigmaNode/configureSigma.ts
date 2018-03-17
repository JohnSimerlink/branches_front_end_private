import {log} from '../../core/log';

export function configureSigma(sigma) {
    sigma.settings.font = 'Fredoka One';
    sigma.renderers.def = sigma.renderers.canvas;
    sigma.canvas.labels.def = sigma.canvas.labels.prioritizable;
}
