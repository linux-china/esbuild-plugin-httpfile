const {resolve} = require('path');
const fs = require('fs');
const {parseHttpfile} = require('./httpfile')

const name = 'httpfile'

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
    let contents = targets.map(target => {
        return target.toCode();
    }).join("\n\n");
    return {contents};
}

module.exports = {name, setup};
