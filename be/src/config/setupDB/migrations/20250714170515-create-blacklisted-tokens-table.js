"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    /**
     * Logic để tạo bảng 'blacklisted_tokens'.
     * Hàm `up` sẽ được chạy khi bạn thực hiện `npx sequelize-cli db:migrate`.
     */
    await queryInterface.createTable("blacklisted_tokens", {
      // Cột jti (JWT ID): Định danh duy nhất cho mỗi token bị thu hồi
      jti: {
        type: Sequelize.UUID, // Sử dụng UUID vì jti thường là UUID để đảm bảo tính duy nhất
        allowNull: false, // Không được phép rỗng
        primaryKey: true, // Là khóa chính của bảng
        unique: true, // Mỗi jti phải là duy nhất
      },
      // Cột userId: ID của người dùng sở hữu token này
      user_id: {
        type: Sequelize.UUID, // Giả sử userId của bạn cũng là UUID (hoặc INTEGER nếu bạn dùng số nguyên)
        allowNull: false, // Không được phép rỗng
      },
      // Cột expiresAt: Thời điểm token gốc (refreshToken) hết hạn.
      // Dùng để tự động dọn dẹp các mục đã hết hạn khỏi danh sách đen.
      expires_at: {
        type: Sequelize.DATE, // Kiểu dữ liệu ngày giờ
        allowNull: false, // Không được phép rỗng
      },
      // createdAt: Thời điểm bản ghi được tạo
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Tự động điền thời gian hiện tại
      },
      // updatedAt: Thời điểm bản ghi được cập nhật lần cuối
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Tự động điền thời gian hiện tại
      },
    });

    // Thêm các chỉ mục (indexes) để tối ưu hiệu suất truy vấn
    // Chỉ mục trên userId để tìm kiếm nhanh khi cần thu hồi tất cả token của một người dùng
    await queryInterface.addIndex("blacklisted_tokens", ["user_id"], {
      name: "idx_blacklisted_tokens_user_id",
    });
    // Chỉ mục trên expiresAt để tối ưu quá trình dọn dẹp các token đã hết hạn
    await queryInterface.addIndex("blacklisted_tokens", ["expires_at"], {
      name: "idx_blacklisted_tokens_expires_at",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Logic để xóa bảng 'blacklisted_tokens'.
     * Hàm `down` sẽ được chạy khi bạn thực hiện `npx sequelize-cli db:migrate:undo`.
     */
    await queryInterface.dropTable("blacklisted_tokens");
  },
};
