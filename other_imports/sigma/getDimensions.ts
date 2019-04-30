export function getDimensions(node, settings) {
	const prefix = settings('prefix') || '';
	const obj = {
		size: node[prefix + 'size'],
		x: node[prefix + 'x'],
		y: node[prefix + 'y'],
	};
	return obj;

}
