import { DataTypes } from 'sequelize';

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
      // Trạng thái môn học
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: 'subjects',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Khai báo mối quan hệ (association)
  SubjectModel.associate = (models) => {
    // Môn học có mối quan hệ nhiều-nhiều với Chương trình và Học kỳ thông qua bảng Program_Subject_Semesters.
    SubjectModel.hasMany(models.ProgramSubjectSemesters, {
      foreignKey: 'subject_id',
      as: 'program_subject_semesters',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Các mối quan hệ với Lecturer là chính xác và được giữ nguyên.
    SubjectModel.belongsToMany(models.Lecturer, {
      through: models.LecturerAssignment,
      foreignKey: 'subject_id',
      otherKey: 'lecturer_id',
      as: 'lecturers'
    });

    SubjectModel.hasMany(models.LecturerAssignment, {
      foreignKey: 'subject_id',
      as: 'lecturerAssignments'
    });
  };

  return SubjectModel;
};

export default Subject;