'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     */
    await queryInterface.bulkInsert('class_schedules', [
      {
        semester_id: 'PS_CT001_HK1_2025',
        class_id: 'DH23CS',
        program_id: 'CT001',
        date: '2025-08-19',
        slot_id: 'S1',
        subject_id: 'MH001',
        lecturer_id: 'GV001',
        room_id: 'LT1',
        status: 'active',
        notes: 'Môn Lập trình cơ bản - Tiết đầu tuần',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        semester_id: 'PS_CT001_HK1_2025',
        class_id: 'DH23AI',
        program_id: 'CT001',
        date: '2025-08-20',
        slot_id: 'S2',
        subject_id: 'MH002',
        lecturer_id: 'GV002',
        room_id: 'LT2',
        status: 'active',
        notes: 'Môn Cấu trúc dữ liệu và giải thuật',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        semester_id: 'PS_CT001_HK1_2025',
        class_id: 'DH22IT',
        program_id: 'CT001',
        date: '2025-08-20',
        slot_id: 'C1',
        subject_id: 'MH009',
        lecturer_id: 'GV003',
        room_id: 'TH1',
        status: 'active',
        notes: 'Môn Toán rời rạc - Lý thuyết',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('class_schedules', null, {});
  }
};
