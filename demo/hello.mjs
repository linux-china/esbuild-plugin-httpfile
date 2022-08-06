import {myip} from "./demo.http";

let response = await myip();
console.log(await response.json());
