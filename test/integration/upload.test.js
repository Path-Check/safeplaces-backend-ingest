process.env.NODE_ENV = 'test';
process.env.DB_NAME = (process.env.DB_NAME || 'safeplaces_ingest_test');

const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require('../lib/mockData');
const server = require('../../app');

const accessCodes = require('../../db/models/accessCodes');
const points = require('../../db/models/points');

chai.use(chaiHttp);

describe('POST /upload', () => {
  const uploadPoints = [{
    longitude: 14.91328448,
    latitude: 41.24060321,
    time: 1589117739000,
  }];

  let currentAccessCode;

  beforeEach(async () => {
    await mockData.clearMockData();
    currentAccessCode = await mockData.mockAccessCode();
  });

  it('should fail when request is malformed', async () => {
    let result = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: currentAccessCode.value,
      });
    result.should.have.status(400);

    result = await chai
      .request(server.app)
      .post('/upload')
      .send({
        concernPoints: uploadPoints,
      });
    result.should.have.status(400);
  });

  it('should fail when access code does not exist', async () => {
    const result = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: "fake_code",
        concernPoints: uploadPoints,
      });
    result.should.have.status(403);
  });

  it('should fail when access code is invalid', async () => {
    await accessCodes.invalidate(currentAccessCode);
    const result = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: currentAccessCode.value,
        concernPoints: uploadPoints,
      });
    result.should.have.status(403);
  });

  it('should fail without consent', async () => {
    chai.should().not.exist(currentAccessCode.upload_consent);

    const result = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: currentAccessCode.value,
        concernPoints: uploadPoints,
      });
    result.should.have.status(451);
  });

  it('should create points and invalidate access code', async () => {
    await accessCodes.updateUploadConsent(currentAccessCode, true);
    currentAccessCode.upload_consent.should.be.true;

    const result = await chai
      .request(server.app)
      .post('/upload')
      .send({
        accessCode: currentAccessCode.value,
        concernPoints: uploadPoints,
      });
    result.should.have.status(201);
    chai.should().exist(result.body.uploadId);

    const uploadedPoints = await points.find({ access_code_id: currentAccessCode.id });
    uploadedPoints.length.should.equal(uploadPoints.length);

    currentAccessCode = await accessCodes.find({ id: currentAccessCode.id });
    currentAccessCode.valid.should.be.false;
  });
});
