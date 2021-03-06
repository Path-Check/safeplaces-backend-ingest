process.env.NODE_ENV = 'test';
process.env.DB_NAME_PUB = process.env.DB_NAME_PUB || 'safeplaces_ingest_test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require('../lib/mockData');
const app = require('../../app');
const server = app.getTestingServer();

const { accessCodeService } = require('../../app/lib/db');

chai.use(chaiHttp);

describe('POST /consent', () => {
  let currentAccessCode;

  beforeEach(async () => {
    await mockData.clearMockData();
    currentAccessCode = await mockData.mockAccessCode();
  });

  it('should fail when request is malformed', async () => {
    let result = await chai.request(server).post('/consent').send({
      accessCode: currentAccessCode.value,
    });
    result.should.have.status(400);

    result = await chai.request(server).post('/consent').send({
      consent: true,
    });
    result.should.have.status(400);
  });

  it('should fail when access code does not exist', async () => {
    const result = await chai.request(server).post('/consent').send({
      accessCode: 'fake_code',
      consent: true,
    });
    result.should.have.status(403);
  });

  it('should fail when access code is invalid', async () => {
    await accessCodeService.invalidate(currentAccessCode);
    const result = await chai.request(server).post('/consent').send({
      accessCode: currentAccessCode.value,
      consent: true,
    });
    result.should.have.status(403);
  });

  it('should update consent', async () => {
    const result = await chai.request(server).post('/consent').send({
      accessCode: currentAccessCode.value,
      consent: true,
    });
    result.should.have.status(200);

    currentAccessCode = await accessCodeService.find({
      id: currentAccessCode.id,
    });
    currentAccessCode.upload_consent.should.be.true;
  });

  it('should update consent and invalidate access code when consent is false', async () => {
    const result = await chai.request(server).post('/consent').send({
      accessCode: currentAccessCode.value,
      consent: false,
    });
    result.should.have.status(200);

    currentAccessCode = await accessCodeService.find({
      id: currentAccessCode.id,
    });
    currentAccessCode.upload_consent.should.be.false;
  });
});
