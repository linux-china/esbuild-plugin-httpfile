import {myIp, postTest, graphqlSimple, graphqlDemo} from "./demo.http";

// simple http request
console.log("==============================================================");
let response = await myIp();
console.log(await response.json());

// simple http post
console.log("==============================================================");
response = await postTest({nick: "test", host: "httpbin.org", "uuid": "c8389930-1071-4b88-9676-30b9ba7f2343"});
console.log(await response.json());

//simple graphql request
console.log("==============================================================");
response = await graphqlSimple();
console.log(await response.json());

//graphql request with variables
console.log("==============================================================");
response = await graphqlDemo({id: "2"});
console.log(await response.json());
