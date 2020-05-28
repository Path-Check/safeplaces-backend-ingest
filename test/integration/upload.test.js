process.env.NODE_ENV = 'test';
process.env.DB_NAME =
process.env.DB_NAME || 'safeplaces_ingest_test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require('../lib/mockData');
const server = require('../../app');

const accessCodes = require('../../db/models/accessCodes');
const cases = require('../../db/models/cases');
const trails = require('../../db/models/trails');

chai.use(chaiHttp);

describe('POST /upload', () => {
  const points = [{
    longitude: 14.91328448,
    latitude: 41.24060321,
    time: 1589117739000,
    hash: "87e916850d4def3c",
  }];

  let currentCase, currentAccessCode;

  beforeEach(async () => {
    await mockData.clearMockData()

    currentCase = await mockData.mockCase();
    currentAccessCode = await mockData.mockAccessCode(currentCase.id);
  });

  it('should fail when request is malformed', async () => {
    let results = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: currentAccessCode.id,
      });
    results.should.have.status(400);

    results = await chai
      .request(server.app)
      .post('/upload')
      .send({
        concernPoints: points,
      });
    results.should.have.status(400);
  });

  it('should fail when access code does not exist', async () => {
    const results = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: "fake_code",
        concernPoints: points,
      });
    results.should.have.status(403);
  });

  it('should fail when access code is invalid', async () => {
    await accessCodes.invalidate(currentAccessCode);
    const results = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: currentAccessCode.id,
        concernPoints: points,
      });
    results.should.have.status(403);
  });

  it('should fail without consent', async () => {
    chai.should().not.exist(currentCase.consent);

    const results = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: currentAccessCode.id,
        concernPoints: points,
      });
    results.should.have.status(403);
  });

  it('should create trails', async () => {
    await cases.updateConsent(currentCase.id, true);

    const results = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: currentAccessCode.id,
        concernPoints: points,
      });
    results.should.have.status(201);

    const allTrail = await trails.find({ case_id: currentCase.id });
    allTrail.length.should.equal(points.length);
  });

  it('should invalidate access code', async () => {
    await cases.updateConsent(currentCase.id, true);

    const results = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: currentAccessCode.id,
        concernPoints: points,
      });
    results.should.have.status(201);

    currentAccessCode = await accessCodes.findById(currentAccessCode.id);
    currentAccessCode.valid.should.be.false;
  });
});
