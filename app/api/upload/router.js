const { router } = require('../../../app');
const controller = require('./controller');

router.post(
  '/access-code/valid',
  router.wrapAsync(async (req, res) => await controller.checkValid(req, res)),
);

router.post(
  '/consent',
  router.wrapAsync(async (req, res) => await controller.consent(req, res)),
);

router.post(
  '/upload',
  router.wrapAsync(async (req, res) => await controller.upload(req, res)),
);
