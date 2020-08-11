process.env.NODE_ENV = 'test';
process.env.DB_NAME_PUB = process.env.DB_NAME_PUB || 'safeplaces_ingest_test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require('../lib/mockData');
const app = require('../../app');
const server = app.getTestingServer();

const { pointService, accessCodeService } = require('../../app/lib/db');

chai.use(chaiHttp);

describe('POST /upload', () => {
  const uploadPoints = [
    {
      longitude: 14.91328448,
      latitude: 41.24060321,
      time: 1589117739000,
    },
  ];

  let currentAccessCode;

  beforeEach(async () => {
    await mockData.clearMockData();
    currentAccessCode = await mockData.mockAccessCode();
  });

  it('should fail when request is malformed', async () => {
    let result = await chai.request(server).post('/upload').send({
      accessCode: currentAccessCode.value,
    });
    result.should.have.status(400);

    result = await chai.request(server).post('/upload').send({
      concernPoints: uploadPoints,
    });
    result.should.have.status(400);
  });

  it('should fail when access code does not exist', async () => {
    const result = await chai.request(server).post('/upload').send({
      accessCode: 'fake_code',
      concernPoints: uploadPoints,
    });
    result.should.have.status(403);
  });

  it('should fail when access code is invalid', async () => {
    await accessCodeService.invalidate(currentAccessCode);
    const result = await chai.request(server).post('/upload').send({
      accessCode: currentAccessCode.value,
      concernPoints: uploadPoints,
    });
    result.should.have.status(403);
  });

  it('should fail without consent', async () => {
    chai.should().not.exist(currentAccessCode.upload_consent);

    const result = await chai.request(server).post('/upload').send({
      accessCode: currentAccessCode.value,
      concernPoints: uploadPoints,
    });
    result.should.have.status(451);
  });

  it('should create points and invalidate access code', async () => {
    await accessCodeService.updateUploadConsent(currentAccessCode, true);
    currentAccessCode.upload_consent.should.be.true;

    const result = await chai.request(server).post('/upload').send({
      accessCode: currentAccessCode.value,
      concernPoints: uploadPoints,
    });
    result.should.have.status(201);
    chai.should().exist(result.body.uploadId);

    const uploadedPoints = await pointService.find({
      access_code_id: currentAccessCode.id,
    });
    uploadedPoints.length.should.equal(uploadPoints.length);

    currentAccessCode = await accessCodeService.find({
      id: currentAccessCode.id,
    });
    currentAccessCode.valid.should.be.false;
  });
});
