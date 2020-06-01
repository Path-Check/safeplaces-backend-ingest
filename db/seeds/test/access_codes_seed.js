exports.seed = function (knex) {
  return knex('access_codes')
    .del()
    .then(async function () {
      return knex('access_codes').insert({
        value: '123456',
      });
    });
};
