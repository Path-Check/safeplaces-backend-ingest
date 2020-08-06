const { router } = require('../../../app');
const controller = require('./controller');

router.get(
  '/organization/configuration',
  router.wrapAsync(
    async (req, res) => await controller.fetchOrganization(req, res),
  ),
);
