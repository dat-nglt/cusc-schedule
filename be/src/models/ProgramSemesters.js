import { DataTypes } from 'sequelize';

const ProgramSemesters = (sequelize) => {
  const ProgramSemestersModel = sequelize.define(
    'ProgramSemesters',
    {
      // Mã khóa chính
      program_semester_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      // Khóa ngoại liên kết đến bảng Programs
      program_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      // Khóa ngoại liên kết đến bảng Semesters
      semester_id: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      // Số thứ tự học kỳ trong chương trình (ví dụ: 1, 2, 3...)
      semester_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'programsemesters',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  );

  // Khai báo mối quan hệ
  ProgramSemestersModel.associate = (models) => {
    // Bảng này thuộc về một Chương trình và một Học kỳ
    ProgramSemestersModel.belongsTo(models.Program, {
      foreignKey: 'program_id',
      as: 'program',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    ProgramSemestersModel.belongsTo(models.Semester, {
      foreignKey: 'semester_id',
      as: 'semester',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    // Bảng này chứa nhiều môn học thông qua bảng trung gian tiếp theo
    ProgramSemestersModel.hasMany(models.ProgramSubjectSemesters, {
      foreignKey: 'program_semester_id',
      as: 'program_subjects',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  return ProgramSemestersModel;
};

export default ProgramSemesters;