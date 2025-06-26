'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('training_officers', [
      {
        staff_id: 'TO001',
        name: 'Nguyễn Văn An',
        email: 'ptvu2100761@student.ctuet.edu.vn',
        day_of_birth: '1985-03-15',
        gender: 'Nam',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone_number: '0901234567',
        department: 'Phòng Đào tạo',
        position: 'Trưởng phòng',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        staff_id: 'TO002',
        name: 'Trần Thị Bình',
        email: 'tran.thi.binh@company.com',
        day_of_birth: '1988-07-22',
        gender: 'Nữ',
        address: '456 Đường XYZ, Quận 3, TP.HCM',
        phone_number: '0912345678',
        department: 'Phòng Đào tạo',
        position: 'Chuyên viên',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        staff_id: 'TO003',
        name: 'Lê Minh Cường',
        email: 'le.minh.cuong@company.com',
        day_of_birth: '1982-11-08',
        gender: 'Nam',
        address: '789 Đường DEF, Quận 5, TP.HCM',
        phone_number: '0923456789',
        department: 'Phòng Đào tạo',
        position: 'Phó phòng',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        staff_id: 'TO004',
        name: 'Phạm Thị Dung',
        email: 'pham.thi.dung@company.com',
        day_of_birth: '1990-05-12',
        gender: 'Nữ',
        address: '321 Đường GHI, Quận 7, TP.HCM',
        phone_number: '0934567890',
        department: 'Phòng Đào tạo',
        position: 'Nhân viên',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        staff_id: 'TO005',
        name: 'Hoàng Văn Em',
        email: 'hoang.van.em@company.com',
        day_of_birth: '1987-09-25',
        gender: 'Nam',
        address: '654 Đường JKL, Quận 2, TP.HCM',
        phone_number: '0945678901',
        department: 'Phòng Đào tạo',
        position: 'Chuyên viên',
        status: 'inactive',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('training_officers', null, {});
  }
};
