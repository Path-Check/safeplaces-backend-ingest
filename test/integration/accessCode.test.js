process.env.NODE_ENV = 'test';
process.env.DB_NAME =
process.env.DB_NAME || 'safeplaces_ingest_test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require('../lib/mockData');
const server = require('../../app');

const accessCodes = require('../../db/models/accessCodes');

chai.use(chaiHttp);

describe('GET /access-code/valid', () => {
  let currentAccessCode;

  beforeEach(async () => {
    await mockData.clearMockData();

    const currentCase = await mockData.mockCase();
    currentAccessCode = await mockData.mockAccessCode(currentCase.id);
  });

  it('should fail when request is malformed', async () => {
    let result = await chai
      .request(server.app)
      .get('/access-code/valid')
      .send();
    result.should.have.status(400);
  });

  it('should succeed when token is valid', async () => {
    const result = await chai
      .request(server.app)
      .get('/access-code/valid')
      .send({
        accessCode: currentAccessCode.id,
      });
    result.should.have.status(200);
    result.body.valid.should.be.true;
  });

  it('should succeed when token is invalid', async () => {
    await accessCodes.invalidate(currentAccessCode);

    const result = await chai
      .request(server.app)
      .get('/access-code/valid')
      .send({
        accessCode: currentAccessCode.id,
      });
    result.should.have.status(200);
    result.body.valid.should.be.false;
  });
});
