const server = require('../../../src/server');
const controller = require('./controller');

server.get(
  '/access-code/valid',
  server.wrapAsync(
    async (req, res) => await controller.checkValid(req, res),
  ),
);

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
