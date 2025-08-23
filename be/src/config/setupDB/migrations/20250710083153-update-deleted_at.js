"use strict";

export default {
  async up(queryInterface, Sequelize) {
    const tables = [
      "admins",
      "break_schedule",
      "classes",
      "courses",
      "lecturers",
      "programs",
      "semesters",
      "students",
      "subjects",
      "training_officers",
    ];

    for (const table of tables) {
      const tableDescription = await queryInterface.describeTable(table);
      if (!tableDescription.deleted_at) {
        await queryInterface.addColumn(table, "deleted_at", {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null,
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tables = [
      "admins",
      "break_schedule",
      "classes",
      "courses",
      "lecturers",
      "programs",
      "semesters",
      "students",
      "subjects",
      "training_officers",
    ];

    for (const table of tables) {
      const tableDescription = await queryInterface.describeTable(table);
      if (tableDescription.deleted_at) {
        await queryInterface.removeColumn(table, "deleted_at");
      }
    }
  },
};
