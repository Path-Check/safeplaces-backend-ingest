const server = require('../../../src/server');
const controller = require('./controller');

server.get(
  '/organization/configuration',
  server.wrapAsync(
    async (req, res) => await controller.fetchOrganization(req, res),
  ),
);
