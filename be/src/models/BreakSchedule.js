import { DataTypes } from 'sequelize';

const BreakSchedule = (sequelize) => {
  const BreakScheduleModel = sequelize.define('BreakSchedule', { // Model name convention: PascalCase
    break_id: {
      type: DataTypes.STRING(30),
      primaryKey: true,
      allowNull: false,
    },
    break_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    break_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    number_of_days: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    break_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
  }, {
    tableName: 'break_schedule', // Table name convention: snake_case
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  // Define associations here if any.
  // For BreakSchedule, it might have associations with Employees or Classes.
  BreakScheduleModel.associate = (models) => {
    // Example: BreakScheduleModel.belongsTo(models.Employee, { foreignKey: 'employee_id' });
  };

  return BreakScheduleModel;
};

export default BreakSchedule;