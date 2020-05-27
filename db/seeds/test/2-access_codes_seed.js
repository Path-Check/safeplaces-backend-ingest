exports.seed = function (knex) {
  return knex('access_codes')
    .del()
    .then(async function () {
      return knex('access_codes').insert({
        id: '123456',
        case_id: '4bb79b46-fa77-4f5f-9151-f783f8dbfdc4',
      });
    });
};
