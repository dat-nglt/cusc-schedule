export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("accounts", {
      // Tên bảng: accounts
      id: {
        // Đây sẽ là userId mà các bảng khác liên kết tới
        type: Sequelize.UUID, // Hoặc Sequelize.INTEGER nếu bạn dùng INT
        defaultValue: Sequelize.UUIDV4, // Hoặc Sequelize.DataTypes.INTEGER nếu dùng INT
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(70),
        allowNull: false, // Email nên là NOT NULL cho bảng chính
        unique: true,
      },
      role: {
        type: Sequelize.STRING(30), // Hoặc Sequelize.ENUM nếu bạn muốn định nghĩa rõ các vai trò
        allowNull: false,
      },
      google_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "active",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("accounts");
  },
};
