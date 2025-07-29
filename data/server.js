"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server.js
var json_server_1 = require("json-server");
var server = json_server_1.default.create();
var router = json_server_1.default.router("db.json");
var middlewares = json_server_1.default.defaults();
server.use(middlewares);
server.use(router);
server.listen(3000, function () {
    console.log("JSON Server is running");
});
