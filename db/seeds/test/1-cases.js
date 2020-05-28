exports.seed = function (knex) {
  return knex('cases')
    .del()
    .then(async function () {
      return knex('cases').insert({
        id: '1',
      });
    });
};
