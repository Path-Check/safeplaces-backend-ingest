const BaseService = require('../common/service.js');

class Service extends BaseService {

  async findById(id) {
    if (id == null) throw new Error('Filter was not provided');
    return this.findOne({ id: id });
  }

  async updateTermsConsent(id, consent) {
    if (id == null || consent == null) throw new Error('Filter was not provided');

    return await this.updateOne(id, {
      consent_tos: consent,
    });
  }

}

module.exports = new Service('cases');
