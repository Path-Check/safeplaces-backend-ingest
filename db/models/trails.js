const BaseService = require('../common/service.js');
const knex = require('../knex.js');
const knexPostgis = require("knex-postgis");
const geoHash = require('../../app/lib/geoHash');

const st = knexPostgis(knex);

class Service extends BaseService {

  async insertPoints(points, caseId) {
    if (!points) throw new Error('Points are invalid');
    if (caseId == null) throw new Error('Case ID is invalid');

    const pointRecords = [];

    for(let point of points) {
      let record = {};
      let hash = await geoHash.encrypt(point);

      if (hash) {
        record.hash = hash.encodedString;
        record.coordinates = st.setSRID(
          st.makePoint(point.longitude, point.latitude),
          4326
        );
        record.time = new Date(point.time * 1000); // Assumes time in epoch seconds
        record.case_id = caseId;
        pointRecords.push(record);
      }
    }

    return knex(this._name).insert(pointRecords).returning('*');
  }

}

module.exports = new Service('trails');
