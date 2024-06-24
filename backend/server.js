const http = require('http');
const app = require('./app');

const server = http.createServer();
server.listen(process.env.PORT|| 3000);