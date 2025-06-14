// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await queryInterface.createTable('users', {
//       user_id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//       },
//       name: {
//         type: Sequelize.STRING(50),
//         allowNull: true
//       },
//       email: {
//         type: Sequelize.STRING(70),
//         allowNull: true,
//         unique: true
//       },
//       phone_number: {
//         type: Sequelize.STRING(20),
//         allowNull: true
//       },
//       password: {
//         type: Sequelize.STRING(1000),
//         allowNull: true
//       },
//       day_of_birth: {
//         type: Sequelize.DATEONLY,
//         allowNull: true
//       },
//       gender: {
//         type: Sequelize.STRING(30),
//         allowNull: true
//       },
//       address: {
//         type: Sequelize.STRING(100),
//         allowNull: true
//       },
//       role: {
//         type: Sequelize.STRING(20),
//         allowNull: true,
//         validate: {
//           isIn: [['admin', 'training_officer', 'student', 'lecturer']]
//         }
//       },
//       status: {
//         type: Sequelize.STRING(30),
//         allowNull: true
//       },
//       created_at: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//       },
//       updated_at: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//       }
//     });
//   },

//   async down (queryInterface, Sequelize) {
//     await queryInterface.dropTable('users');
//   }
// };































// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('notifications', {
//       noti_id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//       },
//       title: {
//         type: Sequelize.STRING(50),
//         allowNull: true
//       },
//       description: {
//         type: Sequelize.STRING(100),
//         allowNull: true
//       },
//       type: {
//         type: Sequelize.STRING(40),
//         allowNull: true
//       },
//       priority: {
//         type: Sequelize.STRING(30),
//         allowNull: true
//       },
//       channel: {
//         type: Sequelize.STRING(30),
//         allowNull: true
//       },
//       send_time: {
//         type: Sequelize.DATE,
//         allowNull: true
//       },
//       status: {
//         type: Sequelize.STRING(30),
//         allowNull: true
//       },
//       created_at: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW,
//         allowNull: false
//       },
//       updated_at: {
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.NOW,
//         allowNull: false
//       },
//       user_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'users',
//           key: 'user_id'
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'CASCADE'
//       }
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('notifications');
//   }
// };
