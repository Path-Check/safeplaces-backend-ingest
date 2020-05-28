const BaseService = require('../common/service.js');
const knex = require('../knex.js');

class Service extends BaseService {

  async findById(id) {
    if (id == null) throw new Error('Filter was not provided');

    return this.find({ id: id }).first(
      'id',
      'case_id',
      knex.raw('COALESCE(invalidated_at, NOW()) >= NOW() AS valid'),
    );
  }

  async invalidate(code) {
    if (!code || code.id == null) throw new Error('Filter was not provided');

    await this.updateOne(code.id, {
      invalidated_at: knex.fn.now(),
    });

    code.valid = false;
  }

}

module.exports = new Service('access_codes');
