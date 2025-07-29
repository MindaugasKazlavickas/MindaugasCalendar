import jsonServer from "json-server";
import events from "./events";
const server = jsonServer.create();
const router = jsonServer.router({ events });
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is runnicd ng");
});
