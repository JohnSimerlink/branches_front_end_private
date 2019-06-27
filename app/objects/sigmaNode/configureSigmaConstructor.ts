export function configureSigmaConstructor(sigmaConstructor) {
	sigmaConstructor.settings.font = 'Nunito';
	sigmaConstructor.renderers.def = sigmaConstructor.renderers.canvas;
	sigmaConstructor.canvas.labels.def = sigmaConstructor.canvas.labels.prioritizable;
}
