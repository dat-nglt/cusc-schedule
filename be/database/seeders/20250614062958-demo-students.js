'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('students', [
      {
        student_id: 'SV001',
        name: 'Nguyễn Văn A',
        email: 'ptvu2100761@student.ctuet.edu.vn',
        day_of_birth: '2002-05-15',
        gender: 'Nam',
        address: 'Cần Thơ',
        phone_number: '0912345678',
        class: 'CTK43A',
        admission_year: '2020-09-01',
        gpa: 3.45,
        google_id: 'googleid_sv001',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        student_id: 'SV002',
        name: 'Trần Thị B',
        email: 'thib@student.ctuet.edu.vn',
        day_of_birth: '2001-11-23',
        gender: 'Nữ',
        address: 'Vĩnh Long',
        phone_number: '0987654321',
        class: 'CTK43B',
        admission_year: '2020-09-01',
        gpa: 3.75,
        google_id: 'googleid_sv002',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('students', null, {});
  }
};
