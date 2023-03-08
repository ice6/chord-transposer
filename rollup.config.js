// rollup.config.js
export default {
	input: 'dist/index.js',
	output: {
		file: 'scripts/rollup-bundle.js',
		format: 'es'
	},
	external: ['xregexp'] // <-- suppresses the warning
};
