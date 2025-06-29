'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('lecturers', [
      {
        lecturer_id: 'LEC001',
        name: 'Nguyen Van Vu',
        email: 'vu@student.ctuet.edu.vn',
        day_of_birth: '1980-05-15',
        gender: 'Male',
        address: 'Ho Chi Minh City',
        phone_number: '0901234567',
        department: 'Computer Science',
        hire_date: '2010-09-01',
        degree: 'PhD in Computer Science',
        google_id: null,
        status: 'Active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        lecturer_id: 'LEC002',
        name: 'Tran Thi B',
        email: 'tranthib@university.edu.vn',
        day_of_birth: '1985-12-20',
        gender: 'Female',
        address: 'Ha Noi',
        phone_number: '0912345678',
        department: 'Mathematics',
        hire_date: '2015-02-15',
        degree: 'Master in Applied Mathematics',
        google_id: null,
        status: 'Active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        lecturer_id: 'LEC003',
        name: 'Le Van C',
        email: 'levanc@university.edu.vn',
        day_of_birth: '1978-08-10',
        gender: 'Male',
        address: 'Da Nang',
        phone_number: '0923456789',
        department: 'Physics',
        hire_date: '2008-01-10',
        degree: 'PhD in Theoretical Physics',
        google_id: null,
        status: 'Active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lecturers', {
      lecturer_id: ['LEC001', 'LEC002', 'LEC003']
    }, {});
  }
};
