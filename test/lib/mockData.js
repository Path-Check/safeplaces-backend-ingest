const accessCodes = require('../../db/models/accessCodes');
const cases = require('../../db/models/cases');
const trails = require('../../db/models/trails');

class MockData {

  /**
   * @method clearMockData
   *
   * Clear out Mock Data
   */
  async clearMockData() {
    await accessCodes.deleteAllRows();
    await cases.deleteAllRows();
    await trails.deleteAllRows();
  }

  /**
   * @method mockCase
   *
   * Generates a new mock case.
   */
  async mockCase() {
    const params = {
      id: 1,
    };

    await cases.create(params);

    return cases.findById(params.id);
  }

  /**
   * @method mockAccessCode
   *
   * Generates a new mock access code.
   */
  async mockAccessCode(caseId) {
    if (caseId == null) throw new Error('Case must be provided');

    const params = {
      id: "123456",
      case_id: caseId,
    };

    await accessCodes.create(params);

    return await accessCodes.findById(params.id);
  }

}

module.exports = new MockData();
