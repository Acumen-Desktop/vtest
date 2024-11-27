import { defineConfig } from 'vite';
import { external } from './shared';

export default defineConfig({
	build: {
		outDir: '.vite/build/main',
		minify: true,
		lib: {
			entry: './src/electron/main.ts',
			fileName: () => '[name].js',
			formats: ['es'],
		},

		rollupOptions: {
			external,
		},
	},
	optimizeDeps: {
		exclude: [
			'@codemirror/state',
			'@codemirror/view',
			'@codemirror/basic-setup',
			'@codemirror/lang-markdown', 
			'@codemirror/language-data',
			'@codemirror/theme-one-dark',
			'codemirror'
		]
	},
	resolve: {
		// Load the Node.js entry.
		mainFields: ['module', 'jsnext:main', 'jsnext'],
	},
	clearScreen: false,
});