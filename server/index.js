const http = require('http');
const path = require('path');
const requireDir = require('require-dir');

const app = require(path.join(__dirname, 'server'));
const microservices = requireDir('../microservices');

for (let key in microservices) {
  microservices[key].start();
}

const port = process.env.PORT || '5000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
console.log('Server now listening on port', port);
