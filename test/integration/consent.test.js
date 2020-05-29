process.env.NODE_ENV = 'test';
process.env.DB_NAME =
process.env.DB_NAME || 'safeplaces_ingest_test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require('../lib/mockData');
const server = require('../../app');

const accessCodes = require('../../db/models/accessCodes');
const cases = require('../../db/models/cases');

chai.use(chaiHttp);

describe('POST /consent', () => {
  let currentCase, currentAccessCode;

  beforeEach(async () => {
    await mockData.clearMockData();

    currentCase = await mockData.mockCase();
    currentAccessCode = await mockData.mockAccessCode(currentCase.id);
  });

  it('should fail when request is malformed', async () => {
    let result = await chai
      .request(server.app)
      .post('/consent')
      .send({
        accessCode: currentAccessCode.id,
      });
    result.should.have.status(400);

    result = await chai
      .request(server.app)
      .post('/consent')
      .send({
        consent: true,
      });
    result.should.have.status(400);
  });

  it('should fail when access code does not exist', async () => {
    const result = await chai
      .request(server.app)
      .post('/consent')
      .send({
        accessCode: "fake_code",
        consent: true,
      });
    result.should.have.status(403);
  });

  it('should fail when access code is invalid', async () => {
    await accessCodes.invalidate(currentAccessCode);
    const result = await chai
      .request(server.app)
      .post('/consent')
      .send({
        accessCode: currentAccessCode.id,
        consent: true,
      });
    result.should.have.status(403);
  });

  it('should update consent', async () => {
    const result = await chai
      .request(server.app)
      .post('/consent')
      .send({
        accessCode: currentAccessCode.id,
        consent: true,
      });
    result.should.have.status(200);

    currentCase = await cases.findById(currentCase.id);
    currentCase.consent_tos.should.be.true;
  });

  it('should update consent and invalidate access code when consent is false', async () => {
    const result = await chai
      .request(server.app)
      .post('/consent')
      .send({
        accessCode: currentAccessCode.id,
        consent: false,
      });
    result.should.have.status(200);

    currentCase = await cases.findById(currentCase.id);
    currentCase.consent_tos.should.be.false;

    currentAccessCode = await accessCodes.findById(currentAccessCode.id);
    currentAccessCode.valid.should.be.false;
  });
});
