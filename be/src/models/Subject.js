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
      // Trạng thái môn học (VD: active, inactive,...)
      status: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      // Mã học kỳ (liên kết đến bảng Semester)
      semester_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
        // Quan hệ được định nghĩa rõ hơn bên dưới
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
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Gợi ý thêm: Một môn học có thể do nhiều giảng viên dạy hoặc sinh viên đăng ký
    // SubjectModel.belongsToMany(models.Lecturer, {
    //   through: 'LecturerSubjects',
    //   foreignKey: 'subject_id',
    // });

    // SubjectModel.belongsToMany(models.Student, {
    //   through: 'StudentSubjects',
    //   foreignKey: 'subject_id',
    // });
  };

  return SubjectModel;
};

export default Subject;
