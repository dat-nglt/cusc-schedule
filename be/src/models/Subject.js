import { DataTypes } from 'sequelize';
// import { on } from 'winston-daily-rotate-file';

// Định nghĩa model Subject - Đại diện cho môn học
const Subject = (sequelize) => {
  const SubjectModel = sequelize.define(
    'Subject',
    {
      // Mã môn học (primary key)
      subject_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Tên môn học
      subject_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // Số tín chỉ
      credit: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      // Số giờ lý thuyết
      theory_hours: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      // Số giờ thực hành
      practice_hours: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      // Trạng thái môn học (VD: active, inactive,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      // Mã học kỳ (liên kết đến bảng Semester)
      semester_id: {
        type: DataTypes.STRING(30),
        allowNull: true,  // Cho phép null
      },
    },
    {
      tableName: 'subjects',         // Tên bảng trong CSDL
      timestamps: true,              // Tự động thêm created_at và updated_at
      createdAt: 'created_at',
      updatedAt: 'updated_at',


    }
  );

  // Khai báo mối quan hệ (association)
  SubjectModel.associate = (models) => {
    // Mỗi môn học thuộc về một học kỳ
    SubjectModel.belongsTo(models.Semester, {
      foreignKey: 'semester_id',
      as: 'semester', // Changed from 'semesters' to 'semester' for singular naming
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Nếu học kỳ bị xóa, môn học sẽ không bị xóa mà chỉ đặt semester_id thành NULL
    });

    // Mối quan hệ nhiều-nhiều: Một Subject có thể được nhiều Lecturer dạy
    SubjectModel.belongsToMany(models.Lecturer, {
      through: models.LecturerAssignment,
      foreignKey: 'subject_id',
      otherKey: 'lecturer_id',
      as: 'lecturers'
    });

    // Mối quan hệ một-nhiều với bảng junction LecturerAssignment
    SubjectModel.hasMany(models.LecturerAssignment, {
      foreignKey: 'subject_id',
      as: 'lecturerAssignments'
    });

  };

  return SubjectModel;
};

export default Subject;