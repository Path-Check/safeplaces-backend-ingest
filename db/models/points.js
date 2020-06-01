const BaseService = require('../common/service.js');
const knex = require('../knex.js');
const knexPostgis = require("knex-postgis");
const geoHash = require('../../app/lib/geoHash');

const st = knexPostgis(knex);

class Service extends BaseService {

  async createMany(points, accessCode, uploadId) {
    if (!points) throw new Error('Points are invalid');
    if (!accessCode || !accessCode.id) throw new Error('Access code is invalid');
    if (!uploadId) throw new Error('Upload ID is invalid');

    const pointRecords = [];

    for(let point of points) {
      const record = {};
      const hash = await geoHash.encrypt(point);

      if (hash) {
        record.access_code_id = accessCode.id;
        record.upload_id = uploadId;
        record.hash = hash.encodedString;
        record.coordinates = st.setSRID(
          st.makePoint(point.longitude, point.latitude),
          4326
        );
        record.time = new Date(point.time * 1000); // Assumes time in epoch seconds
        pointRecords.push(record);
      }
    }

    return knex(this._name).insert(pointRecords).returning('*');
  }

}

module.exports = new Service('points');
