const BaseService = require('../common/service.js');

class Service extends BaseService {

  async findById(id) {
    if (id == null) throw new Error('Filter was not provided');
    return this.findOne({ id: id });
  }

  async updateConsent(id, consent) {
    if (id == null || consent == null) throw new Error('Filter was not provided');

    return await this.updateOne(id, {
      consent: consent,
    });
  }

}

module.exports = new Service('cases');
