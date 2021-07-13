const express = require('express');
const app = express();

app.get("/", (req, res) => {
    let a = 4;
    console.log(a);
    res.send("aaa");
});
app.listen(3004);

/*
const http = require("http");

const server = http.createServer((request, responce) => {
    let body;
    if (request.method === "POST") {
        request.on('data', chunk => {
            chunk.toString()
        });
    }
});
server.listen(3002);
*/

