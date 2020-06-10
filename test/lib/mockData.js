const accessCodes = require('../../db/models/accessCodes');
const organizations = require('../../db/models/organizations');
const points = require('../../db/models/points');

class MockData {

  /**
   * @method clearMockData
   *
   * Clear out Mock Data
   */
  async clearMockData() {
    await accessCodes.deleteAllRows();
    await organizations.deleteAllRows();
    await points.deleteAllRows();
  }

  /**
   * @method mockAccessCode
   *
   * Generates a new mock access code.
   */
  async mockAccessCode() {
    const params = {
      value: "123456",
    };

    await accessCodes.create(params);

    return await accessCodes.find({ value: params.value });
  }

  /**
   * @method mockOrganization
   *
   * Generates a new mock organization.
   */
  async mockOrganization(externalId) {
    if (!externalId) throw new Error('External ID must be provided');

    const params = {
      id: 1,
      external_id: externalId,
      name: 'Mock Organization',
      info_website_url: 'https://info.website.url',
      reference_website_url: 'https://reference.website.url',
      api_endpoint_url: 'https://api.endpoint.url',
      privacy_policy_url: 'https://privacy.policy.url',
      region_coordinates: {
        "ne": { "latitude": 20.312764055951195, "longitude": -70.45445121262883 },
        "sw": { "latitude": 17.766025040122642, "longitude": -75.49442923997258 },
      },
      notification_threshold_percent: 66,
      notification_threshold_count: 6,
    };

    await organizations.create(params);

    return await organizations.find({ id: params.id });
  }

}

module.exports = new MockData();
