// rollup.config.js
export default {
	input: 'dist/index.js',
	output: {
		file: 'build/rollup-bundle.js',
		format: 'es'
	},
	external: ['xregexp'] // <-- suppresses the warning
};
