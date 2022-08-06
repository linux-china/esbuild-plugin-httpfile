const fs = require('fs');
const {parseHttpfile} = require('../httpfile');

function testParse() {
    const httpfile_text = fs.readFileSync('test/demo.http', 'utf8');
    let targets = parseHttpfile(httpfile_text);
    for (let target of targets) {
        console.log(target.toCode());
        console.log("==============================================================");
    }
}

testParse();
