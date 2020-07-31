const {
  organizationService,
  accessCodeService,
  pointService,
} = require('../../app/lib/db');

class MockData {
  /**
   * @method clearMockData
   *
   * Clear out Mock Data
   */
  async clearMockData() {
    await accessCodeService.deleteAllRows();
    await organizationService.deleteAllRows();
    await pointService.deleteAllRows();
  }

  /**
   * @method mockAccessCode
   *
   * Generates a new mock access code.
   */
  async mockAccessCode() {
    const params = {
      value: '123456',
    };

    await accessCodeService.create(params);

    return await accessCodeService.find({ value: params.value });
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
        ne: { latitude: 20.312764055951195, longitude: -70.45445121262883 },
        sw: { latitude: 17.766025040122642, longitude: -75.49442923997258 },
      },
      notification_threshold_percent: 66,
      notification_threshold_timeframe: 6,
    };

    await organizationService.create(params);

    return await organizationService.find({ id: params.id });
  }
}

module.exports = new MockData();
