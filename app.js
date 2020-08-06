const path = require('path');

const config = {
  port: process.env.EXPRESSPORT || '8000',
  appFolder: path.join(__dirname, 'app'),
  wrapAsync: asyncFn => {
    return (req, res, next) => {
      asyncFn(req, res, next).catch(next);
    };
  },
};

const server = require('@pathcheck/safeplaces-server')(config);

server.setupAndCreate();

module.exports = server;
