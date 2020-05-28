const server = require('../../../src/server');
const controller = require('./controller');

server.post(
  '/consent',
  server.wrapAsync(
    async (req, res) => await controller.consent(req, res),
  ),
);

server.post(
  '/upload',
  server.wrapAsync(
    async (req, res) => await controller.upload(req, res),
  ),
);
