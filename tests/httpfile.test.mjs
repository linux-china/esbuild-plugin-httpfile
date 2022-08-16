import fs from 'fs';
import {parseHttpfile} from '../httpfile.js';

function testParse() {
    // process.env.NODE_ENV = 'production'; // uncomment this line to test production mode
    const httpfile_text = fs.readFileSync('demo/demo.http', 'utf8');
    let targets = parseHttpfile(httpfile_text);
    for (let target of targets) {
        console.log(target.toCode());
        console.log("==============================================================");
    }
}

testParse();
