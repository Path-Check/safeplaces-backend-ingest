// // const _ = require('lodash')
// const { v4: uuidv4 } = require('uuid');
// const bcrypt = require('bcrypt');

// class MockData {

//   /**
//    * @method clearMockData
//    *
//    * Clear out Mock Data
//    */
//   async clearMockData() {
//     // await organizationService.deleteAllRows()
//     // await settingsService.deleteAllRows()
//     // await usersService.deleteAllRows()
//     // await trailsService.deleteAllRows()
//     // await publicationService.deleteAllRows()
//     // await casesService.deleteAllRows()
//   }

//   /**
//    * @method mockUser
//    *
//    * Generate Mock User
//    */
//   async mockUser(options = {}) {
//     if (!options.username) throw new Error('Username must be provided');
//     if (!options.password) throw new Error('Password must be provided');
//     if (!options.organization_id) throw new Error('Organization ID must be provided');
//     if (!options.email) throw new Error('Email must be provided');

//     if (!process.env.SEED_MAPS_API_KEY) {
//       throw new Error('Populate environment variable SEED_MAPS_API_KEY');
//     }

//     const password = await bcrypt.hash(options.password, 5);

//     const params = {
//       id: uuidv4(),
//       organization_id: options.organization_id,
//       username: options.username,
//       password: password,
//       email: options.email,
//       is_admin: true,
//       maps_api_key: process.env.SEED_MAPS_API_KEY,
//     };

//     const results = await usersService.create(params);
//     if (results) {
//       return results[0];
//     }
//     throw new Error('Problem adding the organization.');
//   }
// }

// module.exports = new MockData();

module.exports = {};