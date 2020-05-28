exports.seed = function (knex) {
  return knex('access_codes')
    .del()
    .then(async function () {
      return knex('access_codes').insert({
        id: '123456',
        case_id: '1',
      });
    });
};
