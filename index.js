const server = require('express')();
const client = require('prom-client');
const { WebSocketClient } = require('./websocket');
const ENDPOINTS = process.env.ENDPOINTS.split(" ")

const gauge = new client.Gauge({
  name: 'websocket_status',
  help: 'websocket_help',
  labelNames: ["endpoint"]
});

for (let i=0; i < ENDPOINTS.length; i++) {
  const endpoint = ENDPOINTS[i]
  const ws = new WebSocketClient();
  ws.open(endpoint);
  ws.onopen = function (e) {
    gauge.labels(endpoint).set(1);
  }
  ws.onerror = function (e) {
    gauge.labels(endpoint).set(0);
  }
}

server.get('/metrics', (req, res) => {
  res.end(client.register.metrics());
});

server.listen(9189);
