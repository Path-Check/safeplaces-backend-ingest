const accessCodes = require('../../db/models/accessCodes');
const points = require('../../db/models/points');

class MockData {

  /**
   * @method clearMockData
   *
   * Clear out Mock Data
   */
  async clearMockData() {
    await accessCodes.deleteAllRows();
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

}

module.exports = new MockData();
