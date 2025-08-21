import { DataTypes } from 'sequelize';

const ProgramSubjectSemesters = (sequelize) => {
  const ProgramSubjectSemestersModel = sequelize.define(
    'ProgramSubjectSemesters',
    {
      // Mã khóa chính
      ps_semester_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Khóa ngoại liên kết đến bảng ProgramSemesters
      program_semester_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      // Khóa ngoại liên kết đến bảng Subjects
      subject_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    {
      tableName: 'programsubjectsemesters',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  );

  // Khai báo mối quan hệ
  ProgramSubjectSemestersModel.associate = (models) => {
    // Bảng này thuộc về một Chương trình-Học kỳ và một Môn học
    ProgramSubjectSemestersModel.belongsTo(models.ProgramSemesters, {
      foreignKey: 'program_semester_id',
      as: 'program_semester',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    ProgramSubjectSemestersModel.belongsTo(models.Subject, {
      foreignKey: 'subject_id',
      as: 'subject',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Bảng này có nhiều lớp học được tạo ra
    ProgramSubjectSemestersModel.hasMany(models.Classes, {
      foreignKey: 'program_subject_id',
      as: 'classes',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  };

  return ProgramSubjectSemestersModel;
};

export default ProgramSubjectSemesters;