const {resolve, basename} = require('path');
const fs = require('fs');
const {parseHttpfile} = require('./httpfile');

const name = 'httpfile'

let loggingVerbose = false;

const setup = ({onResolve, onLoad}) => {
    onResolve({filter: /\.(http)$/}, ({path, resolveDir}) => ({
        path: path,
        namespace: 'http-ns',
        pluginData: {resolveDir}
    }));
    onLoad({filter: /\.(http)$/, namespace: 'http-ns'}, buildHttpfileFunctions);
}

const buildHttpfileFunctions = async ({path, pluginData}) => {
    const resolveDir = pluginData.resolveDir;
    const originalPath = resolve(resolveDir, path);
    const httpfileText = await fs.promises.readFile(originalPath, {encoding: 'utf8'});
    const targets = parseHttpfile(httpfileText);
    // generate javascript stub code
    let contents = targets.map(target => {
        return target.toCode();
    }).join("\n\n");
    if (loggingVerbose) {
        // generate typescript declaration file
        let declareFileName = basename(originalPath);
        let declaredApiList = targets.map(target => {
            return target.toApiDeclare();
        }).join("\n    ");
        let moduleDeclareCode = `declare module '*${declareFileName}' {\n    ${declaredApiList}\n}`;
        // logging
        let declaredFileName = declareFileName.replace(".http", "-http.d.ts");
        console.log("=====================" + declaredFileName + "==========================================");
        console.log(moduleDeclareCode);
        console.log("=====================" + declareFileName + ".js========================================");
        console.log(contents);
        console.log("=======================================================================================");

    }
    return {contents};
}

/**
 * build esbuild httpfile plugin
 * @param {boolean=} verbose - enable verbose logging
 * @returns {{name: string, setup: function}} esbuild plugin object
 */
function buildHttpFilePlugin(verbose) {
    if (verbose) {
        loggingVerbose = true;
    }
    return {name, setup};
}

module.exports = buildHttpFilePlugin;

