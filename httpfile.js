const LINE_TERMINATOR = "\n";

class HttpTarget {

    constructor(index) {
        this.index = index;
        this.name = undefined;
        this.comment = "";
        this.tags = [];
        this.method = "";
        this.url = "";
        this.headers = undefined;
        this.body = undefined;
        this.script = undefined;
        this.variables = [];
    }

    isEmpty() {
        return this.method === "" && this.url === "";
    }

    clean() {
        if (this.url) {
            this.url = this.replaceVariables(this.url);
        }
        if (this.body) {
            this.body = this.replaceVariables(this.body.trimEnd());
        }
        if (this.name === undefined) {
            this.name = "http" + this.index;
        } else {
            this.name = this.name.replaceAll("-", "");
        }
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    addHeader(name, value) {
        if (!this.headers) {
            this.headers = {};
        }
        this.headers[name] = this.replaceVariables(value);
    }

    addScriptLine(line) {

    }

    addBodyLine(line) {
        if (!this.body) {
            this.body = line;
        } else {
            this.body = this.body + LINE_TERMINATOR + line;
        }
    }

    replaceVariables(text) {
        let newText = text;
        while (newText.indexOf("{{") >= 0) {
            const start = newText.indexOf("{{");
            const end = newText.indexOf("}}");
            if (end < start) {
                return newText;
            }
            let name = newText.substring(start + 2, end).trim();
            if (name.startsWith("$")) { // $uuid, $timestamp, $randomInt
                name = name.substring(1);
            }
            if (this.variables.indexOf(name) < 0) {
                this.variables.push(name);
            }
            let value = "${params." + name + "}";
            newText = newText.substring(0, start) + value + newText.substring(end + 2);
        }
        return newText;
    }

    toCode() {
        let params_name = "params";
        if (this.variables.length === 0) {
            params_name = "";
        }
        if (this.body) {
            return "export async function " + this.name + "(" + params_name + ") {\n" +
                "    return await fetch(`" + this.url + "`, {\n" +
                "        method: '" + this.method + "',\n" +
                "        headers: " + JSON.stringify(this.headers ?? {}) + ",\n" +
                "        body: `" + this.body + "`" +
                "    });\n" +
                "}";
        } else {
            return "export async function " + this.name + "(" + params_name + ") {\n" +
                "    return await fetch(`" + this.url + "`, {\n" +
                "        method: '" + this.method + "',\n" +
                "        headers: " + JSON.stringify(this.headers ?? {}) + "\n" +
                "    });\n" +
                "}"
        }
    }
}

/**
 * Parse the httpfile text and return an array of HttpTarget objects.
 * @param text http file content
 * @returns {*[HttpTarget]}
 */
function parseHttpfile(text) {
    const targets = [];
    let index = 1;
    let httpTarget = new HttpTarget(index);
    for (const l of text.split("\n")) {
        const line = l.trimEnd()
        if ((line === "" || line.startsWith("#!/usr/bin/env")) && httpTarget.isEmpty()) { // ignore empty line or shebang before http target

        } else if (line.startsWith("###")) { // separator
            const comment = line.substring(3).trim();
            if (httpTarget.isEmpty()) {
                httpTarget.comment = comment;
            } else {
                httpTarget.clean();
                targets.push(httpTarget);
                index = index + 1;
                httpTarget = new HttpTarget(index);
                httpTarget.comment = comment;
            }
        } else if (line.startsWith("//") || line.startsWith("#")) { //comment
            if (line.indexOf("@") >= 0) {
                const tag = line.substring(line.indexOf("@") + 1);
                const parts = tag.split(/[=\s]/, 2);
                if (parts[0] === "name") {
                    httpTarget.name = parts[1];
                }
                httpTarget.addTag(tag);
            } else if (!httpTarget.comment) {
                httpTarget.comment = line.substring(2).trim();
            }
        } else if ((line.startsWith("GET ") || line.startsWith("POST ") || line.startsWith("PUT ") || line.startsWith("DELETE "))
            && httpTarget.method === "") { // HTTP method & URL
            const parts = line.split(" ", 3); // format as 'POST URL HTTP/1.1'
            httpTarget.method = parts[0];
            httpTarget.url = parts[1].trim();
            if (parts.length > 2) {
                httpTarget.schema = parts[2];
            }
        } else if (line.startsWith("  ")
            && (line.indexOf("  /") >= 0 || line.indexOf("  ?") >= 0 || line.indexOf("  &") >= 0)
            && httpTarget.headers === undefined) { // long request url into several lines
            httpTarget.url = httpTarget.url + line.trim();
        } else if (line.indexOf(":") > 0 && httpTarget.body === undefined && httpTarget.script === undefined) { // http headers
            const parts = line.split(":", 2);
            httpTarget.addHeader(parts[0].trim(), parts[1].trim());
        } else if (line.startsWith("<> ")) { //response-ref

        } else {
            if (!(line === "" && httpTarget.body === undefined)) {
                if (line.startsWith("> {%")) { // indicate script
                    let code = line.substring("> {%".length).trim();
                    if (code.endsWith("%}")) {
                        code = code.substring(0, code.length - 2);
                    }
                    httpTarget.script = code;
                } else if (line.startsWith("%}")) { // end of script

                } else if (line.startsWith("> ")) { // insert the script file
                    httpTarget.script = line;
                } else {
                    if (httpTarget.script !== undefined) { //add script line
                        httpTarget.addScriptLine(l);
                    } else { // add body line
                        httpTarget.addBodyLine(l);
                    }
                }
            }
        }
    }
    if (!httpTarget.isEmpty()) {
        httpTarget.clean();
        targets.push(httpTarget)
    }
    return targets;
}

module.exports = {parseHttpfile};

