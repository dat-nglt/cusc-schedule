import { DataTypes } from 'sequelize';

const Semester = (sequelize) => {
  const SemesterModel = sequelize.define('Semester', {
    semester_id: {
      type: DataTypes.STRING(30),
      primaryKey: true,
      allowNull: false
    },
    semester_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    program_id: {
      type: DataTypes.STRING(30),
      allowNull: true,
      // References are typically defined in associations, not here in define.
      // We'll move this to the associate method.
    }
  }, {
    tableName: 'semesters',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Define associations
  SemesterModel.associate = (models) => {
    // A Semester belongs to a Program
    SemesterModel.belongsTo(models.Program, {
      foreignKey: 'program_id',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  };

  return SemesterModel;
};

export default Semester;