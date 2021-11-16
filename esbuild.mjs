// Thank you: https://github.com/aidenlx/media-extended/blob/main/esbuild.js
import esbuild from 'esbuild';
import fs from 'fs';

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
If you want to view the source, visit the plugins’ github repository.

This plugin uses feather icons (https://github.com/feathericons/feather). Feather icons is MIT-licensed:
	The MIT License (MIT)

	Copyright (c) 2013-2017 Cole Bemis

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.


The commandSuggester, iconPicker, addFeatherIcons function, feather icon names and the biggest part of the settings tab have been adapted from the Obsidian Customizable Sidebar Plugin (https://github.com/phibr0/obsidian-customizable-sidebar).
It is MIT-licensed:
	MIT License

	Copyright (c) 2021 Phillip

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.


*/
`;

const copyManifest = {
	name: 'copy-manifest-and-styles',
	setup: (build) => {
		build.onEnd(() => {
			fs.copyFileSync('manifest.json', 'build/manifest.json');
		});
	},
};

const isProd = process.env.BUILD === 'production';

(async () => {
	try {
		await esbuild.build({
			entryPoints: ['src/main.ts'],
			bundle: true,
			watch: !isProd,
			platform: 'browser',
			external: ['obsidian'],
			format: 'cjs',
			banner: { js: banner },
			sourcemap: isProd ? false : 'inline',
			minify: isProd,
			treeShaking: true,
			define: {
				'process.env.NODE_ENV': JSON.stringify(process.env.BUILD),
			},
			outfile: 'build/main.js',
			logLevel: 'info',
			plugins: [copyManifest],
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();
