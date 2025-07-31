export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("break_schedule", {
      break_id: {
        type: Sequelize.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      break_start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      break_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      number_of_days: {
        type: Sequelize.SMALLINT,
        allowNull: true,
      },
      break_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("break_schedule");
  },
};
