// http-ns:./demo.http
async function myip() {
  return await fetch(`https://httpbin.org/ip`, {
    method: "GET",
    headers: { "User-Agent": "curl/7.47.0" }
  });
}

// hello.mjs
const response = await myip();
console.log(await response.json());
