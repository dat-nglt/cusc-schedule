'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('programs', {
            program_id: {
                type: Sequelize.STRING(30),
                primaryKey: true,
                allowNull: false
            },
            program_name: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            description: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            status: {
                type: Sequelize.STRING(30),
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('programs');
    }
};
