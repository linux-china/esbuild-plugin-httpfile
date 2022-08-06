esbuild-plugin-httpfile
==================================
An esbuild plugin for [httpfile](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html).

# How to use?

* Create a http file, such as `demo.http`, code as following:

```
### get my ip
//@name my-ip
GET https://httpbin.org/ip
User-Agent: curl/7.47.0

### post test
//@name post-test
POST https://{{host}}/post
User-Agent: curl/7.47.0
Content-Type: application/json

{
  "name": "{{nick}}",
  "age": 42,
  "uuid": "{{$uuid}}"
}
```

* In JavaScript/TypeScript file, such as `hello.mjs`, and you can import http file directly. Code as following:

```javascript
import {myip} from "./demo.http";

let response = await myip();
console.log(await response.json());
```

# esbuild example

```javascript
const esbuild = require('esbuild');

const httpfilePlugin = require('esbuild-plugin-httpfile');

esbuild.build({
    bundle: true,
    entryPoints: ['hello.mjs'],
    plugins: [httpfilePlugin],
    platform: 'node',
    format: "esm",
    write: true,
    outfile: "bundle.mjs"
}).then(result => {
    console.log(result.outputFiles[0].text);
}).catch(() => process.exit(1));
```

# References

* JetBrains HTTP Client: https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html
* servicex: https://servicex.sh/
* esbuild: [https://esbuild.github.io/](https://esbuild.github.io/)
