import esbuild from 'esbuild';

import httpfilePlugin from '../index.js';

esbuild.build({
    bundle: true,
    entryPoints: ['hello-http.ts'],
    plugins: [httpfilePlugin(false)],
    platform: 'node',
    format: "esm",
    write: true,
    outfile: "bundle.mjs"
}).then(result => {
    console.log(result.outputFiles[0].text);
}).catch(() => process.exit(1));
