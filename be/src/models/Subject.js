import { DataTypes } from "sequelize";

// Định nghĩa model Subject - Đại diện cho môn học
const Subject = (sequelize) => {
  const SubjectModel = sequelize.define(
    "Subject",
    {
      subject_id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      subject_name: { type: DataTypes.STRING(50), allowNull: true },
      credit: { type: DataTypes.SMALLINT, allowNull: true },
      theory_hours: { type: DataTypes.SMALLINT, allowNull: true },
      practice_hours: { type: DataTypes.SMALLINT, allowNull: true },
      status: { type: DataTypes.STRING(30), allowNull: true },
    },
    {
      tableName: "subjects",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // bật soft delete
      deletedAt: "deleted_at",
      underscored: true, // snake_case cho cột
    }
  );

  // Khai báo mối quan hệ (association)
  SubjectModel.associate = (models) => {
    // Môn học có mối quan hệ nhiều-nhiều với Chương trình và Học kỳ thông qua bảng Program_Subject_Semesters.
    SubjectModel.hasMany(models.ProgramSubjectSemesters, {
      foreignKey: "subject_id",
      as: "program_subject_semesters",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Các mối quan hệ với Lecturer là chính xác và được giữ nguyên.
    SubjectModel.belongsToMany(models.Lecturer, {
      through: models.LecturerAssignment,
      foreignKey: "subject_id",
      otherKey: "lecturer_id",
      as: "lecturers",
    });

    SubjectModel.hasMany(models.LecturerAssignment, {
      foreignKey: "subject_id",
      as: "lecturerAssignments",
    });
  };

  return SubjectModel;
};

export default Subject;
