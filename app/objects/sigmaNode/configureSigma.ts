export function configureSigma(sigma) {
	sigma.settings.font = 'Nunito';
	sigma.renderers.def = sigma.renderers.canvas;
	sigma.canvas.labels.def = sigma.canvas.labels.prioritizable;
}
