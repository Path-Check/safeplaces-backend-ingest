process.env.NODE_ENV = 'test';
process.env.DB_NAME = (process.env.DB_NAME || 'safeplaces_ingest_test');

const { v4: uuidv4 } = require('uuid');

const chai = require('chai');
const chaiHttp = require('chai-http');
const mockData = require('../lib/mockData');
const server = require('../../app');

chai.use(chaiHttp);

describe('GET /organization/configuration', () => {
  const externalId = uuidv4();
  let currentOrganization;

  beforeEach(async () => {
    await mockData.clearMockData();
    currentOrganization = await mockData.mockOrganization(externalId);
  });

  it('should fail when request is malformed', async () => {
    let result = await chai
      .request(server.app)
      .get('/organization/configuration')
      .send();
    result.should.have.status(400);
  });

  it('should fail when organization does not exist', async () => {
    const result = await chai
      .request(server.app)
      .get('/organization/configuration')
      .query({ id: uuidv4() })
      .send();
    result.should.have.status(404);
  });

  it('should return the organization configuration', async () => {
    const result = await chai
      .request(server.app)
      .get('/organization/configuration')
      .query({ id: externalId })
      .send();
    result.should.have.status(200);
    result.body.should.be.a('object');
    result.body.name.should.equal(currentOrganization.name);
    result.body.notificationThresholdPercent.should.equal(currentOrganization.notificationThresholdPercent);
    result.body.notificationThresholdCount.should.equal(currentOrganization.notificationThresholdCount);
    result.body.regionCoordinates.should.be.a('object');
    result.body.apiEndpointUrl.should.equal(currentOrganization.apiEndpointUrl);
    result.body.referenceWebsiteUrl.should.equal(currentOrganization.referenceWebsiteUrl);
    result.body.infoWebsiteUrl.should.equal(currentOrganization.infoWebsiteUrl);
    result.body.privacyPolicyUrl.should.equal(currentOrganization.privacyPolicyUrl);
  });
});
