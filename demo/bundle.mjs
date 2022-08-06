// http-ns:./demo.http
async function myIp() {
  return await fetch(`https://httpbin.org/ip`, {
    method: "GET",
    headers: { "User-Agent": "curl/7.47.0" }
  });
}
async function postTest(params) {
  return await fetch(`https://${params.host}/post`, {
    method: "POST",
    headers: { "User-Agent": "curl/7.47.0", "Content-Type": "application/json" },
    body: `{
  "name": "${params.nick}",
  "age": 42,
  "uuid": "${params.uuid}",
  "demo": "hi\` morning"
}`
  });
}
async function graphqlSimple() {
  let doc = { query: `query {
    ip
}` };
  return await fetch(`https://httpbin.org/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc)
  });
}
async function graphqlDemo(variables) {
  let doc = { variables: { ...{ "id": 1, "name": "hi` morning" }, ...variables ?? {} }, query: `query {
    ip
}
` };
  return await fetch(`https://httpbin.org/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc)
  });
}

// hello.mjs
console.log("==============================================================");
var response = await myIp();
console.log(await response.json());
console.log("==============================================================");
response = await postTest({ nick: "test", host: "httpbin.org", "uuid": "c8389930-1071-4b88-9676-30b9ba7f2343" });
console.log(await response.json());
console.log("==============================================================");
response = await graphqlSimple();
console.log(await response.json());
console.log("==============================================================");
response = await graphqlDemo({ id: 2 });
console.log(await response.json());
