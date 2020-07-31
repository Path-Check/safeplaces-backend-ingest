process.env.NODE_ENV = 'test';
process.env.DB_NAME_PUB = process.env.DB_NAME_PUB || 'safeplaces_ingest_test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require('../lib/mockData');
const server = require('../../app');
const { accessCodeService } = require('../../app/lib/db');

chai.use(chaiHttp);

describe('POST /access-code/valid', () => {
  let currentAccessCode;

  beforeEach(async () => {
    await mockData.clearMockData();
    currentAccessCode = await mockData.mockAccessCode();
  });

  it('should fail when request is malformed', async () => {
    let result = await chai
      .request(server.app)
      .post('/access-code/valid')
      .send();

    result.should.have.status(400);
  });

  it('should succeed when code is valid', async () => {
    const result = await chai
      .request(server.app)
      .post('/access-code/valid')
      .send({
        accessCode: currentAccessCode.value,
      });
    result.should.have.status(200);
    result.body.should.have.property('valid');
    result.body.valid.should.be.true;
  });

  it('should succeed when code is invalid', async () => {
    await accessCodeService.invalidate(currentAccessCode);

    const result = await chai
      .request(server.app)
      .post('/access-code/valid')
      .send({
        accessCode: currentAccessCode.value,
      });
    result.should.have.status(200);
    result.body.should.have.property('valid');
    result.body.valid.should.be.false;
  });

  it('should succeed when code does not exist', async () => {
    const result = await chai
      .request(server.app)
      .post('/access-code/valid')
      .send({
        accessCode: 'fake_code',
      });
    result.should.have.status(200);
    result.body.should.have.property('valid');
    result.body.valid.should.be.false;
  });
});
