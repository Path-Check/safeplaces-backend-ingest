exports.seed = function (knex) {
  return knex('cases')
    .del()
    .then(async function () {
      return knex('cases').insert({
        id: '4bb79b46-fa77-4f5f-9151-f783f8dbfdc4',
      });
    });
};
